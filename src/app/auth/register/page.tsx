"use client";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/ui/TextInput";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { registerUser } from "@/lib/api/auth.api";
import { SignUpSchema, SignUpValues } from "@/lib/schema/schema";
import { zodValidate } from "@/lib/validator/zodValidate";

// Notification Component (same as above)
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

export default function Register() {
  const router = useRouter();
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const genderOptions = [
    { value: '', label: 'Select Gender', disabled: true },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Non-binary', label: 'Non-binary' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
    { value: 'Other', label: 'Other' }
  ];

  const { mutateAsync, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      showNotification("Account created successfully! Redirecting to login...", "success");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong. Please try again.";
      showNotification(errorMessage, "error");
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

      <Formik<SignUpValues>
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
          gender: "",
          acceptTerms: false,
        }}
        validate={zodValidate(SignUpSchema)}
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
          setFieldValue,
        }) => (
          <Form className="space-y-4 my-6">
            {/* First Name */}
            <TextInput
              label="First Name"
              type="text"
              {...getFieldProps("firstName")}
              placeholder="Enter First Name"
              error={touched.firstName && errors.firstName ? errors.firstName : undefined}
              disabled={isPending || isSubmitting}
            />

            {/* Last Name */}
            <TextInput
              label="Last Name"
              type="text"
              {...getFieldProps("lastName")}
              placeholder="Enter Last Name"
              error={touched.lastName && errors.lastName ? errors.lastName : undefined}
              disabled={isPending || isSubmitting}
            />

            {/* Email */}
            <TextInput
              label="Email Address"
              type="email"
              {...getFieldProps("email")}
              placeholder="user@example.com"
              error={touched.email && errors.email ? errors.email : undefined}
              disabled={isPending || isSubmitting}
            />

            {/* Phone Number */}
            <TextInput
              label="Phone Number"
              type="tel"
              {...getFieldProps("phoneNumber")}
              placeholder="+234 ___ ___ ____"
              error={touched.phoneNumber && errors.phoneNumber ? errors.phoneNumber : undefined}
              disabled={isPending || isSubmitting}
            />

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                Gender *
              </label>
              <select
                id="gender"
                {...getFieldProps("gender")}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white focus:outline-none focus:border-[#1DADB0] focus:ring-2 focus:ring-[#1DADB0]/20 transition-all duration-300 placeholder:text-gray-400 text-gray-400  ${touched.gender && errors.gender ? 'border-red-500' : 'border-gray-200'
                  } ${isPending || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isPending || isSubmitting}
              >
                {genderOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {touched.gender && errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Password */}
            <TextInput
              label="Password"
              type="password"
              {...getFieldProps("password")}
              placeholder="Enter your password"
              error={touched.password && errors.password ? errors.password : undefined}
              disabled={isPending || isSubmitting}
            />

            {/* Confirm Password */}
            <TextInput
              label="Confirm Password"
              type="password"
              {...getFieldProps("confirmPassword")}
              placeholder="Confirm your password"
              error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
              disabled={isPending || isSubmitting}
            />

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={values.acceptTerms}
                onChange={(e) => setFieldValue("acceptTerms", e.target.checked)}
                className={`mt-1 rounded border-2 text-[#1DADB0] focus:ring-[#1DADB0] ${touched.acceptTerms && errors.acceptTerms ? 'border-red-500' : 'border-gray-300'
                  } ${isPending || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isPending || isSubmitting}
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-[#1DADB0] hover:text-teal-600 font-semibold">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#1DADB0] hover:text-teal-600 font-semibold">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {touched.acceptTerms && errors.acceptTerms && (
              <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>
            )}

            {/* Create Account Button */}
            <Button
              variant={"primary"}
              size={"lg"}
              type="submit"
              disabled={isPending || isSubmitting}
              className="w-full"
              style={{
                border: "1px solid",
                borderImage: `
                                    linear-gradient(180deg, rgba(255, 255, 255, 0.8) -25.96%, rgba(255, 255, 255, 0) 100%),
                                    linear-gradient(270deg, rgba(255, 255, 255, 0) 12.54%, rgba(255, 255, 255, 0.8) 47.67%, rgba(255, 255, 255, 0) 82.8%)
                                    1
                                `,
              }}
            >
              {isPending || isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create a TapIQ Account'
              )}
            </Button>

            {/* Login Link */}
            <div>
              <p className="text-sm text-gray text-center font-satoshi">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-[#1DADB0] hover:text-teal-600 font-semibold"
                >
                  Login
                </Link>
              </p>
            </div>

            {/* Security Features */}
            <div className="flex flex-col gap-2 items-start lg:items-center w-[70%] mx-auto font-satoshi">
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