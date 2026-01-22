import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Contact } from '../types';
import { getAllContacts, addContact, updateContact, deleteContact } from '../db/contacts';

interface ContactsContextType {
  contacts: Contact[];
  loading: boolean;
  searchQuery: string;
  selectedFolderId: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedFolderId: (folderId: string | null) => void;
  refreshContacts: () => Promise<void>;
  addNewContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExistingContact: (id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
  addMultipleContacts: (contacts: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<void>;
  removeMultipleContacts: (ids: string[]) => Promise<void>;
  exportContacts: () => string;
  importContacts: (fileData: string, fileName?: string) => Promise<void>;
  getFilteredContacts: () => Contact[];
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export function ContactsProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const refreshContacts = async () => {
    try {
      setLoading(true);
      const allContacts = await getAllContacts();
      setContacts(allContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshContacts();
  }, []);

  const addNewContact = async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addContact(contact);
      await refreshContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  };

  const updateExistingContact = async (id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>) => {
    try {
      await updateContact(id, updates);
      await refreshContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  };

  const removeContact = async (id: string) => {
    try {
      await deleteContact(id);
      await refreshContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  };

  const addMultipleContacts = async (contactsToAdd: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    try {
      // Add all contacts without triggering loading state
      for (const contact of contactsToAdd) {
        await addContact(contact);
      }
      // Refresh once at the end without setting loading state
      const allContacts = await getAllContacts();
      setContacts(allContacts);
    } catch (error) {
      console.error('Error adding multiple contacts:', error);
      throw error;
    }
  };

  const removeMultipleContacts = async (ids: string[]) => {
    try {
      // Remove all contacts without triggering loading state
      for (const id of ids) {
        await deleteContact(id);
      }
      // Refresh once at the end without setting loading state
      const allContacts = await getAllContacts();
      setContacts(allContacts);
    } catch (error) {
      console.error('Error removing multiple contacts:', error);
      throw error;
    }
  };

  const exportContacts = (): string => {
    // Generate VCF (vCard) format
    const vcfLines: string[] = [];
    
    contacts.forEach(contact => {
      vcfLines.push('BEGIN:VCARD');
      vcfLines.push('VERSION:3.0');
      vcfLines.push(`FN:${escapeVcfValue(contact.name)}`);
      vcfLines.push(`TEL;TYPE=CELL:${escapeVcfValue(contact.phone)}`);
      
      if (contact.company) {
        vcfLines.push(`ORG:${escapeVcfValue(contact.company)}`);
      }
      
      if (contact.role) {
        vcfLines.push(`TITLE:${escapeVcfValue(contact.role)}`);
      }
      
      if (contact.linkedin) {
        vcfLines.push(`URL:${escapeVcfValue(contact.linkedin)}`);
      }
      
      if (contact.notes) {
        vcfLines.push(`NOTE:${escapeVcfValue(contact.notes)}`);
      }
      
      vcfLines.push('END:VCARD');
      vcfLines.push(''); // Empty line between contacts
    });
    
    return vcfLines.join('\n');
  };

  const escapeVcfValue = (value: string): string => {
    // Escape special characters in VCF format
    return value
      .replace(/\\/g, '\\\\')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '');
  };

  const importContacts = async (fileData: string, fileName?: string) => {
    try {
      // Check if it's a VCF file
      if (fileName?.toLowerCase().endsWith('.vcf') || fileData.trim().startsWith('BEGIN:VCARD')) {
        const contactsToAdd = parseVcfFile(fileData);
        await addMultipleContacts(contactsToAdd);
      } else {
        // Try to parse as JSON
        const data = JSON.parse(fileData);
        if (!data.contacts || !Array.isArray(data.contacts)) {
          throw new Error('Invalid import format');
        }

        // Add all imported contacts
        const contactsToAdd = data.contacts.map((contact: any) => ({
          name: contact.name || '',
          phone: contact.phone || '',
          company: contact.company,
          role: contact.role,
          linkedin: contact.linkedin,
          notes: contact.notes,
          folders: contact.folders || [],
        }));

        await addMultipleContacts(contactsToAdd);
      }
    } catch (error) {
      console.error('Error importing contacts:', error);
      throw error;
    }
  };

  const parseVcfFile = (vcfData: string): Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[] => {
    const contacts: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[] = [];
    const vcfBlocks = vcfData.split(/END:VCARD/i);
    
    vcfBlocks.forEach(block => {
      if (!block.trim() || !block.includes('BEGIN:VCARD')) {
        return;
      }
      
      const lines = block.split(/\r?\n/);
      let name = '';
      let phone = '';
      let company = '';
      let role = '';
      let linkedin = '';
      let notes = '';
      
      lines.forEach(line => {
        const upperLine = line.toUpperCase();
        if (upperLine.startsWith('FN:')) {
          name = unescapeVcfValue(line.substring(3).trim());
        } else if (upperLine.startsWith('TEL')) {
          const telMatch = line.match(/TEL[^:]*:(.+)/i);
          if (telMatch) {
            phone = unescapeVcfValue(telMatch[1].trim());
          }
        } else if (upperLine.startsWith('ORG:')) {
          company = unescapeVcfValue(line.substring(4).trim());
        } else if (upperLine.startsWith('TITLE:')) {
          role = unescapeVcfValue(line.substring(6).trim());
        } else if (upperLine.startsWith('URL:')) {
          const url = unescapeVcfValue(line.substring(4).trim());
          if (url.includes('linkedin.com')) {
            linkedin = url;
          }
        } else if (upperLine.startsWith('NOTE:')) {
          notes = unescapeVcfValue(line.substring(5).trim());
        }
      });
      
      if (name || phone) {
        contacts.push({
          name: name || 'Unknown',
          phone: phone || '',
          company: company || undefined,
          role: role || undefined,
          linkedin: linkedin || undefined,
          notes: notes || undefined,
          folders: [],
        });
      }
    });
    
    return contacts;
  };

  const unescapeVcfValue = (value: string): string => {
    return value
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\,/g, ',')
      .replace(/\\;/g, ';')
      .replace(/\\\\/g, '\\');
  };

  const getFilteredContacts = (): Contact[] => {
    let filtered = contacts;

    // Filter by folder
    if (selectedFolderId) {
      filtered = filtered.filter(contact => contact.folders.includes(selectedFolderId));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(contact => {
        return (
          contact.name.toLowerCase().includes(lowerQuery) ||
          contact.phone.includes(lowerQuery) ||
          contact.company?.toLowerCase().includes(lowerQuery) ||
          contact.role?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    return filtered;
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        loading,
        searchQuery,
        selectedFolderId,
        setSearchQuery,
        setSelectedFolderId,
        refreshContacts,
        addNewContact,
        updateExistingContact,
        removeContact,
        addMultipleContacts,
        removeMultipleContacts,
        exportContacts,
        importContacts,
        getFilteredContacts,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
}

