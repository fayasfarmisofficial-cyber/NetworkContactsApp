import { Contact } from '../types';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function sortContactsAlphabetically(contacts: Contact[]): Contact[] {
  return [...contacts].sort((a, b) => {
    const nameA = a.name.toLowerCase().trim();
    const nameB = b.name.toLowerCase().trim();
    return nameA.localeCompare(nameB);
  });
}

export function groupContactsByLetter(contacts: Contact[]): Map<string, Contact[]> {
  const grouped = new Map<string, Contact[]>();
  
  for (const contact of contacts) {
    const firstLetter = contact.name.trim().charAt(0).toUpperCase();
    const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
    
    if (!grouped.has(letter)) {
      grouped.set(letter, []);
    }
    grouped.get(letter)!.push(contact);
  }
  
  // Sort each group
  for (const [letter, group] of grouped.entries()) {
    grouped.set(letter, sortContactsAlphabetically(group));
  }
  
  return grouped;
}

export function searchContacts(contacts: Contact[], query: string): Contact[] {
  if (!query.trim()) return contacts;
  
  const lowerQuery = query.toLowerCase();
  return contacts.filter(contact => {
    return (
      contact.name.toLowerCase().includes(lowerQuery) ||
      contact.phone.includes(lowerQuery) ||
      contact.company?.toLowerCase().includes(lowerQuery) ||
      contact.role?.toLowerCase().includes(lowerQuery)
    );
  });
}

// Re-export phone formatter for backwards compatibility
export { formatPhoneNumber } from './phoneFormatter';

