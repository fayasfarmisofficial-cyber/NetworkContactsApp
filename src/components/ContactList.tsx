import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../contexts/ContactsContext';
import { useFolders } from '../contexts/FoldersContext';
import { SearchBar } from './SearchBar';
import { ContactCard } from './ContactCard';
import { sortContactsAlphabetically } from '../utils/helpers';
import { generateMockContacts, isMockContact } from '../utils/mockData';
import { Contact } from '../types';
import { SAMPLE_DATA_INITIALIZED_KEY } from '../utils/constants';
import { showToast } from './Toast';
import { useAppKeyboardShortcuts } from '../utils/keyboardShortcuts';

export function ContactList() {
  const navigate = useNavigate();
  const { contacts, loading, searchQuery, addMultipleContacts, removeMultipleContacts, exportContacts, importContacts } = useContacts();
  const { folders, reorderFolders, addFolder, refreshFolders } = useFolders();
  
  // Enable keyboard shortcuts
  useAppKeyboardShortcuts();
  const [draggedFolderId, setDraggedFolderId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(new Set());
  const [hasInitializedExpansion, setHasInitializedExpansion] = useState(false);
  const [isPopulatingMockData, setIsPopulatingMockData] = useState(false);
  const [isRemovingMockData, setIsRemovingMockData] = useState(false);
  const [showAllContacts, setShowAllContacts] = useState<Record<string, boolean>>({});
  const [isBulkOperation, setIsBulkOperation] = useState(false);

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
  })).sort((a, b) => {
    // Sort: folders with contacts first, then by count (descending), then alphabetically
    if (a.count > 0 && b.count === 0) return -1;
    if (a.count === 0 && b.count > 0) return 1;
    if (a.count !== b.count) return b.count - a.count;
    return a.folder.name.localeCompare(b.folder.name);
  });

  // First-time initialization: pre-install sample data
  useEffect(() => {
    const initializeSampleData = async () => {
      // Check if sample data has already been initialized
      const isInitialized = localStorage.getItem(SAMPLE_DATA_INITIALIZED_KEY);
      if (isInitialized === 'true') {
        return;
      }

      // Wait for folders to be loaded
      if (folders.length === 0 || loading) {
        return;
      }

      // Check if there are any contacts already
      if (contacts.length > 0) {
        // Mark as initialized even if user has their own contacts
        localStorage.setItem(SAMPLE_DATA_INITIALIZED_KEY, 'true');
        return;
      }

      try {
        setIsBulkOperation(true);
        const folderIds = folders.map(f => f.id);
        if (folderIds.length > 0) {
          const mockContactsData = generateMockContacts(folderIds);
          await addMultipleContacts(mockContactsData);
          localStorage.setItem(SAMPLE_DATA_INITIALIZED_KEY, 'true');
        }
      } catch (error) {
        console.error('Error initializing sample data:', error);
      } finally {
        setTimeout(() => setIsBulkOperation(false), 100);
      }
    };

    initializeSampleData();
  }, [folders, contacts.length, loading, addMultipleContacts]);

  // Auto-expand all folders with contacts on initial load only (but not during bulk operations)
  useEffect(() => {
    if (isBulkOperation || hasInitializedExpansion) return;
    if (foldersWithContacts.length === 0) return;
    
    const foldersToExpand = new Set<string>();
    foldersWithContacts.forEach(({ folder, count }) => {
      if (count > 0) {
        foldersToExpand.add(folder.id);
      }
    });
    setExpandedFolderIds(foldersToExpand);
    setHasInitializedExpansion(true);
  }, [foldersWithContacts.length, isBulkOperation, hasInitializedExpansion]);

  const handleFolderToggle = (folderId: string) => {
    setExpandedFolderIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleShowMore = (folderId: string) => {
    setShowAllContacts(prev => ({
      ...prev,
      [folderId]: true,
    }));
  };

  const handleShowLess = (folderId: string) => {
    setShowAllContacts(prev => {
      const newState = { ...prev };
      delete newState[folderId];
      return newState;
    });
  };

  const handlePopulateMockData = async () => {
    // Check if sample data already exists
    const mockContacts = contacts.filter(isMockContact);
    const hasMockData = mockContacts.length > 0;

    if (hasMockData) {
      // Remove sample data
      if (!window.confirm(`Remove all ${mockContacts.length} sample contacts?`)) {
        return;
      }

      try {
        setIsPopulatingMockData(true);
        setIsRemovingMockData(true);
        setIsBulkOperation(true);
        // Remove all mock contacts in batch
        const idsToRemove = mockContacts.map(contact => contact.id);
        await removeMultipleContacts(idsToRemove);
      } catch (error) {
        console.error('Error removing mock data:', error);
        showToast('Failed to remove sample data', 'error');
      } finally {
        setIsPopulatingMockData(false);
        setIsRemovingMockData(false);
        // Delay resetting bulk operation flag to allow UI to stabilize
        setTimeout(() => setIsBulkOperation(false), 100);
      }
      return;
    }

    // Add sample data
    if (!window.confirm('This will add sample contacts to your folders. Continue?')) {
      return;
    }

    try {
      setIsPopulatingMockData(true);
      
      // Refresh folders to get latest state (system folders might have been initialized)
      await refreshFolders();
      
      // Get current folders (may have been updated by refreshFolders, but will use what we have)
      // The folders will update on next render, so we check after a brief delay
      let folderIds = folders.map(f => f.id);

      // If no folders exist, create a default folder
      if (folderIds.length === 0) {
        try {
          await addFolder({ name: 'My Company', system: false });
          // Folders will be refreshed by addFolder, so get them after a brief delay
          await new Promise(resolve => setTimeout(resolve, 100));
          folderIds = folders.map(f => f.id);
          
          // If still no folders, try one more time
          if (folderIds.length === 0) {
            await refreshFolders();
            await new Promise(resolve => setTimeout(resolve, 100));
            folderIds = folders.map(f => f.id);
          }
        } catch (error) {
          console.error('Error creating folder:', error);
        }
      }

      // Final check - if still no folders, show error
      if (folderIds.length === 0) {
        showToast('No folders available. Please create a folder first, then try again.', 'error');
        setIsPopulatingMockData(false);
        return;
      }

      const mockContactsData = generateMockContacts(folderIds);

      // Add all contacts in batch to prevent screen shaking
      setIsBulkOperation(true);
      await addMultipleContacts(mockContactsData);
    } catch (error) {
      console.error('Error populating mock data:', error);
      showToast('Failed to populate mock data', 'error');
    } finally {
      setIsPopulatingMockData(false);
      // Delay resetting bulk operation flag to allow UI to stabilize
      setTimeout(() => setIsBulkOperation(false), 100);
    }
  };

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

  const handleExport = () => {
    try {
      const vcfData = exportContacts();
      const blob = new Blob([vcfData], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts-export-${new Date().toISOString().split('T')[0]}.vcf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting contacts:', error);
      showToast('Failed to export contacts', 'error');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.vcf,.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        await importContacts(text, file.name);
        showToast('Contacts imported successfully!', 'success');
      } catch (error) {
        console.error('Error importing contacts:', error);
        showToast('Failed to import contacts. Please check the file format.', 'error');
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-screen bg-page-bg">
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center justify-between flex-shrink-0"
        style={{
          backgroundColor: 'var(--color-surface-muted)',
          borderBottom: '1px solid rgba(42, 42, 44, 0.3)',
        }}
      >
        <h1 className="text-page-title" style={{ color: 'var(--color-text-primary)' }}>Contacts</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={loading || contacts.length === 0}
            className="p-2 rounded-full min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors duration-150 disabled:opacity-50"
            style={{ 
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              if (!loading && contacts.length > 0) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Export contacts"
            title="Export contacts"
          >
            <svg
              className="w-5 h-5 opacity-70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
          <button
            onClick={handleImport}
            disabled={loading}
            className="p-2 rounded-full min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors duration-150 disabled:opacity-50"
            style={{ 
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Import contacts"
            title="Import contacts"
          >
            <svg
              className="w-5 h-5 opacity-70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </button>
          <button
            onClick={() => navigate('/folders')}
            className="p-2 text-text-secondary hover:bg-surface-muted rounded-full min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors duration-150"
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
          <button
            onClick={() => navigate('/settings')}
            className="p-2 rounded-full min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors duration-150"
            style={{ 
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Settings"
            title="Settings"
          >
            <svg
              className="w-5 h-5 opacity-70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-page-bg relative">
        {isPopulatingMockData && (
          <div className="absolute inset-0 bg-page-bg/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-surface rounded-lg px-6 py-4 shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <span className="text-body-secondary text-text-primary">
                  {isRemovingMockData ? 'Removing sample data...' : 'Adding sample data...'}
                </span>
              </div>
            </div>
          </div>
        )}
        <SearchBar />

        {/* Contacts Grouped by Folder */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-helper text-text-muted">Loading contacts...</div>
          </div>
        ) : foldersWithContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
            <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-text-muted"
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
            <div className="text-body-primary text-text-primary mb-1">
              No contacts yet
            </div>
            <div className="text-helper text-text-secondary mb-6">
              Tap the + button to add your first contact
            </div>
            <button
              onClick={handlePopulateMockData}
              disabled={isPopulatingMockData}
              className="px-4 py-2 bg-accent text-white text-body-secondary font-medium rounded-lg hover:opacity-90 active:opacity-80 disabled:opacity-50 transition-opacity duration-150 min-h-[44px]"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {isPopulatingMockData 
                ? (contacts.filter(isMockContact).length > 0 ? 'Removing sample contacts...' : 'Adding sample contacts...') 
                : (contacts.filter(isMockContact).length > 0 ? `Remove ${contacts.filter(isMockContact).length} sample contacts` : 'Try sample data')
              }
            </button>
          </div>
        ) : contacts.length === 0 && foldersWithContacts.every(f => f.count === 0) ? (
          <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
            <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-text-muted"
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
            <div className="text-body-primary text-text-primary mb-1">
              No contacts in folders
            </div>
            <div className="text-helper text-text-secondary mb-6">
              Add contacts to see them organized by folder
            </div>
            <button
              onClick={handlePopulateMockData}
              disabled={isPopulatingMockData}
              className="px-4 py-2 bg-accent text-white text-body-secondary font-medium rounded-lg hover:opacity-90 active:opacity-80 disabled:opacity-50 transition-opacity duration-150 min-h-[44px]"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {isPopulatingMockData 
                ? (contacts.filter(isMockContact).length > 0 ? 'Removing sample contacts...' : 'Adding sample contacts...') 
                : (contacts.filter(isMockContact).length > 0 ? `Remove ${contacts.filter(isMockContact).length} sample contacts` : 'Try sample data')
              }
            </button>
          </div>
        ) : (
          <div className="bg-surface">
            {foldersWithContacts.map(({ folder, contacts, count }) => {
              const isExpanded = expandedFolderIds.has(folder.id);
              const isEmpty = count === 0;
              const isDragged = draggedFolderId === folder.id;
              const isDragOver = dragOverFolderId === folder.id;
              const showAll = showAllContacts[folder.id] || false;
              const displayedContacts = showAll ? contacts : contacts.slice(0, 5);
              const hasMore = contacts.length > 5;

              return (
                <div
                  key={folder.id}
                  draggable={!isEmpty}
                  onDragStart={(e) => !isEmpty && handleDragStart(e, folder.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, folder.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, folder.id)}
                  className={`transition-all duration-200 ${
                    isDragged ? 'opacity-30' : ''
                  } ${
                    isDragOver ? 'transform translate-y-2 border-t-2 border-accent' : ''
                  }`}
                >
                  {/* Folder Header */}
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!isEmpty) {
                        handleFolderToggle(folder.id);
                      }
                    }}
                    onMouseDown={(e) => {
                      // Prevent text selection on click
                      if (!isEmpty) {
                        e.preventDefault();
                      }
                    }}
                    className={`sticky top-[57px] px-4 py-3.5 z-[5] select-none ${
                      isEmpty 
                        ? 'border-b border-border/30' 
                        : isExpanded
                          ? '' 
                          : 'border-b border-border/20'
                    } ${
                      !isEmpty ? 'cursor-pointer active:opacity-80' : 'cursor-default'
                    } transition-all duration-150`}
                    style={{
                      backgroundColor: dragOverFolderId === folder.id
                        ? 'var(--color-surface-muted)'
                        : isEmpty 
                          ? 'var(--color-surface-muted)' 
                          : isExpanded
                            ? 'var(--color-surface-muted)'  /* Active folder - distinct surface */
                            : 'var(--color-surface-muted)',
                      borderBottom: isExpanded ? 'none' : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 min-w-0">
                      <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                        {!isEmpty && (
                          <svg
                            className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                              isExpanded 
                                ? 'rotate-90 text-text-secondary' 
                                : 'rotate-0 text-text-muted opacity-60'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        )}
                        {isEmpty && (
                          <svg
                            className="w-4 h-4 text-text-muted flex-shrink-0 opacity-50"
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
                        )}
                        <h2 className={`text-section-title truncate flex-1 min-w-0 leading-tight ${
                          isEmpty 
                            ? 'text-text-muted' 
                            : isExpanded
                              ? 'text-text-primary font-semibold'  /* Active folder - stronger emphasis */
                              : 'text-text-primary'
                        }`}>
                          {folder.name}
                        </h2>
                      </div>
                      <span className={`text-meta flex-shrink-0 whitespace-nowrap ml-2 leading-tight ${
                        isEmpty 
                          ? 'text-text-muted' 
                          : isExpanded
                            ? 'text-text-secondary'  /* Active folder - slightly more visible */
                            : 'text-text-muted'
                      }`}>
                        {count} {count === 1 ? 'contact' : 'contacts'}
                      </span>
                    </div>
                  </div>

                  {/* Contacts in this folder */}
                  {!isEmpty && isExpanded && (
                    <div className="bg-surface relative z-0">
                      {displayedContacts.map((contact, index) => (
                        <ContactCard 
                          key={contact.id} 
                          contact={contact}
                          isLast={index === displayedContacts.length - 1 && !hasMore && !showAll}
                        />
                      ))}
                      {hasMore && !showAll && (
                        <button
                          onClick={() => handleShowMore(folder.id)}
                          className="w-full px-4 py-3 text-helper text-accent font-medium hover:bg-[#1f1f21] active:bg-[#1f1f21] transition-colors duration-150"
                          style={{ backgroundColor: 'var(--color-surface)' }}
                        >
                          Show {contacts.length - 5} more
                        </button>
                      )}
                      {hasMore && showAll && (
                        <button
                          onClick={() => handleShowLess(folder.id)}
                          className="w-full px-4 py-3 text-helper text-accent font-medium hover:bg-[#1f1f21] active:bg-[#1f1f21] transition-colors duration-150"
                          style={{ backgroundColor: 'var(--color-surface)' }}
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/contact/new')}
        className="fixed bottom-6 right-6 bg-accent hover:opacity-90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95 transition-all duration-150 z-20"
        style={{ backgroundColor: 'var(--color-accent)' }}
        aria-label="Add contact"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}

