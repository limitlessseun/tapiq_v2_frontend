import { GoAlertFill } from "react-icons/go";
import React, { useState, useRef, useEffect } from "react";

interface DatePickerProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void; // Changed from (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  min?: string;
  max?: string;
  maxDate?: Date; // Added maxDate prop
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      placeholder = "Select date",
      value,
      onChange,
      disabled = false,
      className = "",
      label = "Date",
      error,
      min,
      max,
      maxDate, // Added
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    // Close date picker when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          datePickerRef.current &&
          !datePickerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(newValue); // Pass just the value, not the event
      setIsOpen(false);
    };

    const toggleDatePicker = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    // Format maxDate to string for the input
    const getMaxDateString = () => {
      if (max) return max;
      if (maxDate) {
        return maxDate.toISOString().split('T')[0];
      }
      return '';
    };

    const handleClear = () => {
      onChange?.(""); // Pass empty string, not an event
      setIsOpen(false);
    };

    return (
      <div
        ref={datePickerRef}
        className={`
          relative  
          w-full 
          transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
      >
        {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative">
          <input
            ref={ref}
            type="text"
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            className={`
              w-full h-[47px] pr-10 bg-white shadow-sm
              focus:outline-none
              disabled:cursor-not-allowed 
              placeholder:text-gray 
              focus:ring-blue-200 focus:ring-4  
              rounded-md px-3
              ${error ? "border border-danger" : "border border-gray-300"}
              cursor-pointer
            `}
            readOnly
            onClick={toggleDatePicker}
            style={{
              backgroundColor: "#fff",
            }}
            {...props}
          />

          {/* Calendar Icon Button */}
          <button
            type="button"
            onClick={toggleDatePicker}
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
            <img src="/assets/calendarIconIcons.svg" className="w-5 h-5" alt="Calendar" />
          </button>

          {/* Native Date Picker Modal */}
          {isOpen && (
            <div
              className="
              absolute top-full left-0 right-0 z-50 mt-1
              bg-white border border-gray-200 rounded-md shadow-lg
              p-4
            "
            >
              <input
                type="date"
                value={value || ''}
                onChange={handleDateChange}
                min={min}
                max={getMaxDateString()}
                className="
                  w-full h-[40px] px-3 bg-white border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-blue-200
                  rounded-md
                "
                autoFocus
              />
              <div className="flex justify-between mt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="
                    px-4 py-2 text-sm text-gray-600 hover:text-gray-800
                    transition-colors duration-200
                  "
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="
                    px-4 py-2 text-sm text-danger hover:text-red-700
                    transition-colors duration-200
                  "
                >
                  Clear
                </button>
              </div>
            </div>
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

DatePicker.displayName = "DatePicker";

export default DatePicker;