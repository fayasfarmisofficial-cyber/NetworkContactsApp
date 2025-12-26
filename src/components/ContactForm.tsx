import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Contact, ContactFormData } from '../types';
import { useContacts } from '../contexts/ContactsContext';
import { useFolders } from '../contexts/FoldersContext';
import { useEventMode } from '../contexts/EventModeContext';
import { FolderSelector } from './FolderSelector';
import { QRScanner } from './QRScanner';
import { getContactById } from '../db/contacts';

export function ContactForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { addNewContact, updateExistingContact } = useContacts();
  const { folders } = useFolders();
  const { eventMode } = useEventMode();
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    company: '',
    role: '',
    linkedin: '',
    notes: '',
    folders: [],
  });

  useEffect(() => {
    if (isEditing && id) {
      const loadContact = async () => {
        try {
          const contact = await getContactById(id);
          if (!contact) {
            navigate('/');
            return;
          }
          setFormData({
            name: contact.name,
            phone: contact.phone,
            company: contact.company || '',
            role: contact.role || '',
            linkedin: contact.linkedin || '',
            notes: contact.notes || '',
            folders: contact.folders,
          });
        } catch (error) {
          console.error('Error loading contact:', error);
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      loadContact();
    } else {
      // New contact - auto-assign to event folder if event mode is ON
      if (eventMode.enabled && eventMode.activeFolderId) {
        setFormData(prev => ({
          ...prev,
          folders: [eventMode.activeFolderId!],
        }));
      }
    }
  }, [id, isEditing, navigate, eventMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone.trim()) {
      alert('Phone number is required');
      return;
    }

    try {
      setSaving(true);
      
      const contactData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim() || undefined,
        role: formData.role.trim() || undefined,
        linkedin: formData.linkedin.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        folders: formData.folders,
      };

      if (isEditing && id) {
        await updateExistingContact(id, contactData);
      } else {
        await addNewContact(contactData);
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Failed to save contact');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-page-bg">
        <div className="text-body-secondary text-text-secondary">Loading...</div>
      </div>
    );
  }

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
        <h1 className="text-section-title text-text-primary flex-1">
          {isEditing ? 'Edit Contact' : 'New Contact'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto bg-surface px-4 py-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-meta text-text-secondary mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 text-body-secondary bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary placeholder:text-text-muted transition-colors duration-150"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-meta text-text-secondary mb-2">
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 text-body-secondary bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary placeholder:text-text-muted transition-colors duration-150"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-meta text-text-secondary mb-2">
              Company
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2.5 text-body-secondary bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary placeholder:text-text-muted transition-colors duration-150"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-meta text-text-secondary mb-2">
              Role
            </label>
            <input
              type="text"
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2.5 text-body-secondary bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary placeholder:text-text-muted transition-colors duration-150"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label htmlFor="linkedin" className="block text-meta text-text-secondary mb-2">
              LinkedIn URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="flex-1 px-4 py-2.5 text-body-secondary bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary placeholder:text-text-muted transition-colors duration-150"
              />
              <button
                type="button"
                onClick={() => setShowQRScanner(true)}
                className="px-4 py-2.5 bg-accent text-white font-medium rounded-lg hover:opacity-90 active:opacity-80 transition-opacity duration-150 whitespace-nowrap flex items-center gap-2 min-h-[44px]"
                style={{ backgroundColor: 'var(--color-accent)' }}
                title="Scan QR Code"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span className="hidden sm:inline">Scan QR</span>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-meta text-text-secondary mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 text-body-secondary bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none text-text-primary placeholder:text-text-muted transition-colors duration-150"
            />
          </div>

          {/* Folders */}
          <FolderSelector
            folders={folders}
            selectedFolderIds={formData.folders}
            onChange={(folderIds) => setFormData({ ...formData, folders: folderIds })}
          />

          {/* Event Mode Indicator */}
          {!isEditing && eventMode.enabled && eventMode.activeFolderId && (
            <div className="bg-surface-muted border border-accent rounded-lg p-3 text-helper text-accent">
              Event Mode is ON. This contact will be added to the active event folder.
            </div>
          )}
        </div>
      </form>

      {/* Actions */}
      <div className="bg-surface border-t border-border px-4 py-3">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-accent text-white font-medium py-3 rounded-lg active:opacity-90 min-h-[44px] disabled:opacity-50 transition-opacity duration-150"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Save Contact'}
          </button>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onScan={(linkedinUrl) => {
            setFormData({ ...formData, linkedin: linkedinUrl });
            setShowQRScanner(false);
          }}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
}

