import { DB_NAME, DB_VERSION, CONTACTS_STORE, FOLDERS_STORE } from '../utils/constants';

let db: IDBDatabase | null = null;

export function openDatabase(): Promise<IDBDatabase> {
  if (db) {
    return Promise.resolve(db);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create contacts store
      if (!database.objectStoreNames.contains(CONTACTS_STORE)) {
        const contactsStore = database.createObjectStore(CONTACTS_STORE, {
          keyPath: 'id',
        });
        contactsStore.createIndex('name', 'name', { unique: false });
        contactsStore.createIndex('phone', 'phone', { unique: false });
        contactsStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Create folders store
      if (!database.objectStoreNames.contains(FOLDERS_STORE)) {
        const foldersStore = database.createObjectStore(FOLDERS_STORE, {
          keyPath: 'id',
        });
        foldersStore.createIndex('name', 'name', { unique: false });
        foldersStore.createIndex('system', 'system', { unique: false });
      }
    };
  });
}

export function getDatabase(): IDBDatabase | null {
  return db;
}

