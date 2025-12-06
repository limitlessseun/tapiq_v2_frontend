"use client";
import { Button } from "@/components/ui/button";
import SwitchInput from "@/components/ui/switch";
import TextInput from "@/components/ui/TextInput";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { loginUser } from "@/lib/api/auth.api";
import { SignInSchema as LoginSchema, SignInValues as LoginValues } from "@/lib/schema/schema";
import { zodValidate } from "@/lib/validator/zodValidate";
import { useSessionStore } from "@/stores/useSessionStore";
// Notification Component (same as in SignUpForm)
interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${type === 'success'
      ? 'bg-green-50 border-green-500 text-green-800'
      : 'bg-red-50 border-red-500 text-red-800'
      } max-w-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {type === 'success' ? (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function Login() {
  const router = useRouter();
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const { setSession } = useSessionStore();

  const hideNotification = () => {
    setNotification(null);
  };

  // Get callback URL from query params
  const getCallbackUrl = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('callbackUrl') || '/verify';
    }
    return '/verify';
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Create session data with all the user data from sign-in response
      const sessionData = {
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phoneNumber: data.user.phoneNumber,
          gender: data.user.gender,
          createdAt: data.user.createdAt,
          lastLogin: data.user.lastLogin,
          creditBalance: data.user.creditBalance,
          isAdmin: data.user.isAdmin,
          name: `${data.user.firstName} ${data.user.lastName}`.trim(),
          emailVerified: data.user.emailVerified ?? false,
          avatarUrl: data.user.avatarUrl ?? null,
          roles: data.user.isAdmin ? ['admin'] : ['user'],
          provider: 'credentials',
          providerId: data.user.id,
          subscription: data.subscription,
          // Ensure required usage/limit fields exist to match the User type
          dailyUsage: typeof data.user.dailyUsage === 'number' ? data.user.dailyUsage : 0,
          monthlyUsage: typeof data.user.monthlyUsage === 'number' ? data.user.monthlyUsage : 0,
          dailyLimit: typeof data.user.dailyLimit === 'number' ? data.user.dailyLimit : 0,
          monthlyLimit: typeof data.user.monthlyLimit === 'number' ? data.user.monthlyLimit : 0,
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        accessToken: data.token,
        refreshToken: null,
      };

      console.log('Setting session with token only:', data);

      // Store session in Zustand store
      setSession(sessionData);

      showNotification('Sign in successful!', 'success');
      setTimeout(() => {
        router.push('/verify');
      }, 100);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to sign in. Please try again.';

      console.error('Sign in error:', error);

      if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('credentials')) {
        showNotification('Invalid email or password', 'error');
      } else {
        showNotification(errorMessage, 'error');
      }
    },
  });

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      <Formik<LoginValues>
        initialValues={{
          email: "",
          password: "",
        }}
        validate={zodValidate(LoginSchema)}
        validateOnBlur
        validateOnChange={false}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await mutateAsync(values);
          } catch {
            // Error handling is done in useMutation
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          getFieldProps,
          touched,
          errors,
          isSubmitting,
          values,
        }) => (
          <Form className="space-y-4 my-6">
            {/* Phone Number or Email */}
            <div>
              <TextInput
                label="Email Address"
                type="email"
                {...getFieldProps("email")}
                placeholder="user@example.com"
                error={touched.email && errors.email ? errors.email : undefined}
                disabled={isPending || isSubmitting}
              />
            </div>

            {/* Password */}
            <div>
              <TextInput
                label="Password"
                type="password"
                {...getFieldProps("password")}
                placeholder="Enter your password"
                error={touched.password && errors.password ? errors.password : undefined}
                disabled={isPending || isSubmitting}
              />
            </div>



            {/* Remember Me Switch */}
            <div>
              <SwitchInput
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                label="Remember Me"
                disabled={isPending || isSubmitting}
              />
            </div>

            {/* Sign In Button */}
            <Button
              variant={"primary"}
              size={"lg"}
              type="submit"
              disabled={isPending || isSubmitting}
              className="w-full"
            >
              {isPending || isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Sign Up Link */}
            <div>
              <p className="text-sm text-gray text-start font-satoshi">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-[#1DADB0] hover:text-teal-600 font-semibold"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Security Features */}
            <div className="flex flex-col gap-2 items-start lg:items-center w-full max-w-xs mx-auto font-satoshi pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <img src="/assets/check-icon.svg" className="w-5 h-5" alt="Secure" />
                <p className="text-sm text-gray">We will never sell your data</p>
              </div>
              <div className="flex items-center space-x-2">
                <img src="/assets/check-icon.svg" className="w-5 h-5" alt="Encrypted" />
                <p className="text-sm text-gray">AES 256-bit encryption in use</p>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}