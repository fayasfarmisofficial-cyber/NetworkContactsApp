import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ContactsProvider } from './contexts/ContactsContext';
import { FoldersProvider } from './contexts/FoldersContext';
import { EventModeProvider } from './contexts/EventModeContext';
import { ContactList } from './components/ContactList';
import { ContactDetail } from './components/ContactDetail';
import { ContactForm } from './components/ContactForm';
import { FolderList } from './components/FolderList';
import { EventModeToggle } from './components/EventModeToggle';

function AppContent() {
  const location = useLocation();
  const showEventMode = location.pathname === '/';

  return (
    <div className="app">
      {showEventMode && <EventModeToggle />}
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="/contact/new" element={<ContactForm />} />
        <Route path="/contact/:id" element={<ContactDetail />} />
        <Route path="/contact/:id/edit" element={<ContactForm />} />
        <Route path="/folders" element={<FolderList />} />
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

