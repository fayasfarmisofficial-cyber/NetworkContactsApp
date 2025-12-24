import { useNavigate } from 'react-router-dom';
import { Contact } from '../types';

interface ContactCardProps {
  contact: Contact;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function ContactCard({ contact }: ContactCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/contact/${contact.id}`);
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${contact.phone}`;
  };

  const handleLinkedInClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contact.linkedin) {
      window.open(contact.linkedin, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white px-4 py-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors flex items-center gap-4 border-b border-gray-100"
    >
      {/* Avatar */}
      <div className={`${getAvatarColor(contact.name)} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
        <span className="text-white text-sm font-medium">
          {getInitials(contact.name)}
        </span>
      </div>

      {/* Contact Info */}
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-normal text-gray-900 truncate">
          {contact.name}
        </div>
        {(contact.company || contact.role) && (
          <div className="text-sm text-gray-500 truncate mt-0.5">
            {contact.company || contact.role}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Call Button */}
        <button
          onClick={handlePhoneClick}
          className="p-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200 rounded-full min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors"
          aria-label="Call"
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </button>

        {/* LinkedIn Button */}
        {contact.linkedin && (
          <button
            onClick={handleLinkedInClick}
            className="p-2 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-full min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors"
            aria-label="LinkedIn"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

