# Stripe Crypto Onramp Backend Examples

This directory contains example backend code for integrating with Stripe's Crypto Onramp API.

## Overview

The headless crypto onramp flow requires a backend to:

1. Fetch crypto customer status and verification details
2. Create onramp sessions with transaction parameters
3. Execute checkout to complete the transaction

## Prerequisites

- Node.js 18+
- Stripe account with Crypto Onramp access (private beta)
- Stripe secret key with crypto permissions

## Installation

```bash
npm install stripe express cors
npm install -D typescript @types/express @types/cors ts-node
```

## Environment Variables

Create a `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_...
PORT=3000
```

## Running the Server

```bash
# Development
npx ts-node server.ts

# Or with nodemon for auto-reload
npx nodemon --exec ts-node server.ts
```

## API Endpoints

### GET /api/crypto/customer/:id
Fetches crypto customer status including KYC verification and registered wallets.

**Headers:**
- `stripe-oauth-token`: OAuth token from the SDK's `authenticateUser()` call

### POST /api/crypto/onramp
Creates a new onramp session for a transaction.

**Body:**
```json
{
  "cryptoCustomerId": "cust_xxx",
  "paymentToken": "tok_xxx",
  "walletId": "wal_xxx",
  "sourceCurrency": "usd.fiat",
  "destinationCurrency": "usdc.base",
  "sourceAmount": "100",
  "customerIpAddress": "1.2.3.4"
}
```

### POST /api/crypto/onramp/:sessionId/checkout
Completes the checkout for an onramp session.

## Mobile App Integration

In your Expo app, call these endpoints like this:

```typescript
// After authenticating with Link
const status = await fetch(`${API_URL}/api/crypto/customer/${customerId}`, {
  headers: {
    'stripe-oauth-token': oauthToken
  }
}).then(r => r.json());

// Create session and checkout
const session = await fetch(`${API_URL}/api/crypto/onramp`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cryptoCustomerId,
    paymentToken,
    walletId,
    sourceCurrency: 'usd.fiat',
    destinationCurrency: 'usdc.base',
    sourceAmount: '100',
    customerIpAddress: await getClientIp()
  })
}).then(r => r.json());

// Complete checkout (called from performCheckout callback)
const checkout = await fetch(`${API_URL}/api/crypto/onramp/${session.id}/checkout`, {
  method: 'POST'
}).then(r => r.json());
```

## Resources

- [Stripe Crypto Onramp Docs](https://docs.stripe.com/crypto/onramp)
- [Privy Headless Onramp Recipe](https://docs.privy.io/recipes/stripe-headless-onramp)
