import { Contact } from '../types';
import { openDatabase, getDatabase } from './index';
import { CONTACTS_STORE } from '../utils/constants';
import { generateId } from '../utils/helpers';

export async function getAllContacts(): Promise<Contact[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONTACTS_STORE], 'readonly');
    const store = transaction.objectStore(CONTACTS_STORE);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

export async function getContactById(id: string): Promise<Contact | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONTACTS_STORE], 'readonly');
    const store = transaction.objectStore(CONTACTS_STORE);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

export async function addContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
  const db = await openDatabase();
  const now = Date.now();
  const newContact: Contact = {
    ...contact,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONTACTS_STORE], 'readwrite');
    const store = transaction.objectStore(CONTACTS_STORE);
    const request = store.add(newContact);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(newContact);
  });
}

export async function updateContact(id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>): Promise<Contact> {
  const db = await openDatabase();
  const existing = await getContactById(id);
  
  if (!existing) {
    throw new Error(`Contact with id ${id} not found`);
  }

  const updated: Contact = {
    ...existing,
    ...updates,
    updatedAt: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONTACTS_STORE], 'readwrite');
    const store = transaction.objectStore(CONTACTS_STORE);
    const request = store.put(updated);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(updated);
  });
}

export async function deleteContact(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONTACTS_STORE], 'readwrite');
    const store = transaction.objectStore(CONTACTS_STORE);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function searchContacts(query: string): Promise<Contact[]> {
  const allContacts = await getAllContacts();
  const lowerQuery = query.toLowerCase();
  
  return allContacts.filter(contact => {
    return (
      contact.name.toLowerCase().includes(lowerQuery) ||
      contact.phone.includes(lowerQuery) ||
      contact.company?.toLowerCase().includes(lowerQuery) ||
      contact.role?.toLowerCase().includes(lowerQuery)
    );
  });
}

export async function getContactsByFolder(folderId: string): Promise<Contact[]> {
  const allContacts = await getAllContacts();
  return allContacts.filter(contact => contact.folders.includes(folderId));
}

