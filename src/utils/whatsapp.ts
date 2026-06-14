/**
 * Formats a phone number for WhatsApp URL
 * Removes spaces, dashes, and other formatting characters
 * Ensures the number starts with country code
 */
export const formatPhoneForWhatsApp = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If number starts with +39 (Italy), keep it
  if (cleaned.startsWith('+39')) {
    return cleaned;
  }
  
  // If number starts with 39, add +
  if (cleaned.startsWith('39') && cleaned.length > 10) {
    return '+' + cleaned;
  }
  
  // If number starts with 0, replace with +39
  if (cleaned.startsWith('0')) {
    return '+39' + cleaned.substring(1);
  }
  
  // If number doesn't have country code, assume Italy (+39)
  if (cleaned.length >= 9 && !cleaned.startsWith('+')) {
    return '+39' + cleaned;
  }
  
  return cleaned.startsWith('+') ? cleaned : '+' + cleaned;
};

/**
 * Generates WhatsApp URL for opening a chat with a phone number
 */
export const getWhatsAppUrl = (phone: string, message?: string): string => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = message ? encodeURIComponent(message) : '';
  
  return `https://wa.me/${formattedPhone.replace('+', '')}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

/**
 * Opens WhatsApp chat in a new window/tab
 */
export const openWhatsAppChat = (phone: string, message?: string): void => {
  const url = getWhatsAppUrl(phone, message);
  window.open(url, '_blank');
};
