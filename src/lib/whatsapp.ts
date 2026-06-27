export function formatItalianPhoneForWhatsApp(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, '');

  if (cleaned.startsWith('+39')) return cleaned;
  if (cleaned.startsWith('39')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+39${cleaned.slice(1)}`;
  if (cleaned.startsWith('+')) return cleaned;

  return `+39${cleaned}`;
}

export function getWhatsAppUrl(phone: string, message?: string) {
  const formattedPhone = formatItalianPhoneForWhatsApp(phone).replace('+', '');
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${formattedPhone}${encodedMessage}`;
}
