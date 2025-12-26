# Network Contacts

A mobile-first, offline-first professional contacts web app built with React, TypeScript, and IndexedDB.

## Features

- **Dark Mode**: System preference detection with manual toggle
- **Export/Import**: VCF and JSON format support for data backup
- **Sample Data**: Try the app with sample contacts
- **Drag & Drop**: Reorder folders easily
- **QR Scanning**: Scan LinkedIn QR codes
- **Mobile-First Design**: Optimized for mobile screens (360-430px) with progressive enhancement for desktop
- **Offline-First**: All data stored locally in IndexedDB, works completely offline
- **Folder Organization**: Organize contacts into folders (Founders, Engineers, Investors, GTM, etc.)
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
│   ├── DarkModeToggle.tsx
│   ├── QRScanner.tsx
│   └── SearchBar.tsx
├── contexts/          # React Context providers
│   ├── ContactsContext.tsx
│   ├── FoldersContext.tsx
│   ├── EventModeContext.tsx
│   └── DarkModeContext.tsx
├── db/               # IndexedDB operations
│   ├── index.ts
│   ├── contacts.ts
│   └── folders.ts
├── types/            # TypeScript types
│   └── index.ts
├── utils/            # Utility functions
│   ├── constants.ts
│   ├── helpers.ts
│   └── mockData.ts
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

- System folders (Founders, Engineers, etc.) are created automatically
- Create custom folders in the Folders page
- System folders cannot be deleted but can be renamed
- Drag and drop folders to reorder them
- Tap a folder to expand/collapse contacts

### Export/Import

- **Export**: Click the export icon in the header to download contacts as VCF file
- **Import**: Click the import icon to import contacts from VCF or JSON files

### Sample Data

- Click "Try sample data" to add sample contacts to explore the app
- Click "Remove sample data" to remove all sample contacts

### Dark Mode

- Toggle dark mode using the toggle in the header
- App respects your system preference on first load

## Data Storage

All data is stored locally in the browser's IndexedDB:
- **Database Name**: `NetworkContactsDB`
- **Stores**: `contacts`, `folders`
- Data persists across browser sessions
- No data is sent to any server

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fayasfarmisofficial-cyber/NetworkContactsApp)

Or manually:

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Vercel will auto-detect Vite settings
4. Click Deploy

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Open source - feel free to use and modify as needed.
