import { Folder } from '../types';
import { openDatabase } from './index';
import { FOLDERS_STORE } from '../utils/constants';
import { DEFAULT_SYSTEM_FOLDERS } from '../utils/constants';
import { generateId } from '../utils/helpers';
import { getAllContacts, updateContact } from './contacts';

export async function getAllFolders(): Promise<Folder[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FOLDERS_STORE], 'readonly');
    const store = transaction.objectStore(FOLDERS_STORE);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

export async function getFolderById(id: string): Promise<Folder | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FOLDERS_STORE], 'readonly');
    const store = transaction.objectStore(FOLDERS_STORE);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

export async function createFolder(folder: Omit<Folder, 'id'>): Promise<Folder> {
  const db = await openDatabase();
  const newFolder: Folder = {
    ...folder,
    id: generateId(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FOLDERS_STORE], 'readwrite');
    const store = transaction.objectStore(FOLDERS_STORE);
    const request = store.add(newFolder);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(newFolder);
  });
}

export async function updateFolder(id: string, updates: Partial<Omit<Folder, 'id'>>): Promise<Folder> {
  const db = await openDatabase();
  const existing = await getFolderById(id);
  
  if (!existing) {
    throw new Error(`Folder with id ${id} not found`);
  }

  const updated: Folder = {
    ...existing,
    ...updates,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FOLDERS_STORE], 'readwrite');
    const store = transaction.objectStore(FOLDERS_STORE);
    const request = store.put(updated);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(updated);
  });
}

export async function updateFolderOrder(folderOrders: { id: string; order: number }[]): Promise<void> {
  if (folderOrders.length === 0) {
    return;
  }

  const db = await openDatabase();
  
  // Get all folders first
  const allFolders = await getAllFolders();
  const folderMap = new Map(allFolders.map(f => [f.id, f]));
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FOLDERS_STORE], 'readwrite');
    const store = transaction.objectStore(FOLDERS_STORE);
    
    let completed = 0;
    const total = folderOrders.length;
    let hasError = false;
    
    for (const { id, order } of folderOrders) {
      const folder = folderMap.get(id);
      if (!folder) {
        completed++;
        if (completed === total && !hasError) resolve();
        continue;
      }
      
      const updated: Folder = {
        ...folder,
        order,
      };
      
      const request = store.put(updated);
      
      request.onsuccess = () => {
        completed++;
        if (completed === total && !hasError) resolve();
      };
      
      request.onerror = () => {
        if (!hasError) {
          hasError = true;
          reject(request.error);
        }
      };
    }
  });
}

export async function deleteFolder(id: string): Promise<void> {
  const db = await openDatabase();
  const folder = await getFolderById(id);
  
  if (!folder) {
    throw new Error(`Folder with id ${id} not found`);
  }

  // Remove folder reference from all contacts that have this folder
  const allContacts = await getAllContacts();
  const contactsToUpdate = allContacts.filter(contact => contact.folders.includes(id));
  
  // Update contacts to remove the folder reference
  for (const contact of contactsToUpdate) {
    await updateContact(contact.id, {
      folders: contact.folders.filter(folderId => folderId !== id),
    });
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FOLDERS_STORE], 'readwrite');
    const store = transaction.objectStore(FOLDERS_STORE);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function initializeSystemFolders(): Promise<Folder[]> {
  const existingFolders = await getAllFolders();
  const defaultFolderNames = new Set(DEFAULT_SYSTEM_FOLDERS);
  
  const foldersToCreate: Folder[] = [];
  const foldersToDelete: Folder[] = [];
  const seenSystemFolderNames = new Map<string, Folder>();
  
  // First pass: identify duplicates and old system folders
  for (const folder of existingFolders) {
    if (folder.system) {
      if (!defaultFolderNames.has(folder.name as typeof DEFAULT_SYSTEM_FOLDERS[number])) {
        // Old system folder not in default list - mark for deletion
        foldersToDelete.push(folder);
      } else {
        // Check for duplicates - keep the first one we see
        if (!seenSystemFolderNames.has(folder.name)) {
          seenSystemFolderNames.set(folder.name, folder);
        } else {
          // Duplicate found - mark for deletion
          foldersToDelete.push(folder);
        }
      }
    }
  }
  
  // Find new system folders that need to be created and update existing ones
  const foldersToUpdate: { id: string; order: number }[] = [];
  
  for (let i = 0; i < DEFAULT_SYSTEM_FOLDERS.length; i++) {
    const name = DEFAULT_SYSTEM_FOLDERS[i];
    if (!seenSystemFolderNames.has(name)) {
      foldersToCreate.push({
        id: generateId(),
        name,
        system: true,
        order: i, // Set default order based on position in array
      });
    } else {
      // Update existing folder's order if it doesn't have one
      const existingFolder = seenSystemFolderNames.get(name);
      if (existingFolder && existingFolder.order === undefined) {
        foldersToUpdate.push({ id: existingFolder.id, order: i });
      }
    }
  }
  
  // Update folders that need order set
  if (foldersToUpdate.length > 0) {
    await updateFolderOrder(foldersToUpdate);
  }

  // First, clean up contacts for folders being deleted
  for (const folder of foldersToDelete) {
    const allContacts = await getAllContacts();
    const contactsToUpdate = allContacts.filter(contact => contact.folders.includes(folder.id));
    
    for (const contact of contactsToUpdate) {
      await updateContact(contact.id, {
        folders: contact.folders.filter(folderId => folderId !== folder.id),
      });
    }
  }

  const db = await openDatabase();
  const created: Folder[] = [];
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FOLDERS_STORE], 'readwrite');
    const store = transaction.objectStore(FOLDERS_STORE);
    
    let completed = 0;
    const total = foldersToCreate.length + foldersToDelete.length;
    
    if (total === 0) {
      resolve(existingFolders);
      return;
    }

    // Delete old system folders
    for (const folder of foldersToDelete) {
      const deleteRequest = store.delete(folder.id);
      
      deleteRequest.onsuccess = () => {
        completed++;
        if (completed === total) {
          // Get updated folders list
          getAllFolders().then(updatedFolders => {
            resolve(updatedFolders);
          }).catch(reject);
        }
      };
      
      deleteRequest.onerror = () => {
        reject(deleteRequest.error);
      };
    }

    // Create new system folders
    for (const folder of foldersToCreate) {
      const addRequest = store.add(folder);
      
      addRequest.onsuccess = () => {
        created.push(folder);
        completed++;
        if (completed === total) {
          // Get updated folders list
          getAllFolders().then(updatedFolders => {
            resolve(updatedFolders);
          }).catch(reject);
        }
      };
      
      addRequest.onerror = () => {
        reject(addRequest.error);
      };
    }
  });
}

