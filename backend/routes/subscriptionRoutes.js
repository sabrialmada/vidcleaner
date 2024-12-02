
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');
const { createLogger, format, transports } = require('winston');
const rateLimit = require('express-rate-limit');

// Setup Winston logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'subscription-service' },
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple()
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Check subscription status
router.get('/status', authenticateToken, limiter, async (req, res) => {
  try {
    logger.info('Checking subscription status for user:', { userId: req.user.id });
    const user = await User.findById(req.user.id);
    if (!user) {
      logger.warn('User not found in database', { userId: req.user.id });
      return res.status(404).json({ message: 'User not found' });
    }
    const isSubscribed = user.subscriptionStatus === 'active';
    logger.info('Subscription status retrieved', { userId: req.user.id, isSubscribed });
    res.json({ 
      isSubscribed, 
      subscriptionStatus: user.subscriptionStatus,
      subscriptionEndDate: user.subscriptionEndDate
    });
  } catch (error) {
    logger.error('Error checking subscription status:', { userId: req.user.id, error: error.message });
    res.status(500).json({ message: 'Error checking subscription status' });
  }
});

// New route to create checkout session
router.post('/create-checkout-session', authenticateToken, limiter, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create or get customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id }
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Create the session with client_reference_id
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription?canceled=true`,
      client_reference_id: user.id, // This is crucial for identifying the user
      metadata: {
        userId: user.id // Backup identification method
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    logger.error('Error creating checkout session:', { userId: req.user.id, error: error.message });
    res.status(500).json({ message: 'Error creating checkout session' });
  }
});

// Create a subscription
router.post('/create', authenticateToken, limiter, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const user = await User.findById(req.user.id);

    let customer;
    if (user.stripeCustomerId) {
      try {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
      } catch (error) {
        if (error.code === 'resource_missing') {
          customer = await createStripeCustomer(user, paymentMethodId);
        } else {
          throw error;
        }
      }
    } else {
      customer = await createStripeCustomer(user, paymentMethodId);
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_PRICE_ID }],
      default_payment_method: paymentMethodId,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    await updateUserSubscription(user, subscription);

    logger.info('Subscription created successfully', { userId: user.id, subscriptionId: subscription.id });
    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    logger.error('Subscription creation error:', { userId: req.user.id, error: error.message });
    res.status(500).json({ error: 'Error creating subscription' });
  }
});

// Confirm subscription
router.post('/confirm', authenticateToken, limiter, async (req, res) => {
    try {
      logger.info('Confirming subscription for user:', { userId: req.user.id });
      const { subscriptionId } = req.body;
      const user = await User.findById(req.user.id);
  
      if (!user) {
        logger.warn('User not found in database', { userId: req.user.id });
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.stripeSubscriptionId !== subscriptionId) {
        logger.warn('Subscription ID mismatch', { userId: req.user.id, providedSubId: subscriptionId, userSubId: user.stripeSubscriptionId });
        return res.status(400).json({ message: 'Invalid subscription ID' });
      }
  
      // Here you might want to check the status with Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
      if (subscription.status === 'active') {
        user.subscriptionStatus = 'active';
        await user.save();
        logger.info('Subscription confirmed successfully', { userId: user.id, subscriptionId });
        res.json({ message: 'Subscription confirmed successfully' });
      } else {
        logger.warn('Subscription not active in Stripe', { userId: user.id, subscriptionId, status: subscription.status });
        res.status(400).json({ message: 'Subscription is not active' });
      }
    } catch (error) {
      logger.error('Error confirming subscription:', { userId: req.user.id, error: error.message });
      res.status(500).json({ message: 'Error confirming subscription' });
    }
  });

// Cancel subscription
// Cancel subscription
router.post('/cancel', authenticateToken, limiter, async (req, res) => {
  try {
    logger.info('Cancelling subscription for user:', { userId: req.user.id });
    const user = await User.findById(req.user.id);

    if (!user) {
      logger.warn('User not found in database', { userId: req.user.id });
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.stripeSubscriptionId) {
      logger.warn('No subscription ID found for user', { userId: req.user.id });
      return res.status(400).json({ message: 'No active subscription found' });
    }

    try {
      // First verify the subscription exists
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      // Then update it
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true
      });

      user.subscriptionStatus = 'cancelling';
      await user.save();

      logger.info('Subscription cancelled successfully', { 
        userId: user.id, 
        subscriptionId: user.stripeSubscriptionId 
      });
      
      res.json({ 
        message: 'Subscription will be cancelled at the end of the billing period',
        status: 'cancelling'
      });
    } catch (stripeError) {
      logger.error('Stripe error during cancellation:', { 
        error: stripeError.message,
        userId: user.id,
        subscriptionId: user.stripeSubscriptionId
      });
      
      if (stripeError.code === 'resource_missing') {
        user.subscriptionStatus = 'inactive';
        user.stripeSubscriptionId = null;
        await user.save();
        return res.status(400).json({ message: 'Subscription not found in Stripe' });
      }
      
      throw stripeError;
    }
  } catch (error) {
    logger.error('Error cancelling subscription:', { 
      userId: req.user.id, 
      error: error.message 
    });
    res.status(500).json({ message: 'Error cancelling subscription' });
  }
});

// Webhook to handle subscription status updates
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    console.log('Received webhook with signature:', sig);
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('Webhook event constructed:', event.type, JSON.stringify(event.data.object));

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Get client_reference_id which contains user ID
        const userId = session.client_reference_id;
        console.log('Processing checkout completion:', { userId, customerEmail: session.customer_email });

        const user = await User.findById(userId);
        if (!user) {
          console.error('User not found:', userId);
          return res.json({received: true});
        }

        // Update user subscription details
        user.stripeCustomerId = session.customer;
        user.stripeSubscriptionId = session.subscription;
        user.subscriptionStatus = 'active';
        user.subscriptionStartDate = new Date();
        user.subscriptionPlan = 'Monthly';
        user.subscriptionAmount = 29.00;

        // Get subscription end date from Stripe
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);

        await user.save();
        console.log('User subscription activated:', {
          userId: user.id,
          email: user.email,
          status: 'active'
        });
        break;

      case 'invoice.paid':
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handlePaymentSucceeded(invoice);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
    }

    res.json({received: true});
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

async function handlePaymentSucceeded(invoice) {
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const user = await User.findOne({ stripeCustomerId: invoice.customer });
    
    if (user) {
      user.subscriptionStatus = 'active';
      user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
      await user.save();
      console.log('Subscription renewed:', {
        userId: user.id,
        subscriptionId: subscription.id
      });
    }
  } catch (error) {
    console.error('Error in handlePaymentSucceeded:', error);
  }
}

async function handlePaymentSuccess(session) {
  try {
    console.log('Payment success data:', {
      customerEmail: session.customer_details?.email,
      customerId: session.customer
    });

    // Try to find user by email
    const user = await User.findOne({ 
      email: session.customer_details?.email?.toLowerCase()
    });

    if (!user) {
      console.error('User not found for email:', session.customer_details?.email);
      return;
    }

    // Update user subscription details
    user.stripeCustomerId = session.customer;
    user.subscriptionStatus = 'active';
    user.subscriptionStartDate = new Date();
    user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    user.subscriptionPlan = 'Monthly';
    user.subscriptionAmount = 29.00;

    await user.save();
    console.log('User subscription activated:', {
      userId: user.id,
      email: user.email,
      status: 'active'
    });
  } catch (error) {
    console.error('Error in handlePaymentSuccess:', error);
  }
}

async function handlePaymentFailed(invoice) {
  logger.warn('Payment failed for subscription:', { subscriptionId: invoice.subscription });
  const user = await User.findOne({ stripeSubscriptionId: invoice.subscription });
  if (user) {
    user.subscriptionStatus = 'inactive';
    await user.save();
    logger.info('User subscription status updated to inactive', { userId: user.id });
  }
}

async function handleSubscriptionDeleted(subscription) {
  logger.info('Subscription deleted:', { subscriptionId: subscription.id });
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  if (user) {
    user.subscriptionStatus = 'inactive';
    user.stripeSubscriptionId = null;
    user.subscriptionEndDate = null;
    await user.save();
    logger.info('User subscription status updated', { userId: user.id, status: 'inactive' });
  }
}

async function handleSubscriptionUpdate(subscription) {
  logger.info('Subscription updated:', { subscriptionId: subscription.id });
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  if (user) {
    user.subscriptionStatus = subscription.status;
    user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
    await user.save();
    logger.info('User subscription status and end date updated', { userId: user.id, status: subscription.status });
  }
}

async function createStripeCustomer(user, paymentMethodId) {
  const customer = await stripe.customers.create({
    email: user.email,
    payment_method: paymentMethodId,
    invoice_settings: { default_payment_method: paymentMethodId },
    metadata: { userId: user.id }
  });
  user.stripeCustomerId = customer.id;
  await user.save();
  return customer;
}

async function updateUserSubscription(user, subscription) {
  user.subscriptionStatus = 'pending';
  user.stripeSubscriptionId = subscription.id;
  user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
  user.subscriptionStartDate = new Date();
  user.subscriptionPlan = 'Monthly';
  user.subscriptionAmount = 29.00;
  await user.save();
}

module.exports = router;