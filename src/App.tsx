import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ContactsProvider } from './contexts/ContactsContext';
import { FoldersProvider } from './contexts/FoldersContext';
import { EventModeProvider } from './contexts/EventModeContext';
import { ContactList } from './components/ContactList';
import { ContactDetail } from './components/ContactDetail';
import { ContactForm } from './components/ContactForm';
import { FolderList } from './components/FolderList';
import { Settings } from './components/Settings';
import { EventModeToggle } from './components/EventModeToggle';
import { ToastContainer } from './components/Toast';

function AppContent() {
  const location = useLocation();
  const showEventMode = location.pathname === '/';

  return (
    <div className="app">
      <ToastContainer />
      {showEventMode && <EventModeToggle />}
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="/contact/new" element={<ContactForm />} />
        <Route path="/contact/:id" element={<ContactDetail />} />
        <Route path="/contact/:id/edit" element={<ContactForm />} />
        <Route path="/folders" element={<FolderList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ContactsProvider>
        <FoldersProvider>
          <EventModeProvider>
            <AppContent />
          </EventModeProvider>
        </FoldersProvider>
      </ContactsProvider>
    </BrowserRouter>
  );
}

export default App;

