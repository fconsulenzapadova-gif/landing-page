import { useState } from 'react';

/**
 * Utility functions for number formatting with thousands separators
 */

/**
 * Formats a number with thousands separators (dots for Italian format)
 * @param value - The number or string to format
 * @returns Formatted string with thousands separators
 */
export const formatNumber = (value: string | number): string => {
  if (!value && value !== 0) return '';
  
  // Convert to string and remove any existing separators
  const cleanValue = value.toString().replace(/[.,]/g, '');
  
  // Check if it's a valid number
  if (isNaN(Number(cleanValue))) return value.toString();
  
  // Format with thousands separators using dots
  return Number(cleanValue).toLocaleString('it-IT');
};

/**
 * Formats a currency value with Euro symbol and thousands separators
 * @param value - The number or string to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: string | number): string => {
  if (!value && value !== 0) return '';
  
  const formatted = formatNumber(value);
  return formatted ? `€ ${formatted}` : '';
};

/**
 * Removes formatting from a number string to get the raw numeric value
 * @param formattedValue - The formatted string
 * @returns Clean numeric string
 */
export const unformatNumber = (formattedValue: string): string => {
  if (!formattedValue) return '';
  
  // Remove currency symbols, spaces, and dots (thousands separators)
  return formattedValue.replace(/[€\s.]/g, '');
};

/**
 * Handles input change for formatted number fields
 * @param value - The input value
 * @param onChange - The onChange callback
 */
export const handleFormattedNumberChange = (
  value: string,
  onChange: (value: string) => void
) => {
  // Remove formatting to get raw number
  const rawValue = unformatNumber(value);
  
  // Update with raw value (the component will format it for display)
  onChange(rawValue);
};

/**
 * Custom hook for managing formatted number inputs
 */
export const useFormattedNumber = (initialValue: string = '') => {
  const [rawValue, setRawValue] = useState(initialValue);
  
  const formattedValue = formatNumber(rawValue);
  
  const handleChange = (value: string) => {
    const raw = unformatNumber(value);
    setRawValue(raw);
  };
  
  return {
    rawValue,
    formattedValue,
    handleChange,
    setRawValue
  };
};