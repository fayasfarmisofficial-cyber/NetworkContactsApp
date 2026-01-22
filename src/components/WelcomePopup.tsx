import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WELCOME_POPUP_DISABLED_KEY } from '../utils/constants';

interface WelcomePopupProps {
  onClose: () => void;
}

export function WelcomePopup({ onClose }: WelcomePopupProps) {
  const navigate = useNavigate();
  const [neverShowAgain, setNeverShowAgain] = useState(false);

  const handleGoToSettings = () => {
    if (neverShowAgain) {
      localStorage.setItem(WELCOME_POPUP_DISABLED_KEY, 'true');
    }
    onClose();
    navigate('/settings');
  };

  const handleKeepSampleData = () => {
    if (neverShowAgain) {
      localStorage.setItem(WELCOME_POPUP_DISABLED_KEY, 'true');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-6 border border-border"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-accent"
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
        </div>
        
        <h2 className="text-section-title text-text-primary text-center mb-3">
          Welcome to Network Contacts!
        </h2>
        
        <p className="text-body-secondary text-text-secondary text-center mb-6">
          We've added some sample contacts to help you get started. You can remove them anytime in Settings.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoToSettings}
            className="w-full px-4 py-3 bg-accent text-white font-medium rounded-lg active:opacity-80 min-h-[44px] transition-opacity duration-150"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Remove Sample Data
          </button>
          <button
            onClick={handleKeepSampleData}
            className="w-full px-4 py-3 bg-surface-muted text-text-primary font-medium rounded-lg active:opacity-80 min-h-[44px] transition-opacity duration-150"
            style={{ backgroundColor: 'var(--color-surface-muted)' }}
          >
            Keep Sample Data
          </button>
          
          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={neverShowAgain}
              onChange={(e) => setNeverShowAgain(e.target.checked)}
              className="w-4 h-4 text-accent border-border rounded focus:ring-2 focus:ring-accent cursor-pointer"
              style={{ accentColor: 'var(--color-accent)' }}
            />
            <span className="text-helper text-text-secondary">
              Never show this popup again
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}





