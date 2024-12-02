
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authenticateToken = require('../middleware/authenticateToken');

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.subscriptionStatus === 'active' && user.stripeCustomerId) {
      try {
        const customer = await stripe.customers.retrieve(user.stripeCustomerId);
        if (customer.invoice_settings.default_payment_method) {
          const paymentMethod = await stripe.paymentMethods.retrieve(customer.invoice_settings.default_payment_method);
          
          user = user.toObject();
          user.lastFourDigits = paymentMethod.card.last4;
          user.cardExpiry = `${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year}`;
        } else {
          console.log('No default payment method found for customer');
        }
      } catch (stripeError) {
        console.error('Error retrieving Stripe data:', stripeError);
      }
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;