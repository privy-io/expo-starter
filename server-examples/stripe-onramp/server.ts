/**
 * Express server with Stripe Crypto Onramp API routes
 *
 * This is an example implementation. In production:
 * - Add proper authentication/authorization
 * - Implement rate limiting
 * - Add request validation
 * - Use environment-specific error handling
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import type {
  CreateOnrampSessionRequest,
  CryptoCustomer,
  CustomerStatus,
  OnrampSession,
  CheckoutResponse,
  Verification,
} from './types';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_API_BASE = 'https://api.stripe.com/v1';

if (!STRIPE_SECRET_KEY) {
  console.error('WARNING: STRIPE_SECRET_KEY is not set');
}

/**
 * Helper to make Stripe API requests
 */
async function stripeRequest<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST';
    body?: URLSearchParams;
    oauthToken?: string;
  } = {}
): Promise<T> {
  const { method = 'GET', body, oauthToken } = options;

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  if (oauthToken) {
    headers['Stripe-OAuth-Token'] = oauthToken;
  }

  const response = await fetch(`${STRIPE_API_BASE}${endpoint}`, {
    method,
    headers,
    body: body?.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Stripe API error');
  }

  return data as T;
}

/**
 * GET /api/crypto/customer/:id
 *
 * Fetches crypto customer status including KYC verification and registered wallets.
 * Requires the OAuth token from the SDK's authenticateUser() call.
 */
app.get('/api/crypto/customer/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const oauthToken = req.headers['stripe-oauth-token'] as string;

    if (!oauthToken) {
      return res.status(401).json({ error: 'Missing stripe-oauth-token header' });
    }

    // Fetch customer data
    const customer = await stripeRequest<CryptoCustomer>(
      `/crypto/customers/${id}`,
      { oauthToken }
    );

    // Extract verification statuses
    const kycVerified = customer.verifications.find(
      (v: Verification) => v.name === 'kyc_verified'
    );
    const idDocVerified = customer.verifications.find(
      (v: Verification) => v.name === 'id_document_verified'
    );

    // Fetch wallets to check if user has registered one
    const walletsResponse = await stripeRequest<{ data: any[] }>(
      `/crypto/customers/${id}/crypto_consumer_wallets`,
      { oauthToken }
    );

    // Fetch payment methods
    const paymentTokensResponse = await stripeRequest<{ data: any[] }>(
      `/crypto/customers/${id}/payment_tokens`,
      { oauthToken }
    );

    const status: CustomerStatus = {
      customerId: customer.id,
      providedFields: customer.provided_fields,
      kycStatus: kycVerified?.status || 'not_started',
      idDocStatus: idDocVerified?.status || 'not_started',
      hasWallet: walletsResponse.data.length > 0,
      hasPaymentMethod: paymentTokensResponse.data.length > 0,
    };

    res.json(status);
  } catch (error: any) {
    console.error('Error fetching crypto customer:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/crypto/onramp
 *
 * Creates a new onramp session for a crypto purchase transaction.
 */
app.post('/api/crypto/onramp', async (req: Request, res: Response) => {
  try {
    const {
      cryptoCustomerId,
      paymentToken,
      walletId,
      sourceCurrency,
      destinationCurrency,
      sourceAmount,
      customerIpAddress,
    }: CreateOnrampSessionRequest = req.body;

    // Validate required fields
    if (!cryptoCustomerId || !paymentToken || !walletId || !sourceAmount) {
      return res.status(400).json({
        error: 'Missing required fields: cryptoCustomerId, paymentToken, walletId, sourceAmount'
      });
    }

    const body = new URLSearchParams({
      ui_mode: 'headless',
      crypto_customer_id: cryptoCustomerId,
      payment_token: paymentToken,
      wallet_id: walletId,
      source_currency: sourceCurrency || 'usd.fiat',
      destination_currency: destinationCurrency || 'usdc.base',
      source_amount: sourceAmount,
      customer_ip_address: customerIpAddress,
      off_session: 'false',
    });

    const session = await stripeRequest<OnrampSession>(
      '/crypto/onramp_sessions',
      { method: 'POST', body }
    );

    res.json(session);
  } catch (error: any) {
    console.error('Error creating onramp session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/crypto/onramp/:sessionId/checkout
 *
 * Completes the checkout for an onramp session.
 * This initiates the actual crypto purchase.
 */
app.post('/api/crypto/onramp/:sessionId/checkout', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const result = await stripeRequest<OnrampSession>(
      `/crypto/onramp_sessions/${sessionId}/checkout`,
      { method: 'POST' }
    );

    // Check for errors
    if (result.error_reason) {
      return res.status(400).json({
        status: result.status,
        error_reason: result.error_reason,
      });
    }

    const response: CheckoutResponse = {
      status: result.status,
      client_secret: result.client_secret,
      transaction_details: result.transaction_details,
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error completing checkout:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/crypto/onramp/:sessionId
 *
 * Fetches the current status of an onramp session.
 * Useful for polling transaction status.
 */
app.get('/api/crypto/onramp/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await stripeRequest<OnrampSession>(
      `/crypto/onramp_sessions/${sessionId}`
    );

    res.json(session);
  } catch (error: any) {
    console.error('Error fetching onramp session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Stripe Onramp API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
