import { useDarkMode } from '../contexts/DarkModeContext';

export function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div 
      className={`p-1.5 rounded-lg border transition-colors duration-200 ${
        isDark 
          ? 'bg-blue-500/15 border-blue-500/40' 
          : 'bg-blue-500/10 border-blue-500/30'
      }`}
    >
      <button
        onClick={toggleDarkMode}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-transparent"
        style={{ 
          backgroundColor: isDark ? 'var(--color-accent)' : 'rgba(0, 122, 255, 0.4)'
        }}
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
            isDark ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
