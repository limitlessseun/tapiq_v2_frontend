'use client';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import { Button } from "@/components/ui/button";
import TextInput from "@/components/ui/TextInput";
import { SelectInput } from "@/components/ui/SelectInput";
import RadioInput from "@/components/ui/RadioInput";
import DatePicker from "@/components/ui/Dateinput";
import TextArea from "@/components/ui/TextArea";
import CheckboxInput from "@/components/ui/Checkbox";
import WhatThisMeans from "@/components/ui/VerifyComponent/WhatThisMeans";
import { reportVendor } from '@/lib/api/verification.api';
import {
  reportFormSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  enhancedReportFormSchema,
  type ReportFormData,
  initialFormData
} from '@/lib/schema/schema';
import { zodValidate } from '@/lib/validator/zodValidate';
import { Notification } from '@/components/Reusable/Notification'; // Adjust path as needed

export default function ReportVendor() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Payment methods for North America
  const paymentMethods = [
    { label: "Interac e-Transfer", value: "Interac e-Transfer" },
    { label: "Credit/Debit Card", value: "Credit/Debit Card" },
    { label: "PayPal", value: "PayPal" },
    { label: "CashApp", value: "CashApp" },
    { label: "Zelle", value: "Zelle" },
    { label: "Wire Transfer", value: "Wire Transfer" },
    { label: "Bank Transfer", value: "Bank Transfer" },
    { label: "Crypto", value: "Crypto" },
    { label: "Other", value: "Other" }
  ];

  // Incident categories
  const incidentCategories = [
    { label: "Online purchase scam", value: "Online purchase scam" },
    { label: "Facebook Marketplace scam", value: "Facebook Marketplace scam" },
    { label: "Rental scam", value: "Rental scam" },
    { label: "Job scam", value: "Job scam" },
    { label: "Service not delivered", value: "Service not delivered" },
    { label: "Fake business page", value: "Fake business page" },
    { label: "Crypto scam", value: "Crypto scam" },
    { label: "Counterfeit product", value: "Counterfeit product" },
    { label: "Other", value: "Other" }
  ];

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const getStepSchema = (step: number) => {
    switch (step) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      case 4: return step4Schema;
      default: return reportFormSchema;
    }
  };

  const validateStep = (values: ReportFormData) => {
    const stepSchema = getStepSchema(currentStep);
    return zodValidate(stepSchema)(values);
  };

  const nextStep = (
    values: ReportFormData,
    setErrors: (errors: any) => void,
    setTouched: (touched: any) => void
  ) => {
    const errors = validateStep(values);
    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      // Clear any existing notification
      hideNotification();
    } else {
      setErrors(errors);
      const touchedFields: any = {};
      Object.keys(errors).forEach(field => {
        touchedFields[field] = true;
      });
      setTouched(touchedFields);
      // Show validation error notification
      showNotification('Please fill all required fields before proceeding', 'error');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    // Clear notification when going back
    hideNotification();
  };

  const handleSubmit = async (values: ReportFormData, { resetForm }: any) => {
    try {
      setIsSubmitting(true);

      // Generate the Id
      const generateId = () => {
        const hexChars = '0123456789abcdef';
        let id = '';
        for (let i = 0; i < 24; i++) {
          id += hexChars[Math.floor(Math.random() * 16)];
        }
        return id;
      };

      // Ensure Id is present in the values
      const valuesWithId = {
        ...values,
        Id: values.Id || generateId() // Add Id if not already present
      };

      console.log('Submitting with Id:', valuesWithId.Id);

      // Final validation
      const finalErrors = zodValidate(enhancedReportFormSchema)(valuesWithId);
      if (Object.keys(finalErrors).length > 0) {
        console.log('Validation errors:', finalErrors);
        showNotification('Please check the form for errors', 'error');
        return;
      }

      // Submit to API
      const response = await reportVendor(valuesWithId);
      showNotification('Report submitted successfully! Reference: ' + (response.reference || 'N/A'), 'success');

      // Success - reset form
      setCurrentStep(1);
      resetForm();
      setCurrentStep(1);
      localStorage.removeItem('vendorScamReportData');

    } catch (error: any) {
      console.error('Failed to submit report:', error);
      showNotification(
        error.response?.data?.message || 'Failed to submit report. Please try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      <Formik
        initialValues={initialFormData}
        validate={validateStep}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, errors, touched, setFieldValue, setErrors, setTouched, handleChange, handleBlur, isSubmitting: formikSubmitting }) => (
          <Form>
            <div className="flex items-center justify-center gap-2 py-4">
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  className={`w-8 h-2 rounded-2xl ${currentStep >= step ? "bg-white" : "bg-[rgba(255,255,255,.5)]"
                    }`}
                ></span>
              ))}
            </div>

            <div className="flex-1 bg-cloudWhite rounded-tr-3xl rounded-tl-3xl text-black py-6 px-4 md:py-10 md:px-10 w-full md:max-w-[700px] md:mx-auto">
              {currentStep === 1 ? (
                <Step1
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  paymentMethods={paymentMethods}
                  onShowNotification={showNotification}
                />
              ) : currentStep === 2 ? (
                <Step2
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  incidentCategories={incidentCategories}
                />
              ) : currentStep === 3 ? (
                <Step3
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
              ) : (
                <Step4
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
              )}

              <div className="flex items-center mt-6 gap-4">
                <div className="flex-1">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="uppercase text-xs w-full"
                      style={{
                        border: "1px solid",
                        borderImage: `
                          linear-gradient(180deg, rgba(255, 255, 255, 0.8) -25.96%, rgba(255, 255, 255, 0) 100%),
                          linear-gradient(270deg, rgba(255, 255, 255, 0) 12.54%, rgba(255, 255, 255, 0.8) 47.67%, rgba(255, 255, 255, 0) 82.8%)
                          1
                        `,
                      }}
                      onClick={prevStep}
                      type="button"
                    >
                      back
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  {currentStep < 4 ? (
                    <Button
                      variant="primary"
                      size="lg"
                      className="uppercase text-xs w-full"
                      onClick={() => nextStep(values, setErrors, setTouched)}
                      type="button"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      className="uppercase text-xs w-full"
                      type="submit"
                      disabled={formikSubmitting || isSubmitting}
                    >
                      {formikSubmitting || isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : "Submit Report"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

interface StepProps {
  values: ReportFormData;
  errors: any;
  touched: any;
  setFieldValue: (field: string, value: any) => void;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
}

interface Step1Props extends StepProps {
  paymentMethods: { label: string; value: string }[];
  onShowNotification?: (message: string, type: 'success' | 'error') => void;
}

const Step1 = ({ values, errors, touched, setFieldValue, handleChange, handleBlur, paymentMethods, onShowNotification }: Step1Props) => {
  const [socialMediaHandles, setSocialMediaHandles] = useState<string[]>(values.socialMediaHandles || []);
  const [newHandle, setNewHandle] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const socialPlatforms = [
    { label: "Facebook Marketplace", value: "Facebook Marketplace" },
    { label: "Instagram", value: "Instagram" },
    { label: "TikTok", value: "TikTok" },
    { label: "Snapchat", value: "Snapchat" },
    { label: "WhatsApp", value: "WhatsApp" },
    { label: "Telegram", value: "Telegram" },
    { label: "Discord", value: "Discord" }
  ];

  const addSocialHandle = () => {
    if (selectedPlatform && newHandle) {
      const handle = `${selectedPlatform}: ${newHandle}`;
      const updatedHandles = [...socialMediaHandles, handle];
      setSocialMediaHandles(updatedHandles);
      setFieldValue('socialMediaHandles', updatedHandles);
      setNewHandle('');
      setSelectedPlatform('');
    } else {
      onShowNotification?.('Please select a platform and enter a handle', 'error');
    }
  };

  const removeSocialHandle = (index: number) => {
    const updatedHandles = socialMediaHandles.filter((_, i) => i !== index);
    setSocialMediaHandles(updatedHandles);
    setFieldValue('socialMediaHandles', updatedHandles);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFieldValue('phoneNumber', formatted);
  };

  const showCryptoField = values.paymentMethod === 'Crypto';
  const showPaymentContactField = ['PayPal', 'Interac e-Transfer'].includes(values.paymentMethod || '');
  const showPaymentAppField = ['CashApp', 'Zelle'].includes(values.paymentMethod || '');
  const showBankDetailsField = ['Bank Transfer', 'Wire Transfer'].includes(values.paymentMethod || '');
  const showOtherPaymentField = values.paymentMethod === 'Other';

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl mb-4 text-indigo">Your Experience</h3>
      <div className="flex flex-col gap-6">
        <TextInput
          label="Vendor or Business Name*"
          type="text"
          placeholder="Enter vendor or business name"
          value={values.businessOrVendorName}
          onChange={handleChange}
          onBlur={handleBlur}
          name="businessOrVendorName"
          error={touched.businessOrVendorName && errors.businessOrVendorName}
          required
        />

        <SelectInput
          label="How did you pay?*"
          placeholder="Select payment method..."
          options={paymentMethods}
          value={values.paymentMethod}
          onChange={handleChange}
          onBlur={handleBlur}
          name="paymentMethod"
          error={touched.paymentMethod && errors.paymentMethod}
          required
        />

        {showCryptoField && (
          <TextInput
            label="Crypto Address*"
            type="text"
            placeholder="Enter cryptocurrency address"
            value={values.cryptoAddress || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            name="cryptoAddress"
            error={touched.cryptoAddress && errors.cryptoAddress}
            required
          />
        )}

        {showPaymentContactField && (
          <TextInput
            label="Email or Phone Used*"
            type="text"
            placeholder="Enter email or phone number"
            value={values.paymentContact || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            name="paymentContact"
            error={touched.paymentContact && errors.paymentContact}
            required
          />
        )}

        {showPaymentAppField && (
          <TextInput
            label={`${values.paymentMethod} ID*`}
            type="text"
            placeholder={`Enter ${values.paymentMethod} ID`}
            value={values.paymentAppId || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            name="paymentAppId"
            error={touched.paymentAppId && errors.paymentAppId}
            required
          />
        )}

        {showBankDetailsField && (
          <TextInput
            label="Bank Account Details*"
            type="text"
            placeholder="Enter bank account details"
            value={values.bankAccountDetails || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            name="bankAccountDetails"
            error={touched.bankAccountDetails && errors.bankAccountDetails}
            required
          />
        )}

        {showOtherPaymentField && (
          <TextInput
            label="Description*"
            type="text"
            placeholder="Describe the payment method"
            value={values.otherPaymentDescription || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            name="otherPaymentDescription"
            error={touched.otherPaymentDescription && errors.otherPaymentDescription}
            required
          />
        )}

        <TextInput
          label="Phone Number"
          type="tel"
          placeholder="(XXX) XXX-XXXX"
          value={values.phoneNumber || ''}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          name="phoneNumber"
          error={touched.phoneNumber && errors.phoneNumber}
        />

        <TextInput
          label="Website or Listing Link"
          type="url"
          placeholder="https://example.com"
          value={values.websiteOrListingLink || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          name="websiteOrListingLink"
          error={touched.websiteOrListingLink && errors.websiteOrListingLink}
        />

        <div>
          <label className="block mb-2 text-gray font-medium">Social Media Handles</label>
          <div className="space-y-3">
            {socialMediaHandles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socialMediaHandles.map((handle, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm"
                  >
                    <span>{handle}</span>
                    <button
                      type="button"
                      onClick={() => removeSocialHandle(index)}
                      className="text-gray-500 hover:text-red-500 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1">
                <SelectInput
                  placeholder="Select Platform"
                  options={socialPlatforms}
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  hideLabel
                />
              </div>
              <div className="flex-1">
                <TextInput
                  placeholder="@username or handle"
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  hideLabel
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialHandle}
                className="whitespace-nowrap"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Step2Props extends StepProps {
  incidentCategories: { label: string; value: string }[];
}

const Step2 = ({ values, errors, touched, setFieldValue, handleChange, handleBlur, incidentCategories }: Step2Props) => {
  // Helper to get error message
  const getErrorMessage = (field: string) => {
    if (touched[field] && errors[field]) {
      // If error is an array or object, convert to string
      if (Array.isArray(errors[field])) {
        return errors[field].join(', ');
      } else if (typeof errors[field] === 'object') {
        return Object.values(errors[field]).join(', ');
      }
      return errors[field];
    }
    return '';
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl mb-4 text-indigo">What Happened</h3>
      <div className="flex flex-col gap-6">
        <SelectInput
          label="Incident Category*"
          placeholder="Select incident category..."
          options={incidentCategories}
          value={values.incidentCategory}
          onChange={handleChange}
          onBlur={handleBlur}
          name="incidentCategory"
          error={getErrorMessage('incidentCategory')}
          required
        />

        <DatePicker
          label="When did this happen?*"
          placeholder="Select incident date"
          value={values.incidentDate}
          onChange={(value) => setFieldValue('incidentDate', value)}
          maxDate={new Date()}
          error={getErrorMessage('incidentDate')}
        />

        <TextInput
          label="Amount Lost (optional)"
          type="string"
          step="0.01"
          placeholder="0.00"
          value={values.amountLost || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          name="amountLost"
          error={getErrorMessage('amountLost')}
        />

        <TextArea
          label="Describe what happened*"
          placeholder="Example: 'I paid for an item on Facebook Marketplace. After sending the Interac transfer, the seller stopped replying. The product was never delivered.'"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          name="description"
          rows={4}
          maxLength={2000}
          error={getErrorMessage('description')}
          required
        />

        <div>
          <label className="block mb-2 text-gray font-medium">Did you attempt to resolve it?</label>
          <div className="flex gap-6">
            <RadioInput
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" }
              ]}
              value={values.attemptedResolution}
              onChange={(value) => setFieldValue('attemptedResolution', value)}
              name="attemptedResolution"
              error={getErrorMessage('attemptedResolution')}
            />
          </div>
        </div>

        {values.attemptedResolution === 'Yes' && (
          <TextArea
            label="Explain what steps you took*"
            placeholder="Describe the steps you took to resolve the issue..."
            value={values.resolutionSteps || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            name="resolutionSteps"
            rows={3}
            error={getErrorMessage('resolutionSteps')}
            required
          />
        )}
      </div>
    </div>
  );
};

const Step3 = ({ values, errors, touched, setFieldValue, handleChange, handleBlur }: StepProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);

      // Convert files to evidence format
      newFiles.forEach(file => {
        const evidenceFile = {
          fileName: file.name,
          url: URL.createObjectURL(file),
          contentType: file.type,
          size: file.size
        };

        const currentFiles = values.evidenceFiles || [];
        setFieldValue('evidenceFiles', [...currentFiles, evidenceFile]);
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);

    const currentFiles = values.evidenceFiles || [];
    const newEvidenceFiles = currentFiles.filter((_, i) => i !== index);
    setFieldValue('evidenceFiles', newEvidenceFiles);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl mb-4 text-indigo">Details & Evidence</h3>
      <div className="flex flex-col gap-6">
        <div className="mb-6">
          <label className="block mb-3 text-gray font-medium">Upload Screenshots/Receipts</label>
          <div className="flex gap-4 flex-wrap">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="relative w-40 h-[120px] bg-white rounded-lg flex items-center justify-center cursor-pointer transition-colors border"
              >
                <div className="text-center">
                  <div className="text-sm truncate px-2 break-words line-clamp-2">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}

            <label className="w-40 h-[120px] bg-white rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-indigo transition-colors">
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.mp4,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="text-center">
                <div className="text-3xl">+</div>
                <div className="text-xs text-gray-500 mt-1">Add File</div>
              </div>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Accepted: JPG, PNG, PDF, MP4, DOC, DOCX — up to 25MB each.
          </p>
        </div>

        <TextArea
          label="Additional Notes (Optional)"
          placeholder="Any other relevant information that might help with the investigation..."
          value={values.additionalDetails || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          name="additionalDetails"
          rows={3}
          maxLength={400}
        />

        <RadioInput
          label="Has the Vendor Blocked You?"
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" }
          ]}
          value={values.additionalDetails?.includes('blocked') ? 'yes' : 'no'}
          onChange={(value) => {
            const current = values.additionalDetails || '';
            if (value === 'yes' && !current.includes('blocked')) {
              setFieldValue('additionalDetails', current + ' Vendor blocked me.');
            }
          }}
        />

        <div className="flex items-start gap-4 mt-4">
          <div className="h-8 w-8 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-500 text-sm">ℹ️</span>
            </div>
          </div>
          <div>
            <p className="text-primary font-medium">Quick Reminders:</p>
            <ul className="space-y-1 pl-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Your identity stays private
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Reports are verified
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                All files are encrypted and stored securely
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step4 = ({ values, errors, touched, setFieldValue, handleChange, handleBlur }: StepProps) => {
  const data2 = ["Your identity stays private", "Reports are verified"];

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl mb-4 text-indigo">Review & Submit</h3>
      <div className="flex flex-col gap-6">
        <div className="bg-white p-4 rounded-lg space-y-3">
          <h4 className="font-semibold text-lg mb-3">Report Summary</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-500">Vendor Name:</p>
              <p className="font-medium">{values.businessOrVendorName || 'Not provided'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Payment Method:</p>
              <p className="font-medium">{values.paymentMethod || 'Not provided'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Incident Category:</p>
              <p className="font-medium">{values.incidentCategory || 'Not provided'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date of Incident:</p>
              <p className="font-medium">
                {values.incidentDate ? new Date(values.incidentDate).toLocaleDateString() : 'Not provided'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Amount Lost:</p>
              <p className="font-medium">
                {values.amountLost ? `$${parseFloat(values.amountLost).toFixed(2)}` : 'Not specified'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Evidence Files:</p>
              <p className="font-medium">{values.evidenceFiles?.length || 0} file(s)</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckboxInput
              checked={values.userAffirmedDataAreTrue || false}
              onCheckedChange={(checked) => {
                console.log('Checkbox changed to:', checked);
                setFieldValue('userAffirmedDataAreTrue', checked);
              }}
              id="userAffirmedDataAreTrue"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                I confirm the information provided is accurate to the best of my knowledge.
              </p>
              <p className="text-xs text-gray-600 mt-1">
                I understand that TapIQ reviews submissions for completeness but does not independently verify every report.
              </p>
              {touched.userAffirmedDataAreTrue && errors.userAffirmedDataAreTrue && (
                <p className="text-red-500 text-xs mt-1">
                  {typeof errors.userAffirmedDataAreTrue === 'string'
                    ? errors.userAffirmedDataAreTrue
                    : 'Please confirm the accuracy of the information'}
                </p>
              )}
            </div>
          </div>
        </div>

        <WhatThisMeans
          childeren={
            <div>
              <h3 className="font-bold text-lg mb-4">Security & Privacy:</h3>
              <ul className="space-y-2 pl-2">
                {data2.map((item, index) => (
                  <li key={index} className="flex items-start font-light">
                    <span className="mr-2">•</span>
                    {item}
                  </li>
                ))}
                <li className="flex items-start font-light">
                  <span className="mr-2">•</span>
                  PIPEDA/CCPA compliant
                </li>
                <li className="flex items-start font-light">
                  <span className="mr-2">•</span>
                  Secure SSL encryption
                </li>
                <li className="flex items-start font-light">
                  <span className="mr-2">•</span>
                  Zero data sharing
                </li>
              </ul>
            </div>
          }
        />

        <div className="flex items-start gap-4">
          <div className="h-8 w-8 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-500 text-sm">❓</span>
            </div>
          </div>
          <div>
            <p className="text-primary font-medium">Need Help?</p>
            <p className="text-sm text-gray-600 mt-1">
              If you have questions about the reporting process, contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};