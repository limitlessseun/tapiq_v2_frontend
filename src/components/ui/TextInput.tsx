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
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordField = type === "password";
    const inputType = isPasswordField && showPassword ? "text" : type;

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
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
        {<label className="block mb-2 font-satoshi">{label}</label>}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e)}
            disabled={disabled}
            className={`
              w-full h-[47px] pr-10 bg-white  shadow-sm
              focus:outline-none
              disabled:cursor-not-allowed font-satoshi placeholder:font-satoshi  
              placeholder:text-gray 
              focus:ring-blue-200 focus:ring-4  
              rounded-md px-3
              ${error ? "border border-danger" : ""}
              ${isPasswordField ? "pr-12" : ""}
            `}
            {...props}
            style={{
              backgroundColor: "#fff",
            }}
          />
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
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          )}
          {/*  */}
          {type === "search" && (
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
            >
              <img src="/assets/search-Icon.svg" alt="" className="h-5 w-5" />
            </button>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-2 text-danger mt-2">
            <GoAlertFill size={16} />
            <span className="text-sm text-danger">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextField";

export default TextInput;
