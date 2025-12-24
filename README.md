# Network Contacts

A mobile-first, offline-first professional contacts web app built with React, TypeScript, and IndexedDB.

## Features

- **Mobile-First Design**: Optimized for mobile screens (360-430px) with progressive enhancement for desktop
- **Offline-First**: All data stored locally in IndexedDB, works completely offline
- **Folder Organization**: Organize contacts into folders (Devs, Engineers, AI Engineers, Investors, GTM, etc.)
- **Event Mode**: Automatically assign new contacts to a selected folder
- **Search**: Real-time search across names, companies, roles, and phone numbers
- **Contact Management**: Add, edit, delete contacts with phone, LinkedIn, notes, and more
- **No Backend**: Fully client-side, no server required
- **Privacy-First**: No analytics, tracking, or cloud storage

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **IndexedDB** - Local storage
- **React Router** - Navigation

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The static files will be in the `dist/` directory, ready to deploy to any static hosting service.

## Project Structure

```
src/
├── components/        # React components
│   ├── ContactList.tsx
│   ├── ContactCard.tsx
│   ├── ContactDetail.tsx
│   ├── ContactForm.tsx
│   ├── FolderList.tsx
│   ├── FolderSelector.tsx
│   ├── EventModeToggle.tsx
│   └── SearchBar.tsx
├── contexts/          # React Context providers
│   ├── ContactsContext.tsx
│   ├── FoldersContext.tsx
│   └── EventModeContext.tsx
├── db/               # IndexedDB operations
│   ├── index.ts
│   ├── contacts.ts
│   └── folders.ts
├── types/            # TypeScript types
│   └── index.ts
├── utils/            # Utility functions
│   ├── constants.ts
│   └── helpers.ts
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Usage

### Adding Contacts

1. Tap the floating "+" button on the contacts list
2. Fill in contact information (phone is required)
3. Select folders for the contact
4. Save

### Event Mode

1. Tap "Event Mode" to turn it ON
2. Select a folder as the active event folder
3. All new contacts will automatically be assigned to that folder
4. Turn OFF when done

### Folders

- System folders (Devs, Engineers, etc.) are created automatically
- Create custom folders in the Folders page
- System folders cannot be deleted but can be renamed
- Tap a folder to filter contacts by that folder

### Search

- Use the search bar to find contacts by name, company, role, or phone number
- Search works in real-time as you type

## Data Storage

All data is stored locally in the browser's IndexedDB:
- **Database Name**: `NetworkContactsDB`
- **Stores**: `contacts`, `folders`
- Data persists across browser sessions
- No data is sent to any server

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Open source - feel free to use and modify as needed.

