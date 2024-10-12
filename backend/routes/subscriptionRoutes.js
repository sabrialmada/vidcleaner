/* const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');

// Check subscription status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    console.log('Checking subscription status for user:', req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user);
    const isSubscribed = user.subscriptionStatus === 'active';
    console.log('Is user subscribed?', isSubscribed);
    res.json({ 
      isSubscribed, 
      subscriptionStatus: user.subscriptionStatus,
      subscriptionEndDate: user.subscriptionEndDate
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    res.status(500).json({ message: 'Error checking subscription status' });
  }
});

// Create a subscription
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const user = await User.findById(req.user.id);

    let customer;
    if (user.stripeCustomerId) {
      try {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
      } catch (error) {
        if (error.code === 'resource_missing') {
          customer = await stripe.customers.create({
            email: user.email,
            payment_method: paymentMethodId,
            invoice_settings: { default_payment_method: paymentMethodId },
            metadata: { userId: user.id }
          });
          user.stripeCustomerId = customer.id;
          await user.save();
        } else {
          throw error;
        }
      }
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
        metadata: { userId: user.id }
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_PRICE_ID }],
      default_payment_method: paymentMethodId,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    user.subscriptionStatus = 'pending';
    user.stripeSubscriptionId = subscription.id;
    user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
    user.subscriptionStartDate = new Date();
    user.subscriptionPlan = 'Monthly';
    user.subscriptionAmount = 49.00;
    await user.save();

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
});

// Cancel subscription
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    console.log('Cancelling subscription for user:', req.user.id);
    const user = await User.findById(req.user.id);

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.subscriptionStatus !== 'active') {
      console.log('No active subscription to cancel');
      return res.status(400).json({ message: 'No active subscription to cancel' });
    }

    console.log('Updating Stripe subscription');
    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    console.log('Updating user subscription status');
    user.subscriptionStatus = 'cancelling';
    // Keep the subscriptionEndDate as is, since it will be valid until the end of the current period
    await user.save();

    console.log('Subscription cancelled successfully');
    res.json({ message: 'Subscription will be cancelled at the end of the billing period' });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Error cancelling subscription' });
  }
});

// Webhook to handle subscription status updates
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Received Stripe webhook event:', event.type);

  try {
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
    }

    res.json({received: true});
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send(`Webhook Error: ${error.message}`);
  }
});

async function handlePaymentSucceeded(invoice) {
  console.log('Payment succeeded for subscription:', invoice.subscription);
  const user = await User.findOne({ stripeSubscriptionId: invoice.subscription });
  if (user) {
    user.subscriptionStatus = 'active';
    user.subscriptionEndDate = new Date(invoice.lines.data[0].period.end * 1000);
    await user.save();
    console.log('User subscription status updated to active and end date updated');
  }
}

async function handlePaymentFailed(invoice) {
  console.log('Payment failed for subscription:', invoice.subscription);
  const user = await User.findOne({ stripeSubscriptionId: invoice.subscription });
  if (user) {
    user.subscriptionStatus = 'inactive';
    // Don't change the subscriptionEndDate here, as they might still pay before it expires
    await user.save();
    console.log('User subscription status updated to inactive');
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  if (user) {
    user.subscriptionStatus = 'inactive';
    user.stripeSubscriptionId = null;
    user.subscriptionEndDate = null;
    await user.save();
    console.log('User subscription status updated to inactive, ID removed, and end date cleared');
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  if (user) {
    user.subscriptionStatus = subscription.status;
    user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
    await user.save();
    console.log('User subscription status and end date updated');
  }
}

module.exports = router; */


// FOR PRODUCTION 


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
router.post('/cancel', authenticateToken, limiter, async (req, res) => {
  try {
    logger.info('Cancelling subscription for user:', { userId: req.user.id });
    const user = await User.findById(req.user.id);

    if (!user) {
      logger.warn('User not found in database', { userId: req.user.id });
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.subscriptionStatus !== 'active') {
      logger.warn('No active subscription to cancel', { userId: req.user.id });
      return res.status(400).json({ message: 'No active subscription to cancel' });
    }

    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    user.subscriptionStatus = 'cancelling';
    await user.save();

    logger.info('Subscription cancelled successfully', { userId: user.id, subscriptionId: subscription.id });
    res.json({ message: 'Subscription will be cancelled at the end of the billing period' });
  } catch (error) {
    logger.error('Error cancelling subscription:', { userId: req.user.id, error: error.message });
    res.status(500).json({ message: 'Error cancelling subscription' });
  }
});

// Webhook to handle subscription status updates
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', { error: err.message });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  logger.info('Received Stripe webhook event:', { type: event.type });

  try {
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
    }

    res.json({received: true});
  } catch (error) {
    logger.error('Error processing webhook:', { error: error.message });
    res.status(500).send(`Webhook Error: ${error.message}`);
  }
});

async function handlePaymentSucceeded(invoice) {
  logger.info('Payment succeeded for subscription:', { subscriptionId: invoice.subscription });
  const user = await User.findOne({ stripeSubscriptionId: invoice.subscription });
  if (user) {
    user.subscriptionStatus = 'active';
    user.subscriptionEndDate = new Date(invoice.lines.data[0].period.end * 1000);
    await user.save();
    logger.info('User subscription status updated to active', { userId: user.id });
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

async function handleSubscriptionUpdated(subscription) {
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
  user.subscriptionAmount = 49.00;
  await user.save();
}

module.exports = router;