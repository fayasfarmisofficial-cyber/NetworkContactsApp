import { useContacts } from '../contexts/ContactsContext';

export function SearchBar() {
    const { searchQuery, setSearchQuery } = useContacts();

    const handleClear = () => {
        setSearchQuery('');
    };

    return (
        <div className="sticky top-0 z-20 bg-page-bg border-b border-border/20 px-4 py-3">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                        className="h-5 w-5 text-text-muted"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-border/50 rounded-lg leading-5 bg-surface-muted placeholder-text-muted focus:outline-none focus:placeholder-text-secondary focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm transition-colors duration-200 text-text-primary"
                    placeholder="Search contacts..."
                />
                {searchQuery && (
                    <button
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-secondary transition-colors duration-150"
                        aria-label="Clear search"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
