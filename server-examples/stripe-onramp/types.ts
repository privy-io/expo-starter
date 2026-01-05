/**
 * TypeScript types for Stripe Crypto Onramp API
 */

// Verification status for KYC and document verification
export type VerificationStatus =
  | 'not_started'
  | 'pending'
  | 'verified'
  | 'failed';

// Verification entry from crypto customer
export interface Verification {
  name: 'kyc_verified' | 'id_document_verified';
  status: VerificationStatus;
}

// Crypto customer response
export interface CryptoCustomer {
  id: string;
  object: 'crypto.customer';
  provided_fields: string[];
  verifications: Verification[];
  created: number;
  livemode: boolean;
}

// Customer status returned to frontend
export interface CustomerStatus {
  customerId: string;
  providedFields: string[];
  kycStatus: VerificationStatus;
  idDocStatus: VerificationStatus;
  hasWallet: boolean;
  hasPaymentMethod: boolean;
}

// Wallet registration request
export interface WalletRegistration {
  address: string;
  network: SupportedNetwork;
}

// Supported destination networks (for USDC stablecoins)
export type SupportedNetwork =
  | 'base'
  | 'polygon'
  | 'solana'
  | 'avalanche';

// Supported source currencies
export type SourceCurrency = 'usd.fiat' | 'eur.fiat' | 'gbp.fiat';

// Supported destination currencies (stablecoins only)
export type DestinationCurrency =
  | 'usdc.base'
  | 'usdc.polygon'
  | 'usdc.solana'
  | 'usdc.avalanche';

// Create onramp session request body
export interface CreateOnrampSessionRequest {
  cryptoCustomerId: string;
  paymentToken: string;
  walletId: string;
  sourceCurrency: SourceCurrency;
  destinationCurrency: DestinationCurrency;
  sourceAmount: string;
  customerIpAddress: string;
}

// Onramp session response
export interface OnrampSession {
  id: string;
  object: 'crypto.onramp_session';
  status: OnrampSessionStatus;
  client_secret?: string;
  crypto_customer_id: string;
  source_currency: string;
  source_amount: string;
  destination_currency: string;
  destination_amount?: string;
  transaction_details?: TransactionDetails;
  error_reason?: OnrampErrorReason;
  created: number;
  livemode: boolean;
}

// Onramp session status
export type OnrampSessionStatus =
  | 'initialized'
  | 'requires_action'
  | 'processing'
  | 'completed'
  | 'failed';

// Transaction details after successful checkout
export interface TransactionDetails {
  blockchain_tx_id?: string;
  destination_amount: string;
  destination_currency: string;
  exchange_rate: string;
  fees: Fee[];
  source_amount: string;
  source_currency: string;
}

// Fee breakdown
export interface Fee {
  amount: string;
  currency: string;
  type: 'network_fee' | 'platform_fee' | 'spread';
}

// Possible error reasons from checkout
export type OnrampErrorReason =
  | 'location_not_supported'
  | 'transaction_limit_reached'
  | 'charged_with_expired_quote'
  | 'action_required'
  | 'transaction_failed'
  | 'missing_kyc'
  | 'missing_document_verification'
  | 'missing_consumer_wallet';

// Checkout response
export interface CheckoutResponse {
  status: OnrampSessionStatus;
  client_secret?: string;
  transaction_details?: TransactionDetails;
  error_reason?: OnrampErrorReason;
}

// API error response
export interface ApiError {
  error: {
    code: string;
    message: string;
    type: string;
  };
}
