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
    <div className="bg-white border-b border-gray-200">
      {eventMode.enabled && activeFolder ? (
        <div className="px-4 py-3 bg-blue-50 border-b-2 border-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs text-blue-600 uppercase tracking-wide font-semibold mb-1">
                Event Mode ON
              </div>
              <div className="text-sm font-medium text-blue-900">
                Active Folder: {activeFolder.name}
              </div>
            </div>
            <button
              onClick={toggleEventMode}
              className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg active:bg-blue-700 min-h-[44px]"
            >
              Turn OFF
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Event Mode</div>
              <div className="text-xs text-gray-500">
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
              className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg active:bg-gray-300 min-h-[44px]"
            >
              Turn ON
            </button>
          </div>
        </div>
      )}

      {/* Folder Quick Select */}
      {eventMode.enabled && folders.length > 0 && (
        <div className="px-4 pb-3 border-t border-gray-100 pt-3">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Select Active Folder</div>
          <div className="flex flex-wrap gap-2">
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => handleFolderSelect(folder.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium min-h-[44px] ${
                  eventMode.activeFolderId === folder.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                }`}
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

