/**
 * Formats a phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle US/Canada numbers (10 digits)
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Handle US/Canada with country code (11 digits starting with 1)
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Handle international numbers with country code (12+ digits)
  if (cleaned.length > 10) {
    // Try to format as +XX (XXX) XXX-XXXX
    if (cleaned.length <= 15) {
      const countryCode = cleaned.slice(0, cleaned.length - 10);
      const areaCode = cleaned.slice(countryCode.length, countryCode.length + 3);
      const firstPart = cleaned.slice(countryCode.length + 3, countryCode.length + 6);
      const lastPart = cleaned.slice(countryCode.length + 6);
      
      if (firstPart && lastPart) {
        return `+${countryCode} (${areaCode}) ${firstPart}-${lastPart}`;
      }
    }
  }
  
  // Return as-is if we can't format it
  return phone;
}

/**
 * Validates if a phone number has a valid format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Require at least 10 digits (minimum for a valid phone number)
  return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Normalizes a phone number to digits only
 */
export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Formats phone number as user types (live formatting)
 */
export function formatPhoneNumberLive(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length === 0) return '';
  
  // US/Canada format
  if (cleaned.length <= 10) {
    if (cleaned.length <= 3) return `(${cleaned}`;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
  
  // With country code
  if (cleaned[0] === '1' && cleaned.length <= 11) {
    if (cleaned.length <= 4) return `+${cleaned}`;
    if (cleaned.length <= 7) return `+${cleaned[0]} (${cleaned.slice(1)}`;
    if (cleaned.length <= 10) return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
  }
  
  // International
  if (cleaned.length <= 15) {
    return `+${cleaned}`;
  }
  
  return `+${cleaned.slice(0, 15)}`;
}


