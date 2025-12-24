# Setup Instructions

## Prerequisites

You need Node.js installed to run this project. Check if it's installed:

```bash
node --version
npm --version
```

If these commands don't work, install Node.js:
- Download from: https://nodejs.org/ (choose LTS version)
- Or install via Homebrew: `brew install node`

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - The terminal will show a URL like `http://localhost:5173`
   - Open that URL in your browser

## Troubleshooting

### "npm: command not found"
- Node.js is not installed. Install it from https://nodejs.org/

### "Error: Cannot find module"
- Run `npm install` to install all dependencies

### Port already in use
- Vite will try to use port 5173
- If it's taken, it will try the next port
- Or specify a port: `npm run dev -- --port 3000`

### TypeScript errors
- Make sure all files are saved
- Try restarting your IDE/editor
- Run `npm install` again to ensure dependencies are installed

### IndexedDB not working
- Make sure you're accessing via `http://localhost` (not `file://`)
- Check browser console for errors
- Some browsers require HTTPS for IndexedDB in production

## Build for Production

```bash
npm run build
```

This creates a `dist/` folder with static files ready to deploy.



