import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number with thousand separators (Italian format with dots)
export function formatNumber(value: string): string {
  if (!value) return '';
  
  // Remove all non-digits except the last comma for decimals
  const cleaned = value.replace(/[^\d,]/g, '');
  
  if (!cleaned) return '';
  
  // Split by comma if there are decimals
  const parts = cleaned.split(',');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Only add thousand separators if we have at least 4 digits
  let formatted = integerPart;
  if (integerPart.length > 3) {
    formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  
  // Return with decimal part if exists
  return decimalPart !== undefined ? `${formatted},${decimalPart}` : formatted;
}

// Parse formatted number back to raw number
export function parseFormattedNumber(value: string): string {
  return value.replace(/\./g, '').replace(',', '.');
}
