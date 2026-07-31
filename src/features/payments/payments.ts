import { apiClient } from '@/services/http/client';

type PaymentStatus = 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded';
type PaymentMethod = 'bank_transfer' | 'momo' | 'zalopay' | 'vnpay';
type PaymentReturnStatus = 'success' | 'failed' | 'invalid' | 'not_found' | 'amount_mismatch';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionCode?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentReturnResult {
  status: PaymentReturnStatus;
  paymentId?: string;
}

const MOBILE_PLATFORM_HEADER = 'X-Client-Platform';

export const paymentsApi = {
  getOrCreatePendingPayment(bookingId: string) {
    return apiClient.post<Payment>(`/payments/pending-for-booking/${bookingId}`);
  },

  createVnpayUrl(paymentId: string) {
    return apiClient.post<{ paymentUrl: string }>(`/payments/${paymentId}/vnpay-url`, undefined, {
      headers: { [MOBILE_PLATFORM_HEADER]: 'mobile' },
    });
  },
};

const PAYMENT_RETURN_SCHEME = 'bookingfield';
const PAYMENT_RETURN_PATH = 'payment-return';

export function buildPaymentReturnRedirectUrl() {
  return `${PAYMENT_RETURN_SCHEME}://${PAYMENT_RETURN_PATH}`;
}

export function parsePaymentReturnUrl(url: string): PaymentReturnResult | null {
  try {
    const normalized = url.includes('://') ? url : `${PAYMENT_RETURN_SCHEME}://${url}`;
    const parsed = new URL(normalized.replace(`${PAYMENT_RETURN_SCHEME}://`, 'https://placeholder/'));

    const status = parsed.searchParams.get('status') as PaymentReturnStatus | null;
    const paymentId = parsed.searchParams.get('paymentId') ?? undefined;

    if (!status) return null;

    return { status, paymentId };
  } catch {
    return null;
  }
}

export function isPaymentReturnSuccess(result: PaymentReturnResult) {
  return result.status === 'success';
}
