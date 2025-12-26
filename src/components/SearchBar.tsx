import { useState, useEffect } from 'react';
import { useContacts } from '../contexts/ContactsContext';

export function SearchBar() {
  const { setSearchQuery } = useContacts();
  const [localQuery, setLocalQuery] = useState('');

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  return (
    <div 
      className="sticky top-0 z-10 px-4 py-3"
      style={{
        backgroundColor: 'var(--color-surface-muted)',
        borderBottom: '1px solid rgba(42, 42, 44, 0.3)',
      }}
    >
      <div className="relative">
        <input
          type="text"
          placeholder="Search contacts"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-body-secondary border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-text-primary placeholder:text-text-muted transition-all duration-150"
          style={{
            backgroundColor: 'var(--color-surface)',
          }}
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted opacity-60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}

