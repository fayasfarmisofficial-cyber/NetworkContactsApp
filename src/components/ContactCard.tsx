import { useNavigate } from 'react-router-dom';
import { Contact } from '../types';

interface ContactCardProps {
  contact: Contact;
  isLast?: boolean;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getAvatarColor(): string {
  // Use accent color for all avatars to maintain consistency
  return 'bg-accent';
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

  // Prioritize company over role for secondary text
  const secondaryText = contact.company || contact.role || null;

  return (
    <div
      onClick={handleClick}
      className="px-5 py-5 hover:bg-surface/30 active:bg-surface/30 cursor-pointer transition-colors duration-150 flex items-center gap-4 rounded-2xl mx-2 my-1.5 border border-border/50"
      style={{
        backgroundColor: 'var(--color-surface)',
      }}
    >
      {/* Avatar */}
      <div className={`${getAvatarColor()} w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: 'var(--color-accent)' }}>
        <span className="text-white text-base font-semibold leading-none opacity-50">
          {getInitials(contact.name)}
        </span>
      </div>

      {/* Contact Info */}
      <div className="flex-1 min-w-0">
        <div className="text-body-primary text-text-primary truncate font-semibold leading-tight mb-1" style={{ fontSize: '16px' }}>
          {contact.name}
        </div>
        {secondaryText && (
          <div className="text-helper text-text-secondary truncate leading-snug" style={{ fontSize: '14px', marginTop: '2px' }}>
            {secondaryText}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Call Button */}
        <button
          onClick={handlePhoneClick}
          className="p-2 text-text-secondary hover:bg-[#1f1f21] active:bg-[#1f1f21] rounded-full min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors duration-150"
          aria-label="Call"
        >
          <svg
            className="w-5 h-5 opacity-80"
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
            className="p-2 text-accent hover:bg-[#1f1f21] active:bg-[#1f1f21] rounded-full min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors duration-150"
            aria-label="LinkedIn"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

