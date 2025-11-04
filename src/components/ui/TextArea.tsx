import React from "react";
import { cn } from "@/lib/utils";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      maxLength,
      placeholder = "Reply to comment…",
      rows = 4,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const characterCount = props.value?.toString().length || 0;

    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative mb-0">
          <textarea
            ref={ref}
            rows={rows}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            className={cn(
              "w-full resize-none rounded-lg  bg-white px-3 py-2 text-sm shadow-sm",
              "placeholder:text-gray",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
              "transition-colors duration-200",
              "min-h-[80px]",
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
              className
            )}
            {...props}
          />
        </div>

        {(helperText || error || maxLength) && (
          <div className="flex justify-between items-center">
            <div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
              )}
            </div>

            {maxLength && (
              <p
                className={cn(
                  "text-sm",
                  characterCount > maxLength ? "text-red-600" : "text-gray"
                )}
              >
                {characterCount}/{maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
