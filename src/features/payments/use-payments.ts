import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';

import { queryKeys } from '@/lib/react-query/query-keys';

import {
  buildPaymentReturnRedirectUrl,
  parsePaymentReturnUrl,
  paymentsApi,
  PaymentReturnResult,
} from './payments';

WebBrowser.maybeCompleteAuthSession();

export function usePaymentFlow() {
  const queryClient = useQueryClient();
  const [isOpeningVnpay, setIsOpeningVnpay] = useState(false);

  const payWithVnpayMutation = useMutation({
    mutationFn: async (bookingId: string): Promise<PaymentReturnResult> => {
      const payment = await paymentsApi.getOrCreatePendingPayment(bookingId);
      const { paymentUrl } = await paymentsApi.createVnpayUrl(payment.id);

      setIsOpeningVnpay(true);

      try {
        const result = await WebBrowser.openAuthSessionAsync(
          paymentUrl,
          buildPaymentReturnRedirectUrl(),
        );

        if (result.type === 'success' && result.url) {
          const parsed = parsePaymentReturnUrl(result.url);
          if (parsed) return parsed;
        }

        if (result.type === 'cancel' || result.type === 'dismiss') {
          return { status: 'failed' };
        }

        return { status: 'failed' };
      } finally {
        setIsOpeningVnpay(false);
      }
    },
    onSettled: (_data, _error, bookingId) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.booking.detail(bookingId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.booking.list() });
    },
  });

  return {
    payWithVnpay: payWithVnpayMutation.mutateAsync,
    isPaying: payWithVnpayMutation.isPending || isOpeningVnpay,
    paymentError: payWithVnpayMutation.error,
  };
}
