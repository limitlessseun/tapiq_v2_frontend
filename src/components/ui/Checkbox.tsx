import * as Checkbox from "@radix-ui/react-checkbox";
import React from "react";

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const CheckboxInput = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <Checkbox.Root
        ref={ref}
        className={`
          w-5 h-5 bg-white border border-gray-300 rounded-sm
          flex items-center justify-center
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          data-[state=checked]:bg-primary data-[state=checked]:border-primary
          transition-colors duration-200
          ${className}
        `}
        {...props}
      >
        <Checkbox.Indicator className="text-white"></Checkbox.Indicator>
      </Checkbox.Root>
    );
  }
);

CheckboxInput.displayName = "CheckboxInput";

export default CheckboxInput;
