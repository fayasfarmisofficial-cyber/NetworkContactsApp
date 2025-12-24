import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../contexts/ContactsContext';
import { useFolders } from '../contexts/FoldersContext';
import { SearchBar } from './SearchBar';
import { ContactCard } from './ContactCard';
import { sortContactsAlphabetically } from '../utils/helpers';
import { Contact } from '../types';

export function ContactList() {
  const navigate = useNavigate();
  const { contacts, loading, searchQuery } = useContacts();
  const { folders, reorderFolders } = useFolders();
  const [draggedFolderId, setDraggedFolderId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  // Filter contacts by search query
  const filteredContacts = searchQuery.trim()
    ? contacts.filter(contact => {
        const lowerQuery = searchQuery.toLowerCase();
        return (
          contact.name.toLowerCase().includes(lowerQuery) ||
          contact.phone.includes(searchQuery) ||
          contact.company?.toLowerCase().includes(lowerQuery) ||
          contact.role?.toLowerCase().includes(lowerQuery)
        );
      })
    : contacts;

  const getContactCount = (folderId: string): number => {
    return filteredContacts.filter(contact => contact.folders.includes(folderId)).length;
  };

  const getContactsByFolder = (folderId: string): Contact[] => {
    return sortContactsAlphabetically(
      filteredContacts.filter(contact => contact.folders.includes(folderId))
    );
  };

  // Group contacts by folder - always show all folders
  const foldersWithContacts = folders.map(folder => ({
    folder,
    contacts: getContactsByFolder(folder.id),
    count: getContactCount(folder.id),
  }));

  const handleDragStart = (e: React.DragEvent, folderId: string) => {
    setDraggedFolderId(folderId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', folderId);
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedFolderId(null);
    setDragOverFolderId(null);
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedFolderId && draggedFolderId !== folderId) {
      setDragOverFolderId(folderId);
    }
  };

  const handleDragLeave = () => {
    setDragOverFolderId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    setDragOverFolderId(null);

    if (!draggedFolderId || draggedFolderId === targetFolderId) {
      return;
    }

    const draggedIndex = folders.findIndex(f => f.id === draggedFolderId);
    const targetIndex = folders.findIndex(f => f.id === targetFolderId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    // Create new order array
    const newFolders = [...folders];
    const [draggedFolder] = newFolders.splice(draggedIndex, 1);
    newFolders.splice(targetIndex, 0, draggedFolder);

    // Update order values
    const folderOrders = newFolders.map((folder, index) => ({
      id: folder.id,
      order: index,
    }));

    try {
      await reorderFolders(folderOrders);
    } catch (error) {
      console.error('Error reordering folders:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header - Google Contacts Style */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
        <h1 className="text-[22px] font-normal text-gray-900">Contacts</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/folders')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors"
            aria-label="Manage folders"
          >
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
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <SearchBar />

        {/* Contacts Grouped by Folder */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 text-sm">Loading contacts...</div>
          </div>
        ) : foldersWithContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="text-gray-900 text-base font-normal mb-1">
              No contacts yet
            </div>
            <div className="text-gray-500 text-sm">
              Tap the + button to add your first contact
            </div>
          </div>
        ) : (
          <div className="bg-white">
            {foldersWithContacts.map(({ folder, contacts, count }) => (
              <div
                key={folder.id}
                draggable
                onDragStart={(e) => handleDragStart(e, folder.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, folder.id)}
                className={`transition-all ${
                  draggedFolderId === folder.id ? 'opacity-30' : ''
                } ${
                  dragOverFolderId === folder.id ? 'transform translate-y-2 border-t-2 border-blue-500' : ''
                }`}
              >
                {/* Folder Header */}
                <div
                  className={`sticky top-0 px-4 py-3 border-b border-gray-200 z-10 cursor-move select-none touch-none ${
                    dragOverFolderId === folder.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8h16M4 16h16"
                        />
                      </svg>
                      <h2 className="text-[15px] font-medium text-gray-900">
                        {folder.name}
                      </h2>
                    </div>
                    <span className="text-sm text-gray-500">
                      {count} {count === 1 ? 'contact' : 'contacts'}
                    </span>
                  </div>
                </div>

                {/* Contacts in this folder */}
                {contacts.length > 0 ? (
                  contacts.map(contact => (
                    <ContactCard key={contact.id} contact={contact} />
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">
                    No contacts in this folder
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button - Google Style */}
      <button
        onClick={() => navigate('/contact/new')}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95 transition-all z-20"
        aria-label="Add contact"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}

