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
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!contact) {
    return null;
  }

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
        <h1 className="text-lg font-semibold text-gray-900 flex-1">Contact</h1>
      </div>

      {/* Content - iOS style */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white max-w-md mx-auto">
          {/* Name Section */}
          <div className="px-6 py-8 text-center border-b border-gray-100">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-semibold text-white">
                {contact.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">{contact.name}</h2>
            {contact.company && (
              <div className="text-lg text-gray-600">{contact.company}</div>
            )}
            {contact.role && (
              <div className="text-base text-gray-500 mt-1">{contact.role}</div>
            )}
          </div>

          {/* Contact Information */}
          <div className="px-6 py-4 space-y-4">
            {/* Phone */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</div>
              <button
                onClick={handlePhoneClick}
                className="text-lg text-blue-600 font-medium active:text-blue-700 min-h-[44px]"
              >
                {formatPhoneNumber(contact.phone)}
              </button>
            </div>

            {/* LinkedIn */}
            {contact.linkedin && (
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">LinkedIn</div>
                <button
                  onClick={handleLinkedInClick}
                  className="text-lg text-blue-600 font-medium active:text-blue-700 min-h-[44px] break-all text-left"
                >
                  {contact.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                </button>
              </div>
            )}

            {/* Notes */}
            {contact.notes && (
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Notes</div>
                <div className="text-base text-gray-900 whitespace-pre-wrap">{contact.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 space-y-2">
        <button
          onClick={() => navigate(`/contact/${contact.id}/edit`)}
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg active:bg-blue-700 min-h-[44px]"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full bg-red-600 text-white font-medium py-3 rounded-lg active:bg-red-700 min-h-[44px] disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

