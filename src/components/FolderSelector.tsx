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
      <label className="block text-meta text-text-secondary mb-2">
        Folders
      </label>
      <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-2 bg-surface">
        {folders.length === 0 ? (
          <div className="text-helper text-text-muted py-2 text-center">No folders available</div>
        ) : (
          folders.map(folder => (
            <div
              key={folder.id}
              className="flex items-center justify-between py-2 px-3 rounded-md active:bg-surface-muted min-h-[44px] group transition-colors duration-150"
            >
              <label className="flex items-center flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFolderIds.includes(folder.id)}
                  onChange={() => toggleFolder(folder.id)}
                  className="w-5 h-5 text-accent border-border rounded focus:ring-accent bg-surface"
                />
                <span className="ml-3 text-body-secondary text-text-primary flex-1">
                  {folder.name}
                </span>
                {folder.system && (
                  <span className="text-meta text-text-muted bg-surface-muted px-2 py-1 rounded">
                    System
                  </span>
                )}
              </label>
              <button
                onClick={(e) => handleDeleteFolder(folder, e)}
                disabled={deletingId === folder.id}
                className="ml-3 p-2 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center disabled:opacity-50 transition-colors duration-150"
                aria-label={`Delete ${folder.name}`}
                title={`Delete folder "${folder.name}"`}
                type="button"
              >
                {deletingId === folder.id ? (
                  <span className="text-meta text-red-600 font-medium">Deleting...</span>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
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

