import { forwardRef } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { GoAlertFill } from "react-icons/go";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectInputProps {
  label?: string;
  className?: string;
  error?: string;
  onBlur?: (e: React.FocusEvent<any>) => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  options?: (string | SelectOption)[];
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  name?: string;
  required?: boolean;
}

export const SelectInput = forwardRef<HTMLButtonElement, SelectInputProps>(
  (
    {
      label,
      className = "",
      error,
      onBlur,
      onChange,
      options = [],
      placeholder = "Select an option",
      disabled = false,
      value,
      name,
      required = false,
    },
    ref
  ) => {
    // Safely convert options to proper format
    const normalizedOptions = (options || []).map((option) => {
      if (typeof option === "string") {
        return {
          label: option,
          value: option.toLowerCase().replace(/\s+/g, "-"),
        };
      }
      return {
        label: option?.label || "",
        value: option?.value || "",
      };
    }).filter(opt => opt.label && opt.value);

    // Handle Radix UI's value change and convert it to a React change event
    const handleValueChange = (selectedValue: string) => {
      if (onChange && name) {
        // Create a synthetic React change event
        const syntheticEvent = {
          target: {
            name: name,
            value: selectedValue,
            type: "select-one", // HTML select type
          },
          currentTarget: {
            name: name,
            value: selectedValue,
          }
        } as React.ChangeEvent<HTMLSelectElement>;

        onChange(syntheticEvent);
      }
    };

    // Handle blur by creating a synthetic blur event
    const handleBlur = () => {
      if (onBlur && name) {
        const syntheticEvent = {
          target: {
            name: name,
            value: value || "",
          },
          currentTarget: {
            name: name,
            value: value || "",
          }
        } as React.FocusEvent<HTMLSelectElement>;

        onBlur(syntheticEvent);
      }
    };

    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && (
          <label className="block mb-2 font-satoshi text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <Select.Root
          value={value || ""}
          onValueChange={handleValueChange}
          disabled={disabled}
          name={name}
        >
          <Select.Trigger
            ref={ref}
            className={`
              w-full h-[47px] px-4
              bg-white rounded-lg border
              flex items-center justify-between
              font-satoshi
              ${error ? "border-red-500" : "border-gray-200"}
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            onBlur={handleBlur}
          >
            <Select.Value placeholder={placeholder} className="text-gray" />
            <Select.Icon className="text-gray-500">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="bg-white rounded-lg border border-gray-200 shadow-lg z-50">
              <Select.Viewport className="p-2">
                {normalizedOptions.length === 0 ? (
                  <div className="px-8 py-2 text-sm text-gray-500 text-center">
                    No options available
                  </div>
                ) : (
                  normalizedOptions.map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      className="px-8 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded flex items-center"
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-2">
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))
                )}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        {error && (
          <div className="flex items-center gap-2 text-red-500">
            <GoAlertFill size={14} />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";