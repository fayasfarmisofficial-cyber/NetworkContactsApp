import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EventModeState } from '../types';

const EVENT_MODE_STORAGE_KEY = 'networkContacts_eventMode';

interface EventModeContextType {
  eventMode: EventModeState;
  setEventModeEnabled: (enabled: boolean) => void;
  setActiveFolderId: (folderId: string | null) => void;
  toggleEventMode: () => void;
}

const EventModeContext = createContext<EventModeContextType | undefined>(undefined);

function loadEventModeState(): EventModeState {
  try {
    const stored = localStorage.getItem(EVENT_MODE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading event mode state:', error);
  }
  return { enabled: false, activeFolderId: null };
}

function saveEventModeState(state: EventModeState) {
  try {
    localStorage.setItem(EVENT_MODE_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving event mode state:', error);
  }
}

export function EventModeProvider({ children }: { children: ReactNode }) {
  const [eventMode, setEventMode] = useState<EventModeState>(loadEventModeState);

  useEffect(() => {
    saveEventModeState(eventMode);
  }, [eventMode]);

  const setEventModeEnabled = (enabled: boolean) => {
    setEventMode(prev => ({
      ...prev,
      enabled,
      activeFolderId: enabled ? prev.activeFolderId : null,
    }));
  };

  const setActiveFolderId = (folderId: string | null) => {
    setEventMode(prev => ({
      ...prev,
      activeFolderId: folderId,
    }));
  };

  const toggleEventMode = () => {
    setEventMode(prev => ({
      enabled: !prev.enabled,
      activeFolderId: !prev.enabled ? prev.activeFolderId : null,
    }));
  };

  return (
    <EventModeContext.Provider
      value={{
        eventMode,
        setEventModeEnabled,
        setActiveFolderId,
        toggleEventMode,
      }}
    >
      {children}
    </EventModeContext.Provider>
  );
}

export function useEventMode() {
  const context = useContext(EventModeContext);
  if (context === undefined) {
    throw new Error('useEventMode must be used within an EventModeProvider');
  }
  return context;
}

