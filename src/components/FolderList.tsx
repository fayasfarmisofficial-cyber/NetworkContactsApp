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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="mr-4 text-blue-600 font-medium min-h-[44px] min-w-[44px] flex items-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-900 flex-1">Folders</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <div className="text-gray-600 text-lg font-medium mb-2">No folders</div>
          </div>
        ) : (
          <div className="bg-white">
            {folders.map(folder => (
              <div
                key={folder.id}
                className={`border-b border-gray-100 ${
                  selectedFolderId === folder.id ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <div
                  onClick={() => handleFolderClick(folder.id)}
                  className="px-4 py-4 flex items-center justify-between active:bg-gray-50 cursor-pointer min-h-[44px]"
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-base font-medium text-gray-900">
                        {folder.name}
                      </span>
                      {folder.system && (
                        <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          System
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {getContactCount(folder.id)} contact{getContactCount(folder.id) !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder);
                    }}
                    disabled={deletingId === folder.id}
                    className="ml-4 text-red-600 active:text-red-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Delete folder"
                  >
                    {deletingId === folder.id ? (
                      <div className="text-sm">Deleting...</div>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
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
              </div>
            ))}
          </div>
        )}

        {/* New Folder Input */}
        {showNewFolderInput ? (
          <div className="bg-white border-t border-gray-200 px-4 py-4">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              autoFocus
              className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
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
                className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg active:bg-blue-700 min-h-[44px]"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewFolderInput(false);
                  setNewFolderName('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg active:bg-gray-300 min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNewFolderInput(true)}
            className="w-full bg-white border-t border-gray-200 px-4 py-4 text-blue-600 font-medium active:bg-gray-50 min-h-[44px]"
          >
            + Create New Folder
          </button>
        )}
      </div>
    </div>
  );
}

