import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Contact } from '../types';
import { getAllContacts, addContact, updateContact, deleteContact, searchContacts, getContactsByFolder } from '../db/contacts';

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

