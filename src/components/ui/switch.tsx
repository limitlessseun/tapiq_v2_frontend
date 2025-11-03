import { Switch } from "@radix-ui/react-switch";
import React from "react";
import { SwitchProps } from "@radix-ui/react-switch";

interface CustomSwitchProps extends SwitchProps {
  label?: string;
  labelPosition?: "left" | "right";
}

const SwitchInput = React.forwardRef<HTMLButtonElement, CustomSwitchProps>(
  ({ className = "", label, labelPosition = "right", id, ...props }, ref) => {
    // Generate an ID if not provided for proper label association
    const switchId = id || `switch-${React.useId()}`;

    const switchComponent = (
      <Switch
        ref={ref}
        id={switchId}
        className={`
            w-11 h-6 bg-gray-300 rounded-full relative
            data-[state=checked]:bg-primary
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-primary
            disabled:cursor-not-allowed disabled:opacity-50
            ${className}
          `}
        {...props}
      >
        <span
          className={`
          block w-5 h-5 bg-white rounded-full shadow-lg
          transition-transform duration-200
          translate-x-0.5
          data-[state=checked]:translate-x-6
        `}
        />
      </Switch>
    );

    if (!label) {
      return switchComponent;
    }

    return (
      <div className="flex items-center gap-3">
        {labelPosition === "left" && (
          <label
            htmlFor={switchId}
            className="text-sm font-medium cursor-pointer select-none"
          >
            {label}
          </label>
        )}
        {switchComponent}
        {labelPosition === "right" && (
          <label
            htmlFor={switchId}
            className="text-sm font-medium cursor-pointer select-none text-gray"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

SwitchInput.displayName = "SwitchInput";

export default SwitchInput;
