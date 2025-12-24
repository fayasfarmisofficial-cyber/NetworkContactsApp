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
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search contacts"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-[15px] bg-gray-100 border-0 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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

