import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Folder } from '../types';
import { getAllFolders, createFolder, updateFolder, deleteFolder, updateFolderOrder } from '../db/folders';
import { initializeSystemFolders } from '../db/folders';
import { DEFAULT_SYSTEM_FOLDERS } from '../utils/constants';

interface FoldersContextType {
  folders: Folder[];
  loading: boolean;
  refreshFolders: () => Promise<void>;
  addFolder: (folder: Omit<Folder, 'id'>) => Promise<void>;
  updateExistingFolder: (id: string, updates: Partial<Omit<Folder, 'id'>>) => Promise<void>;
  removeFolder: (id: string) => Promise<void>;
  reorderFolders: (folderOrders: { id: string; order: number }[]) => Promise<void>;
}

const FoldersContext = createContext<FoldersContextType | undefined>(undefined);

export function FoldersProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  const sortFolders = (folders: Folder[]): Folder[] => {
    // Deduplicate folders by ID (keep first occurrence)
    const seenIds = new Set<string>();
    const uniqueFolders = folders.filter(folder => {
      if (seenIds.has(folder.id)) {
        return false;
      }
      seenIds.add(folder.id);
      return true;
    });

    // Check if any folder has a custom order
    const hasCustomOrder = uniqueFolders.some(f => f.order !== undefined);

    if (hasCustomOrder) {
      // Sort by custom order if available
      return uniqueFolders.sort((a, b) => {
        const orderA = a.order ?? Infinity;
        const orderB = b.order ?? Infinity;
        return orderA - orderB;
      });
    }

    // Default sorting: system folders first in default order, then custom folders
    const systemFolderOrder = new Map(
      DEFAULT_SYSTEM_FOLDERS.map((name, index) => [name, index])
    );

    // Separate system and custom folders, deduplicating by name for system folders
    const systemFoldersMap = new Map<string, Folder>();
    const customFolders: Folder[] = [];

    for (const folder of uniqueFolders) {
      if (folder.system) {
        // Keep only the first system folder with each name
        if (!systemFoldersMap.has(folder.name)) {
          systemFoldersMap.set(folder.name, folder);
        }
      } else {
        customFolders.push(folder);
      }
    }

    // Convert map to array and sort system folders by their order in DEFAULT_SYSTEM_FOLDERS
    const systemFolders = Array.from(systemFoldersMap.values()).sort((a, b) => {
      const orderA = systemFolderOrder.get(a.name as typeof DEFAULT_SYSTEM_FOLDERS[number]) ?? Infinity;
      const orderB = systemFolderOrder.get(b.name as typeof DEFAULT_SYSTEM_FOLDERS[number]) ?? Infinity;
      return orderA - orderB;
    });

    // Sort custom folders alphabetically
    customFolders.sort((a, b) => a.name.localeCompare(b.name));

    // Return system folders first, then custom folders
    return [...systemFolders, ...customFolders];
  };

  const refreshFolders = async () => {
    try {
      setLoading(true);
      // Initialize system folders first (idempotent)
      await initializeSystemFolders();
      const allFolders = await getAllFolders();
      const sortedFolders = sortFolders(allFolders);
      setFolders(sortedFolders);
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFolders();
  }, []);

  const addFolder = async (folder: Omit<Folder, 'id'>) => {
    try {
      // Get current folders to determine max order
      const currentFolders = await getAllFolders();
      const maxOrder = currentFolders.reduce((max, f) => {
        const order = f.order ?? -1;
        return order > max ? order : max;
      }, -1);
      
      const folderWithOrder: Omit<Folder, 'id'> = {
        ...folder,
        order: maxOrder + 1,
      };
      
      await createFolder(folderWithOrder);
      await refreshFolders();
    } catch (error) {
      console.error('Error adding folder:', error);
      throw error;
    }
  };

  const updateExistingFolder = async (id: string, updates: Partial<Omit<Folder, 'id'>>) => {
    try {
      await updateFolder(id, updates);
      await refreshFolders();
    } catch (error) {
      console.error('Error updating folder:', error);
      throw error;
    }
  };

  const removeFolder = async (id: string) => {
    try {
      await deleteFolder(id);
      await refreshFolders();
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  };

  const reorderFolders = async (folderOrders: { id: string; order: number }[]) => {
    try {
      await updateFolderOrder(folderOrders);
      await refreshFolders();
    } catch (error) {
      console.error('Error reordering folders:', error);
      throw error;
    }
  };

  return (
    <FoldersContext.Provider
      value={{
        folders,
        loading,
        refreshFolders,
        addFolder,
        updateExistingFolder,
        removeFolder,
        reorderFolders,
      }}
    >
      {children}
    </FoldersContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FoldersContext);
  if (context === undefined) {
    throw new Error('useFolders must be used within a FoldersProvider');
  }
  return context;
}

