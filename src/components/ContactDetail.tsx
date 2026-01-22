import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Contact } from '../types';
import { getContactById } from '../db/contacts';
import { useContacts } from '../contexts/ContactsContext';
import { formatPhoneNumber } from '../utils/helpers';
import { copyToClipboard, shareData } from '../utils/clipboard';
import { showToast } from './Toast';

// Icon Components
const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const NotesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export function ContactDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { removeContact } = useContacts();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const loadContact = async () => {
      try {
        const loaded = await getContactById(id);
        if (!loaded) {
          navigate('/');
          return;
        }
        setContact(loaded);
      } catch (error) {
        console.error('Error loading contact:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!contact || !window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      setDeleting(true);
      await removeContact(contact.id);
      showToast('Contact deleted successfully', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error deleting contact:', error);
      showToast('Failed to delete contact', 'error');
      setDeleting(false);
    }
  };

  const handleCopyPhone = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contact?.phone) {
      const success = await copyToClipboard(contact.phone);
      if (success) {
        showToast('Phone number copied to clipboard', 'success');
      } else {
        showToast('Failed to copy phone number', 'error');
      }
    }
  };

  const handleShareContact = async () => {
    if (!contact) return;
    
    // Create vCard format
    const vcfLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${contact.name}`,
      `TEL;TYPE=CELL:${contact.phone}`,
    ];
    
    if (contact.company) {
      vcfLines.push(`ORG:${contact.company}`);
    }
    
    if (contact.role) {
      vcfLines.push(`TITLE:${contact.role}`);
    }
    
    if (contact.linkedin) {
      vcfLines.push(`URL:${contact.linkedin}`);
    }
    
    if (contact.notes) {
      vcfLines.push(`NOTE:${contact.notes.replace(/\n/g, '\\n')}`);
    }
    
    vcfLines.push('END:VCARD');
    
    const vcfData = vcfLines.join('\n');
    
    // Try Web Share API first
    const shareSuccess = await shareData({
      title: `Contact: ${contact.name}`,
      text: vcfData,
    });
    
    if (!shareSuccess) {
      // Fallback: copy to clipboard
      const copySuccess = await copyToClipboard(vcfData);
      if (copySuccess) {
        showToast('Contact copied to clipboard as vCard', 'success');
      } else {
        showToast('Failed to share contact', 'error');
      }
    } else {
      showToast('Contact shared successfully', 'success');
    }
  };

  const handlePhoneClick = () => {
    if (contact) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  const handleLinkedInClick = () => {
    if (contact?.linkedin) {
      window.open(contact.linkedin, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCall = () => {
    if (contact) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  const handleMessage = () => {
    if (contact) {
      window.location.href = `sms:${contact.phone}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-page-bg">
        <div className="text-body-secondary text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!contact) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-page-bg">
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center flex-shrink-0"
        style={{
          backgroundColor: 'var(--color-surface-muted)',
          borderBottom: '1px solid rgba(42, 42, 44, 0.3)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="mr-4 font-medium min-h-[44px] min-w-[44px] flex items-center justify-center transition-opacity duration-150 hover:opacity-80 rounded-full hover:bg-black/5"
          style={{ color: 'var(--color-accent)' }}
          aria-label="Back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-section-title flex-1" style={{ color: 'var(--color-text-primary)' }}>Contact</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {/* Profile Card */}
          <div 
            className="bg-surface rounded-2xl shadow-lg px-6 py-8 text-center"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className="w-28 h-28 bg-accent rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg" style={{ backgroundColor: 'var(--color-accent)' }}>
              <span className="text-4xl font-bold text-white">
                {contact.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{contact.name}</h2>
            {contact.company && (
              <div className="text-lg font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>{contact.company}</div>
            )}
            {contact.role && (
              <div className="text-base mt-1" style={{ color: 'var(--color-text-secondary)' }}>{contact.role}</div>
            )}
          </div>

          {/* Quick Actions */}
          {(contact.phone || contact.linkedin) && (
            <div 
              className="bg-surface rounded-2xl shadow-lg px-4 py-4"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <div className="flex gap-3 justify-center">
                {contact.phone && (
                  <>
                    <button
                      onClick={handleCall}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white font-medium rounded-xl hover:opacity-90 active:opacity-80 transition-all duration-200 min-h-[48px]"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                      aria-label="Call"
                    >
                      <PhoneIcon />
                      <span>Call</span>
                    </button>
                    <button
                      onClick={handleMessage}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-surface-muted text-text-primary font-medium rounded-xl hover:opacity-90 active:opacity-80 transition-all duration-200 min-h-[48px]"
                      style={{ backgroundColor: 'var(--color-surface-muted)' }}
                      aria-label="Message"
                    >
                      <MessageIcon />
                      <span>Message</span>
                    </button>
                  </>
                )}
                {contact.linkedin && (
                  <button
                    onClick={handleLinkedInClick}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#0077b5] text-white font-medium rounded-xl hover:opacity-90 active:opacity-80 transition-all duration-200 min-h-[48px]"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon />
                    <span>LinkedIn</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Contact Information Cards */}
          <div className="space-y-4">
            {/* Phone Card */}
            <div 
              className="bg-surface rounded-2xl shadow-lg px-6 py-5 hover:shadow-xl transition-shadow duration-200"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(90, 200, 250, 0.1)', color: 'var(--color-accent)' }}>
                  <PhoneIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs uppercase tracking-wide mb-2 font-medium" style={{ color: 'var(--color-text-muted)' }}>Phone</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePhoneClick}
                      className="text-lg font-semibold hover:opacity-80 active:opacity-60 transition-opacity duration-150 text-left break-all flex-1"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {formatPhoneNumber(contact.phone)}
                    </button>
                    <button
                      onClick={handleCopyPhone}
                      className="p-2 hover:bg-surface-muted rounded-lg transition-colors duration-150"
                      title="Copy phone number"
                      aria-label="Copy phone number"
                    >
                      <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* LinkedIn Card */}
            {contact.linkedin && (
              <div 
                className="bg-surface rounded-2xl shadow-lg px-6 py-5 hover:shadow-xl transition-shadow duration-200"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0077b5]/10 flex items-center justify-center" style={{ color: '#0077b5' }}>
                    <LinkedInIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs uppercase tracking-wide mb-2 font-medium" style={{ color: 'var(--color-text-muted)' }}>LinkedIn</div>
                    <button
                      onClick={handleLinkedInClick}
                      className="text-lg font-semibold hover:opacity-80 active:opacity-60 transition-opacity duration-150 text-left break-all"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {contact.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Card */}
            {contact.notes && (
              <div 
                className="bg-surface rounded-2xl shadow-lg px-6 py-5 hover:shadow-xl transition-shadow duration-200"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-secondary)' }}>
                    <NotesIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs uppercase tracking-wide mb-3 font-medium" style={{ color: 'var(--color-text-muted)' }}>Notes</div>
                    <div className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-primary)' }}>{contact.notes}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div 
        className="px-4 py-4 space-y-3 flex-shrink-0"
        style={{
          backgroundColor: 'var(--color-surface-muted)',
          borderTop: '1px solid rgba(42, 42, 44, 0.3)',
        }}
      >
        <div className="max-w-2xl mx-auto w-full space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(`/contact/${contact.id}/edit`)}
              className="bg-accent text-white font-medium py-3.5 rounded-xl active:opacity-90 min-h-[52px] transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              <EditIcon />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={handleShareContact}
              className="bg-surface-muted text-text-primary font-medium py-3.5 rounded-xl active:opacity-90 min-h-[52px] transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--color-surface-muted)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full bg-red-600 text-white font-medium py-3.5 rounded-xl active:opacity-90 min-h-[52px] disabled:opacity-50 transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <DeleteIcon />
            <span>{deleting ? 'Deleting...' : 'Delete Contact'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

