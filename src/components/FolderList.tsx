import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFolders } from '../contexts/FoldersContext';
import { useContacts } from '../contexts/ContactsContext';
import { Folder } from '../types';

export function FolderList() {
  const navigate = useNavigate();
  const { folders, removeFolder } = useFolders();
  const { contacts, setSelectedFolderId, selectedFolderId } = useContacts();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const { addFolder } = useFolders();

  const getContactCount = (folderId: string): number => {
    return contacts.filter(contact => contact.folders.includes(folderId)).length;
  };

  const handleFolderClick = (folderId: string) => {
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
      navigate('/');
    } else {
      setSelectedFolderId(folderId);
      navigate('/');
    }
  };

  const handleDeleteFolder = async (folder: Folder) => {
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
      if (selectedFolderId === folder.id) {
        setSelectedFolderId(null);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete folder');
      setDeletingId(null);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      return;
    }

    try {
      await addFolder({
        name: newFolderName.trim(),
        system: false,
      });
      setNewFolderName('');
      setShowNewFolderInput(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-page-bg">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 py-3 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="mr-4 text-accent font-medium min-h-[44px] min-w-[44px] flex items-center transition-opacity duration-150 hover:opacity-80"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-section-title text-text-primary flex-1">Folders</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="text-text-muted text-6xl mb-4">📁</div>
            <div className="text-body-primary text-text-secondary mb-2">No folders</div>
          </div>
        ) : (
          <div className="bg-surface">
            {folders.map(folder => (
              <div
                key={folder.id}
                className={`border-b border-border ${
                  selectedFolderId === folder.id ? 'bg-surface-muted' : 'bg-surface'
                }`}
              >
                <div
                  onClick={() => handleFolderClick(folder.id)}
                  className="px-4 py-4 flex items-center justify-between active:bg-surface-muted cursor-pointer min-h-[44px] transition-colors duration-150"
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-body-secondary text-text-primary font-medium">
                        {folder.name}
                      </span>
                      {folder.system && (
                        <span className="ml-2 text-meta text-text-muted bg-surface-muted px-2 py-0.5 rounded">
                          System
                        </span>
                      )}
                    </div>
                    <div className="text-helper text-text-secondary mt-0.5">
                      {getContactCount(folder.id)} contact{getContactCount(folder.id) !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder);
                    }}
                    disabled={deletingId === folder.id}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors duration-150 disabled:opacity-50"
                    aria-label="Delete folder"
                    title="Delete folder"
                  >
                    {deletingId === folder.id ? (
                      <span className="text-helper text-red-600 font-medium">Deleting...</span>
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
              </div>
            ))}
          </div>
        )}

        {/* New Folder Input */}
        {showNewFolderInput ? (
          <div className="bg-surface border-t border-border px-4 py-4">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              autoFocus
              className="w-full px-4 py-2.5 text-body-secondary bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mb-3 text-text-primary placeholder:text-text-muted transition-colors duration-150"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFolder();
                } else if (e.key === 'Escape') {
                  setShowNewFolderInput(false);
                  setNewFolderName('');
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateFolder}
                className="flex-1 bg-accent text-white font-medium py-2.5 rounded-lg active:opacity-90 min-h-[44px] transition-opacity duration-150"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewFolderInput(false);
                  setNewFolderName('');
                }}
                className="flex-1 bg-surface-muted text-text-primary font-medium py-2.5 rounded-lg active:bg-surface-muted min-h-[44px] transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNewFolderInput(true)}
            className="w-full bg-surface border-t border-border px-4 py-4 text-accent font-medium active:bg-surface-muted min-h-[44px] transition-colors duration-150"
          >
            + Create New Folder
          </button>
        )}
      </div>
    </div>
  );
}

