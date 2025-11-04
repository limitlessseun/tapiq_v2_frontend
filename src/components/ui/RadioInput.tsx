import { GoAlertFill } from "react-icons/go";
import React from "react";

interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioInputProps {
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  required?: boolean;
}

const RadioInput = React.forwardRef<HTMLInputElement, RadioInputProps>(
  (
    {
      label = "",
      options = [],
      value,
      onChange,
      error,
      disabled = false,
      className = "",
      name = "radio-group",
      required = false,
      ...props
    },
    ref
  ) => {
    const handleChange = (optionValue: string) => {
      if (!disabled && onChange) {
        onChange(optionValue);
      }
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
        {label && <label className={``}>{label}</label>}

        <div className="space-y-2 grid grid-cols-4">
          {options.map((option) => (
            <label
              key={option.value}
              className={`
                flex items-center gap-3 p-3 rounded-md cursor-pointer
                transition-all duration-200
                ${
                  disabled || option.disabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-50"
                }
                ${
                  value === option.value
                    ? "bg-blue-50 border border-blue-200"
                    : ""
                }
              `}
            >
              <input
                ref={ref}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => handleChange(option.value)}
                disabled={disabled || option.disabled}
                className={`
                  h-4 w-4 text-blue-600 focus:ring-blue-200 focus:ring-4
                  border-gray-300
                  ${
                    disabled || option.disabled
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
                {...props}
              />
              <span
                className={`
                text-sm
                ${
                  disabled || option.disabled
                    ? "text-gray-400"
                    : "text-gray-700"
                }
              `}
              >
                {option.label}
              </span>
            </label>
          ))}
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

RadioInput.displayName = "RadioInput";

export default RadioInput;
