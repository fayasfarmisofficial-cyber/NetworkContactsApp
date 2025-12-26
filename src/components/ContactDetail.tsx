import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Contact } from '../types';
import { getContactById } from '../db/contacts';
import { useContacts } from '../contexts/ContactsContext';
import { formatPhoneNumber } from '../utils/helpers';

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
      navigate('/');
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact');
      setDeleting(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-page-bg">
        <div className="text-body-secondary text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!contact) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-page-bg">
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center"
        style={{
          backgroundColor: 'var(--color-surface-muted)',
          borderBottom: '1px solid rgba(42, 42, 44, 0.3)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="mr-4 font-medium min-h-[44px] min-w-[44px] flex items-center transition-opacity duration-150 hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-section-title flex-1" style={{ color: 'var(--color-text-primary)' }}>Contact</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto" style={{ backgroundColor: 'var(--color-surface)' }}>
          {/* Name Section */}
          <div 
            className="px-6 py-8 text-center"
            style={{
              borderBottom: '1px solid rgba(42, 42, 44, 0.2)',
            }}
          >
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-semibold text-white">
                {contact.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-page-title mb-1" style={{ color: 'var(--color-text-primary)' }}>{contact.name}</h2>
            {contact.company && (
              <div className="text-body-primary" style={{ color: 'var(--color-text-secondary)' }}>{contact.company}</div>
            )}
            {contact.role && (
              <div className="text-body-secondary mt-1" style={{ color: 'var(--color-text-secondary)' }}>{contact.role}</div>
            )}
          </div>

          {/* Contact Information */}
          <div className="px-6 py-4 space-y-4">
            {/* Phone */}
            <div>
              <div className="text-meta uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-muted)' }}>Phone</div>
              <button
                onClick={handlePhoneClick}
                className="text-body-primary font-medium active:opacity-80 min-h-[44px] transition-opacity duration-150"
                style={{ color: 'var(--color-accent)' }}
              >
                {formatPhoneNumber(contact.phone)}
              </button>
            </div>

            {/* LinkedIn */}
            {contact.linkedin && (
              <div>
                <div className="text-meta uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-muted)' }}>LinkedIn</div>
                <button
                  onClick={handleLinkedInClick}
                  className="text-body-primary font-medium active:opacity-80 min-h-[44px] break-all text-left transition-opacity duration-150"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {contact.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                </button>
              </div>
            )}

            {/* Notes */}
            {contact.notes && (
              <div>
                <div className="text-meta uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-muted)' }}>Notes</div>
                <div className="text-body-secondary whitespace-pre-wrap" style={{ color: 'var(--color-text-primary)' }}>{contact.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div 
        className="px-4 py-3 space-y-2"
        style={{
          backgroundColor: 'var(--color-surface-muted)',
          borderTop: '1px solid rgba(42, 42, 44, 0.3)',
        }}
      >
        <button
          onClick={() => navigate(`/contact/${contact.id}/edit`)}
          className="w-full bg-accent text-white font-medium py-3 rounded-lg active:opacity-90 min-h-[44px] transition-opacity duration-150"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full bg-red-600 text-white font-medium py-3 rounded-lg active:opacity-90 min-h-[44px] disabled:opacity-50 transition-opacity duration-150"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

