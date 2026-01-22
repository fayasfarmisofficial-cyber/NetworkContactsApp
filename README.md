# Network Contacts

A private, offline-first contact management app built for professionals who network in the real world. Capture contacts instantly by scanning LinkedIn QR codes, stay organized with event-based contact grouping, and keep full control of your data.

**GitHub Repository**: [https://github.com/fayasfarmisofficial-cyber/NetworkContactsApp](https://github.com/fayasfarmisofficial-cyber/NetworkContactsApp)

## What This App Does

Network Contacts helps you capture and organize professional connections at the moment they happen. Whether you're at a conference, networking event, or business meeting, this app lets you:

- **Scan LinkedIn QR codes** to instantly add contacts without typing
- **Organize contacts into folders** (Founders, Engineers, Investors, GTM, etc.)
- **Use Event Mode** to automatically assign new contacts to a selected folder during events
- **Search and filter** your contacts by name, company, role, or phone number
- **Export and import** your contacts in VCF or JSON format for backup
- **Work completely offline** - no internet connection required

## Benefits

### 🔒 Privacy & Security First
- **100% Local Storage**: All your contacts are stored locally on your device using IndexedDB
- **No Cloud Sync**: Your data never leaves your device - no servers, no cloud storage
- **No Accounts Required**: Use the app immediately without signing up or logging in
- **No Tracking**: Zero analytics, zero tracking, zero data collection
- **Complete Ownership**: You own and control all your contact data

### ⚡ Fast & Efficient
- **Instant QR Scanning**: Capture contact information in seconds
- **Offline-First**: Works reliably at conferences and meetups, even with no internet
- **No Backend**: Fully client-side, no server required
- **Lightweight**: Fast loading and smooth performance

### 🎯 Purpose-Built for Networking
- **Event Mode**: Automatically group contacts by event or occasion
- **Mobile-First Design**: Optimized for mobile screens (360-430px) with progressive enhancement for desktop
- **Simple & Focused**: Built for speed, focus, and simplicity - not sales pipelines
- **CRM-Ready**: Designed to sit before a CRM, not replace it

### 💰 Cost-Effective
- **No Subscriptions**: Avoid recurring fees
- **No Hidden Costs**: Completely free and open source
- **Unlimited Customization**: Own the complete source code with unlimited customization rights
- **White-Label Ready**: Deploy internally or white-label without restrictions

## Features

### Contact Management
- **Add, Edit, Delete Contacts**: Full CRUD operations for contact management
- **Rich Contact Information**: Store name, phone, company, role, LinkedIn URL, and notes
- **Phone Number Formatting**: Automatic formatting and validation for phone numbers
- **Copy to Clipboard**: Quick copy functionality for phone numbers and contact info
- **Share Contacts**: Share contacts via Web Share API or export as vCard

### Organization
- **Folder System**: Organize contacts into custom or system folders
- **System Folders**: Pre-configured folders (Founders, Engineers, Investors, GTM, UI/UX, etc.)
- **Custom Folders**: Create your own folders for any category
- **Drag & Drop**: Reorder folders easily
- **Folder Management**: Rename, delete (custom folders only), and organize as needed

### Event Mode
- **Auto-Assignment**: Automatically assign new contacts to a selected folder
- **Quick Toggle**: Turn Event Mode ON/OFF with a single tap
- **Folder Selection**: Choose which folder to use for the current event
- **Perfect for Conferences**: Ideal for networking events, meetups, and conferences

### QR Code Scanning
- **LinkedIn QR Scanner**: Scan LinkedIn QR codes to instantly add contacts
- **Automatic Data Extraction**: Extracts name and LinkedIn URL from QR codes
- **Camera Integration**: Uses device camera for quick scanning
- **No Typing Required**: Eliminate manual data entry

### Search & Filter
- **Real-Time Search**: Search across names, companies, roles, and phone numbers
- **Clear Search Button**: Easy way to clear search queries
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + F` or `/` to focus search
  - `Escape` to clear search
  - `Ctrl/Cmd + N` to create new contact

### Data Management
- **Export Contacts**: Download all contacts as VCF (vCard) file
- **Import Contacts**: Import contacts from VCF or JSON files
- **Sample Data**: Try the app with sample contacts (can be removed anytime)
- **Data Backup**: Export your data anytime for backup

### User Experience
- **Toast Notifications**: Modern, non-intrusive notifications for user feedback
- **Form Validation**: Real-time validation with inline error messages
- **Loading States**: Clear loading indicators during operations
- **Smooth Animations**: Polished transitions and animations throughout
- **Keyboard Shortcuts**: Power user shortcuts for common actions
- **PWA Support**: Install as a standalone app on your device

### Settings & Customization
- **Sample Data Management**: Add or remove sample contacts
- **Display Preferences**: Choose how many contacts to show per folder
- **Welcome Popup**: Informative popup about sample data (can be disabled)

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
│   ├── QRScanner.tsx
│   ├── SearchBar.tsx
│   ├── Settings.tsx
│   ├── Toast.tsx
│   └── WelcomePopup.tsx
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
│   ├── helpers.ts
│   ├── mockData.ts
│   ├── phoneFormatter.ts
│   ├── clipboard.ts
│   └── keyboardShortcuts.ts
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Usage

### Adding Contacts

1. Tap the floating "+" button on the contacts list
2. Fill in contact information (phone is required)
3. Select folders for the contact
4. Save

### QR Code Scanning

1. Tap "Scan QR" button in the contact form
2. Point camera at LinkedIn QR code
3. Contact information is automatically extracted and filled in

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

- Sample contacts are added automatically on first use
- A welcome popup will appear explaining the sample data
- Remove sample data anytime in Settings
- You can disable the welcome popup if desired

## Data Storage

All data is stored locally in the browser's IndexedDB:
- **Database Name**: `NetworkContactsDB`
- **Stores**: `contacts`, `folders`
- Data persists across browser sessions
- No data is sent to any server
- **Your data stays on your device** - complete privacy and control

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
