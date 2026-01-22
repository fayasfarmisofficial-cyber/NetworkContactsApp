import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../contexts/ContactsContext';
import { isMockContact } from '../utils/mockData';
import { SHOW_ALL_CONTACTS_KEY, SHOW_SAMPLE_CONTACTS_KEY } from '../utils/constants';
import { showToast } from './Toast';

export function Settings() {
  const navigate = useNavigate();
  const { contacts, removeMultipleContacts } = useContacts();
  const [showAllContacts, setShowAllContacts] = useState(() => {
    const saved = localStorage.getItem(SHOW_ALL_CONTACTS_KEY);
    return saved === 'true';
  });
  const [showSampleContacts, setShowSampleContacts] = useState(() => {
    const saved = localStorage.getItem(SHOW_SAMPLE_CONTACTS_KEY);
    return saved !== 'false'; // Default to true (show sample contacts)
  });
  const [isRemovingSampleData, setIsRemovingSampleData] = useState(false);

  const mockContacts = contacts.filter(isMockContact);
  const hasMockData = mockContacts.length > 0;

  useEffect(() => {
    localStorage.setItem(SHOW_ALL_CONTACTS_KEY, showAllContacts.toString());
  }, [showAllContacts]);

  useEffect(() => {
    localStorage.setItem(SHOW_SAMPLE_CONTACTS_KEY, showSampleContacts.toString());
  }, [showSampleContacts]);

  const handleToggleSampleContacts = async () => {
    const newValue = !showSampleContacts;
    
    // If turning off (hiding sample contacts), actually remove them
    if (!newValue && hasMockData) {
      if (!window.confirm(`This will permanently delete all ${mockContacts.length} sample contact${mockContacts.length !== 1 ? 's' : ''}. This action cannot be undone. Continue?`)) {
        return;
      }
      
      try {
        setIsRemovingSampleData(true);
        const idsToRemove = mockContacts.map(contact => contact.id);
        await removeMultipleContacts(idsToRemove);
        setShowSampleContacts(newValue);
        showToast('Sample contacts removed successfully', 'success');
      } catch (error) {
        console.error('Error removing sample data:', error);
        showToast('Failed to remove sample data', 'error');
      } finally {
        setIsRemovingSampleData(false);
      }
    } else {
      setShowSampleContacts(newValue);
    }
  };

  return (
    <div className="flex flex-col h-full bg-page-bg">
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
        <h1 className="text-section-title text-text-primary flex-1">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-surface">
        <div className="border-b border-border">
          <div className="px-4 py-4">
            <h2 className="text-body-primary text-text-primary font-medium mb-1">Sample Data</h2>
            <p className="text-helper text-text-secondary mb-4">
              {hasMockData
                ? `You have ${mockContacts.length} sample contact${mockContacts.length !== 1 ? 's' : ''} in your contacts.`
                : 'No sample contacts found.'
              }
            </p>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-body-secondary text-text-primary font-medium mb-1">
                  {showSampleContacts ? 'Show Sample Contacts' : 'Hide Sample Contacts'}
                </div>
                <div className="text-helper text-text-secondary">
                  {showSampleContacts
                    ? 'Sample contacts are visible in your contact list.'
                    : 'Sample contacts are hidden from your contact list.'
                  }
                </div>
              </div>
              <button
                onClick={handleToggleSampleContacts}
                disabled={!hasMockData || isRemovingSampleData}
                className={`ml-4 relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed ${showSampleContacts ? 'bg-accent' : 'bg-gray-300'
                  }`}
                style={{
                  backgroundColor: showSampleContacts ? 'var(--color-accent)' : undefined
                }}
                role="switch"
                aria-checked={showSampleContacts}
                aria-label="Toggle show sample contacts"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${showSampleContacts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-border">
          <div className="px-4 py-4">
            <h2 className="text-body-primary text-text-primary font-medium mb-1">Display Settings</h2>
            <p className="text-helper text-text-secondary mb-4">
              Choose how many contacts to show per folder by default.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-body-secondary text-text-primary font-medium mb-1">
                  {showAllContacts ? 'Show All Contacts' : 'Show 5 Contacts'}
                </div>
                <div className="text-helper text-text-secondary">
                  {showAllContacts
                    ? 'All contacts in each folder will be displayed. You can click "Show less" to collapse.'
                    : 'Only 5 contacts will be shown per folder. Click "Show more" to see all.'
                  }
                </div>
              </div>
              <button
                onClick={() => setShowAllContacts(!showAllContacts)}
                className={`ml-4 relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-transparent ${showAllContacts ? 'bg-accent' : 'bg-gray-300'
                  }`}
                style={{
                  backgroundColor: showAllContacts ? 'var(--color-accent)' : undefined
                }}
                role="switch"
                aria-checked={showAllContacts}
                aria-label="Toggle show all contacts"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${showAllContacts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

