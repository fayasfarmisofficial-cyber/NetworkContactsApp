import { useEventMode } from '../contexts/EventModeContext';
import { useFolders } from '../contexts/FoldersContext';
import { useNavigate } from 'react-router-dom';

export function EventModeToggle() {
  const { eventMode, setEventModeEnabled, setActiveFolderId, toggleEventMode } = useEventMode();
  const { folders } = useFolders();
  const navigate = useNavigate();

  const handleFolderSelect = (folderId: string) => {
    if (eventMode.enabled && eventMode.activeFolderId === folderId) {
      // Deselect if already selected
      setActiveFolderId(null);
      setEventModeEnabled(false);
    } else {
      setActiveFolderId(folderId);
      setEventModeEnabled(true);
    }
  };

  const activeFolder = eventMode.activeFolderId
    ? folders.find(f => f.id === eventMode.activeFolderId)
    : null;

  return (
    <div className="bg-surface border-b border-border">
      {eventMode.enabled && activeFolder ? (
        <div className="px-4 py-3 bg-surface-muted border-b-2 border-accent">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-meta text-accent uppercase tracking-wide font-semibold mb-1">
                Event Mode ON
              </div>
              <div className="text-helper font-medium text-text-primary">
                Active Folder: {activeFolder.name}
              </div>
            </div>
            <button
              onClick={toggleEventMode}
              className="ml-4 px-4 py-2 bg-accent text-white text-helper font-medium rounded-lg active:opacity-90 min-h-[44px] transition-opacity duration-150"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              Turn OFF
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-helper font-medium text-text-primary mb-1">Event Mode</div>
              <div className="text-meta text-text-secondary">
                Auto-assign new contacts to a folder
              </div>
            </div>
            <button
              onClick={() => {
                if (folders.length === 0) {
                  alert('Please create a folder first');
                  navigate('/folders');
                  return;
                }
                // Show folder selection
                const folderId = folders[0].id;
                setActiveFolderId(folderId);
                setEventModeEnabled(true);
              }}
              className="ml-4 px-4 py-2 bg-surface border border-border text-text-primary text-helper font-medium rounded-lg hover:bg-surface-muted active:bg-surface-muted min-h-[44px] transition-colors duration-150"
            >
              Turn ON
            </button>
          </div>
        </div>
      )}

      {/* Folder Quick Select */}
      {eventMode.enabled && folders.length > 0 && (
        <div className="px-4 pb-3 border-t border-border pt-3">
          <div className="text-meta text-text-secondary uppercase tracking-wide mb-2">Select Active Folder</div>
          <div className="flex flex-wrap gap-2">
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => handleFolderSelect(folder.id)}
                className={`px-3 py-1.5 rounded-full text-helper font-medium min-h-[44px] transition-colors duration-150 ${
                  eventMode.activeFolderId === folder.id
                    ? 'bg-accent text-white active:opacity-90'
                    : 'bg-surface border border-border text-text-primary active:bg-surface-muted'
                }`}
                style={eventMode.activeFolderId === folder.id ? { backgroundColor: 'var(--color-accent)' } : undefined}
              >
                {folder.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

