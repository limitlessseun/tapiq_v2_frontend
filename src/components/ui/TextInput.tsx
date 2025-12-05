import { GoAlertFill } from "react-icons/go";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";

interface TextFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
  name?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  min?: string | number;
  max?: string | number;
  step?: string;
  hideLabel?: boolean;
  autoComplete?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      placeholder = "Enter Text",
      value,
      onChange,
      type = "text",
      disabled = false,
      className = "",
      label = "Label",
      error,
      required = false,
      name,
      onBlur,
      min,
      max,
      step,
      hideLabel = false,
      autoComplete = "off",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPasswordField = type === "password";
    const isSearchField = type === "search";
    const isNumberField = type === "number";
    const isUrlField = type === "url";
    const isTelField = type === "tel";

    const inputType = isPasswordField && showPassword ? "text" : type;

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlurInternal = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Format phone number for display
    const formatPhoneNumber = (value: string = '') => {
      if (!isTelField) return value;

      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 3) return `(${numbers}`;
      if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const numbers = input.replace(/\D/g, '');
      const formatted = numbers.slice(0, 10);

      // Create a synthetic event with the raw numbers for the onChange handler
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formatted,
          name: e.target.name
        }
      };

      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <div
        className={` 
        relative  
        w-full 
        transition-all duration-200
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      >
        {!hideLabel && (
          <label
            className={`block mb-2 font-satoshi ${required ? 'after:content-["*"] after:ml-1 after:text-red-500' : ''}`}
            htmlFor={name}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={name}
            name={name}
            type={inputType}
            placeholder={placeholder}
            value={isTelField ? formatPhoneNumber(value) : value}
            onChange={isTelField ? handlePhoneChange : onChange}
            onFocus={handleFocus}
            onBlur={handleBlurInternal}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            autoComplete={autoComplete}
            className={`
              w-full h-[47px] pr-10
              focus:outline-none
              disabled:cursor-not-allowed font-satoshi placeholder:font-satoshi  
              placeholder:text-gray 
              rounded-md px-3
              transition-all duration-200
              ${error ? "border border-danger bg-white" : "border border-gray-200 bg-white"}
              ${isFocused && !error ? "border-[#1DADB0] ring-3 ring-[#1DADB0]/10" : ""}
              ${isPasswordField || isSearchField ? "pr-12" : ""}
              ${isNumberField ? "pr-3" : ""}
              ${disabled ? "bg-gray-50 text-gray-400" : "bg-white"}
            `}
            {...props}
          />

          {/* Password visibility toggle */}
          {isPasswordField && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={disabled}
              className="
                absolute right-3 top-1/2 transform -translate-y-1/2
                text-gray-500 hover:text-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
                rounded-full p-1
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              "
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          )}

          {/* Search icon */}
          {isSearchField && (
            <button
              type="button"
              className="
                absolute right-3 top-1/2 transform -translate-y-1/2
                text-gray-500 hover:text-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
                rounded-full p-1
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              "
              aria-label="Search"
            >
              <img src="/assets/search-Icon.svg" alt="Search" className="h-5 w-5" />
            </button>
          )}

          {/* URL validation indicator */}
          {isUrlField && value && !error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
          )}

          {/* Required indicator */}
          {required && !value && isFocused && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs text-red-500">*</span>
            </div>
          )}
        </div>

        {/* Character counter for text areas (if maxLength is provided) */}
        {props.maxLength && value && (
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${value.length > props.maxLength ? 'text-red-500' : 'text-gray-500'}`}>
              {value.length}/{props.maxLength}
            </span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-danger mt-2 animate-fadeIn">
            <GoAlertFill size={16} />
            <span className="text-sm text-danger font-satoshi">{error}</span>
          </div>
        )}

        {/* Helper text for phone number field */}
        {isTelField && !error && (
          <p className="text-xs text-gray-500 mt-1 font-satoshi">
            Format: (XXX) XXX-XXXX
          </p>
        )}

        {/* Helper text for URL field */}
        {isUrlField && !error && !value && (
          <p className="text-xs text-gray-500 mt-1 font-satoshi">
            Include https:// or http://
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;