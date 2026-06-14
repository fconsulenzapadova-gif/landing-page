import * as React from "react";
import { Input } from "./input";
import { formatNumber } from "@/lib/utils";

interface FormattedInputProps extends Omit<React.ComponentProps<"input">, 'onChange'> {
  value: string;
  onChange: (value: string, rawValue: string) => void;
  prefix?: string;
}

const FormattedInput = React.forwardRef<HTMLInputElement, FormattedInputProps>(
  ({ value, onChange, prefix = "€ ", ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(value);

    React.useEffect(() => {
      setDisplayValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Remove prefix for processing
      const withoutPrefix = inputValue.replace(prefix, '');
      
      // Format the number
      const formatted = formatNumber(withoutPrefix);
      const withPrefix = formatted ? `${prefix}${formatted}` : '';
      
      setDisplayValue(withPrefix);
      
      // Call onChange with both formatted and raw values
      const rawValue = withoutPrefix.replace(/\./g, '').replace(',', '.');
      onChange(withPrefix, rawValue);
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
      />
    );
  }
);

FormattedInput.displayName = "FormattedInput";

export { FormattedInput };