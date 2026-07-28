import { useState } from 'react';

import { ApiError } from '@/services/http';
import { useAuthStore } from '@/features/auth/auth.store';
import type { LoginFormValues } from './auth.schema';
import { loginSchema } from './auth.schema';

export function useAuth() {
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const signOut = useAuthStore((s) => s.signOut);
  const verifyEmailToken = useAuthStore((s) => s.verifyEmailToken);
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function runAction<T>(action: () => Promise<T>) {
    setIsSubmitting(true);
    try {
      return await action();
    } finally {
      setIsSubmitting(false);
    }
  }

  function getErrorMessage(error: unknown) {
    if (error instanceof ApiError) return error.message;
    return 'Đã xảy ra lỗi';
  }

  function validateLogin(values: LoginFormValues) {
    return loginSchema.safeParse(values);
  }

  return {
    user,
    isLoggedIn,
    isLoading,
    isSubmitting,
    signIn: (values: LoginFormValues) => runAction(() => signIn(values)),
    signUp: (values: Parameters<typeof signUp>[0]) => runAction(() => signUp(values)),
    signOut: () => runAction(() => signOut()),
    verifyEmailToken: (token: string) => runAction(() => verifyEmailToken(token)),
    getErrorMessage,
    validateLogin,
  };
}
