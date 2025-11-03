import { forwardRef } from "react";
import * as Select from "@radix-ui/react-select";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "@radix-ui/react-icons";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectInputProps {
  label?: string;
  required?: boolean;
  className?: string;
  error?: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  options?: (string | SelectOption)[];
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  value?: string;
  name?: string;
}

export const SelectInput = forwardRef<HTMLButtonElement, SelectInputProps>(
  (
    {
      label,
      required = false,
      className = "",
      error,
      onBlur,
      onChange,
      options = [],
      placeholder = "Select an option",
      helperText,
      disabled = false,
      value,
      name,
    },
    ref
  ) => {
    const normalizedOptions = options.map((option) => {
      if (typeof option === "string") {
        return {
          label: option,
          value: option.toLowerCase().replace(/\s+/g, "-"),
        };
      }
      return option;
    });

    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && <label className={``}>{label}</label>}

        <Select.Root
          value={value}
          onValueChange={onChange}
          disabled={disabled}
          name={name}
        >
          <Select.Trigger
            ref={ref}
            className={`
              inline-flex items-center justify-between w-full px-3 py-3 placeholder:text-gray
              bg-white  rounded-lg shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? "border-red-500" : ""}
              ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
            `}
            onBlur={onBlur}
          >
            <Select.Value placeholder={placeholder} className="text-gray" />
            <Select.Icon className="text-gray-500">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200">
              <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                <ChevronUpIcon />
              </Select.ScrollUpButton>

              <Select.Viewport className="p-1 max-h-[250px]">
                {normalizedOptions.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className={`
                      relative flex items-center px-8 py-2 text-sm rounded-md
                      focus:bg-blue-50 focus:outline-none
                      data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none
                      hover:bg-gray-100 cursor-pointer
                    `}
                  >
                    <Select.ItemText>{option.label}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-2 w-4 h-4 inline-flex items-center justify-center">
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>

              <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        {error && <span className="text-sm text-red-600">{error}</span>}
        {helperText && !error && (
          <span className="text-sm text-gray-500">{helperText}</span>
        )}
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";
