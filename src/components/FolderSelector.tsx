import { useState } from 'react';
import { Folder } from '../types';
import { useFolders } from '../contexts/FoldersContext';
import { useContacts } from '../contexts/ContactsContext';

interface FolderSelectorProps {
  folders: Folder[];
  selectedFolderIds: string[];
  onChange: (folderIds: string[]) => void;
}

export function FolderSelector({ folders, selectedFolderIds, onChange }: FolderSelectorProps) {
  const { removeFolder } = useFolders();
  const { contacts } = useContacts();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleFolder = (folderId: string) => {
    if (selectedFolderIds.includes(folderId)) {
      onChange(selectedFolderIds.filter(id => id !== folderId));
    } else {
      onChange([...selectedFolderIds, folderId]);
    }
  };

  const getContactCount = (folderId: string): number => {
    return contacts.filter(contact => contact.folders.includes(folderId)).length;
  };

  const handleDeleteFolder = async (folder: Folder, e: React.MouseEvent) => {
    e.stopPropagation();

    const contactCount = getContactCount(folder.id);
    const message = contactCount > 0
      ? `Are you sure you want to delete "${folder.name}"?\n\nThis folder contains ${contactCount} contact${contactCount !== 1 ? 's' : ''}. The folder will be removed from these contacts, but the contacts themselves will not be deleted.`
      : `Are you sure you want to delete "${folder.name}"?`;

    if (!window.confirm(message)) {
      return;
    }

    try {
      setDeletingId(folder.id);
      await removeFolder(folder.id);
      
      // Remove the folder from selected folder IDs if it was selected
      if (selectedFolderIds.includes(folder.id)) {
        onChange(selectedFolderIds.filter(id => id !== folder.id));
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete folder');
      setDeletingId(null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Folders
      </label>
      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2">
        {folders.length === 0 ? (
          <div className="text-sm text-gray-500 py-2 text-center">No folders available</div>
        ) : (
          folders.map(folder => (
            <div
              key={folder.id}
              className="flex items-center justify-between py-2 px-3 rounded-md active:bg-gray-50 min-h-[44px] group"
            >
              <label className="flex items-center flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFolderIds.includes(folder.id)}
                  onChange={() => toggleFolder(folder.id)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-base text-gray-900 flex-1">
                  {folder.name}
                </span>
                {folder.system && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    System
                  </span>
                )}
              </label>
              <button
                onClick={(e) => handleDeleteFolder(folder, e)}
                disabled={deletingId === folder.id}
                className="ml-3 text-red-600 hover:text-red-700 active:text-red-800 min-w-[40px] min-h-[40px] flex items-center justify-center disabled:opacity-50 transition-colors rounded-md hover:bg-red-50"
                aria-label={`Delete ${folder.name}`}
                title={`Delete folder "${folder.name}"`}
                type="button"
              >
                {deletingId === folder.id ? (
                  <span className="text-xs text-red-600 font-medium">Deleting...</span>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

