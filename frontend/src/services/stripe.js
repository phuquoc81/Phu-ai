import { loadStripe } from '@stripe/stripe-js';
import api from './api';

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Redirect to Stripe Checkout for a subscription plan.
 * @param {string} priceId - Stripe Price ID
 */
export const redirectToCheckout = async (priceId) => {
  const stripe = await getStripe();
  const { data } = await api.post('/billing/create-checkout-session', { priceId });
  const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
  if (error) throw new Error(error.message);
};

/**
 * Open Stripe Customer Portal for subscription management.
 */
export const openCustomerPortal = async () => {
  const { data } = await api.post('/billing/create-portal-session');
  window.location.href = data.url;
};

/**
 * Fetch available subscription plans from backend.
 */
export const fetchPlans = async () => {
  const { data } = await api.get('/billing/plans');
  return data.plans;
};
