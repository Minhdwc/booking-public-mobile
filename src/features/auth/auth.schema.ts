import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

export const registerSchema = z
  .object({
    email: z.email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    username: z.string().min(3, 'Username phải có ít nhất 3 ký tự'),
    phone: z.string().regex(/^(\+84|84|0)(3|5|7|8|9)\d{8}$/, 'Số điện thoại Việt Nam không hợp lệ'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu không khớp',
  });

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Mã xác minh không được để trống'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
