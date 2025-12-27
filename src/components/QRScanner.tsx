import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export interface QRScanResult {
  linkedin: string;
  name?: string;
}

interface QRScannerProps {
  onScan: (result: QRScanResult) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const initializingRef = useRef(false);
  const elementIdRef = useRef(`qr-scanner-${Math.random().toString(36).substr(2, 9)}`);
  
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Store callbacks in refs
  const onScanRef = useRef(onScan);
  const onCloseRef = useRef(onClose);
  
  useEffect(() => {
    onScanRef.current = onScan;
    onCloseRef.current = onClose;
  }, [onScan, onClose]);

  // Initialize scanner
  useEffect(() => {
    mountedRef.current = true;
    let timeoutId: NodeJS.Timeout | null = null;
    let rafId: number | null = null;

    // Helper function to unescape vCard values
    const unescapeVcfValue = (value: string): string => {
      return value
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\,/g, ',')
        .replace(/\\;/g, ';')
        .replace(/\\\\/g, '\\');
    };

    // Parse vCard data from QR code
    const parseVCard = (vcfData: string): { name?: string; linkedin?: string } => {
      const result: { name?: string; linkedin?: string } = {};
      
      if (!vcfData.includes('BEGIN:VCARD')) {
        return result;
      }

      const lines = vcfData.split(/\r?\n/);
      
      lines.forEach(line => {
        const upperLine = line.toUpperCase();
        if (upperLine.startsWith('FN:')) {
          result.name = unescapeVcfValue(line.substring(3).trim());
        } else if (upperLine.startsWith('URL:')) {
          const url = unescapeVcfValue(line.substring(4).trim());
          if (url.includes('linkedin.com') || url.includes('linked.in')) {
            result.linkedin = url;
          }
        }
      });
      
      return result;
    };

    // Extract name from LinkedIn URL (fallback method)
    const extractNameFromLinkedInUrl = (url: string): string | undefined => {
      try {
        // Try to extract name from URL path like /in/john-doe/
        const match = url.match(/\/in\/([^\/\?]+)/);
        if (match && match[1]) {
          // Convert "john-doe" to "John Doe"
          return match[1]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        }
      } catch {
        // Ignore errors
      }
      return undefined;
    };

    // Handle scan result - defined inside useEffect to avoid dependency issues
    const handleScanResult = (decodedText: string) => {
      if (!mountedRef.current || !scannerRef.current) return;

      try {
        const normalizedText = decodedText.trim();
        let linkedinUrl: string | undefined;
        let name: string | undefined;

        // Check if it's a vCard format
        if (normalizedText.includes('BEGIN:VCARD')) {
          const vCardData = parseVCard(normalizedText);
          linkedinUrl = vCardData.linkedin;
          name = vCardData.name;
        } else {
          // Check if it's a LinkedIn URL
          const isLinkedInUrl = 
            normalizedText.includes('linkedin.com') || 
            normalizedText.includes('linked.in') ||
            (normalizedText.startsWith('http') && normalizedText.toLowerCase().includes('linkedin'));
          
          if (isLinkedInUrl) {
            linkedinUrl = normalizedText;
            // Try to extract name from URL as fallback
            name = extractNameFromLinkedInUrl(normalizedText);
          }
        }

        if (linkedinUrl) {
          // Normalize the URL
          let normalizedLinkedInUrl = linkedinUrl;
          if (!normalizedLinkedInUrl.startsWith('http://') && !normalizedLinkedInUrl.startsWith('https://')) {
            normalizedLinkedInUrl = 'https://' + normalizedLinkedInUrl;
          }
          normalizedLinkedInUrl = normalizedLinkedInUrl.replace(/^http:\/\//, 'https://');
          
          // Stop scanner first
          const scanner = scannerRef.current;
          scannerRef.current = null;
          
          scanner.stop()
            .catch(() => {
              // Ignore stop errors
            })
            .finally(() => {
              try {
                scanner.clear();
              } catch {
                // Ignore clear errors
              }
              
              // Call callbacks after a small delay
              if (mountedRef.current) {
                setTimeout(() => {
                  if (mountedRef.current) {
                    try {
                      onScanRef.current({
                        linkedin: normalizedLinkedInUrl,
                        name: name,
                      });
                      onCloseRef.current();
                    } catch (err) {
                      console.error('Callback error:', err);
                    }
                  }
                }, 50);
              }
            });
        } else {
          if (mountedRef.current) {
            setError('This QR code does not contain a LinkedIn link. Please scan a LinkedIn QR code.');
            setTimeout(() => {
              if (mountedRef.current) {
                setError(null);
              }
            }, 3000);
          }
        }
      } catch (err) {
        console.error('Scan result processing error:', err);
      }
    };

    const init = async () => {
      // Prevent multiple initializations
      if (initializingRef.current || scannerRef.current || !containerRef.current) {
        return;
      }

      initializingRef.current = true;

      try {
        if (mountedRef.current) {
          setInitializing(true);
          setError(null);
        }

        // Wait for DOM to be ready
        await new Promise(resolve => {
          rafId = requestAnimationFrame(() => {
            setTimeout(resolve, 100);
          });
        });

        if (!mountedRef.current || !containerRef.current) {
          initializingRef.current = false;
          return;
        }

        const container = containerRef.current;
        const elementId = elementIdRef.current;
        
        // Create container div if it doesn't exist
        let scannerElement = container.querySelector(`#${elementId}`) as HTMLDivElement;
        if (!scannerElement) {
          scannerElement = document.createElement('div');
          scannerElement.id = elementId;
          scannerElement.className = 'w-full h-full';
          container.appendChild(scannerElement);
        }

        // Initialize scanner
        const html5QrCode = new Html5Qrcode(elementId);
        
        if (!mountedRef.current) {
          try {
            html5QrCode.clear();
          } catch {
            // Ignore clear errors
          }
          initializingRef.current = false;
          return;
        }

        scannerRef.current = html5QrCode;

        // Get camera
        let cameraId: string | { facingMode: string } = { facingMode: 'environment' };
        
        try {
          const cameras = await Html5Qrcode.getCameras();
          if (cameras && cameras.length > 0) {
            const backCamera = cameras.find((cam: any) => 
              cam.label?.toLowerCase().includes('back') || 
              cam.label?.toLowerCase().includes('rear')
            );
            cameraId = backCamera ? backCamera.id : cameras[0].id;
          }
        } catch (cameraErr) {
          console.warn('Camera detection error, using default:', cameraErr);
        }

        if (!mountedRef.current) {
          try {
            html5QrCode.clear();
          } catch {
            // Ignore clear errors
          }
          initializingRef.current = false;
          return;
        }

        // Start scanner
        await html5QrCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          handleScanResult,
          (errorMessage) => {
            // Ignore common scanning errors
            if (!errorMessage.includes('NotFoundException') && 
                !errorMessage.includes('No MultiFormat Readers') &&
                !errorMessage.includes('QR code parse error')) {
              console.debug('QR scan error:', errorMessage);
            }
          }
        );

        if (mountedRef.current) {
          setScanning(true);
          setInitializing(false);
        }
        initializingRef.current = false;
      } catch (err: any) {
        console.error('Scanner initialization error:', err);
        initializingRef.current = false;

        if (mountedRef.current) {
          let errorMessage = 'Failed to start camera.';
          if (err.name === 'NotAllowedError' || err.message?.includes('permission')) {
            errorMessage = 'Camera permission denied. Please allow camera access and try again.';
          } else if (err.name === 'NotFoundError' || err.message?.includes('camera')) {
            errorMessage = 'No camera found. Please use a device with a camera.';
          } else if (err.message) {
            errorMessage = err.message;
          }

          setInitializing(false);
          setError(errorMessage);
        }
      }
    };

    // Start initialization after a short delay
    timeoutId = setTimeout(() => {
      init();
    }, 150);

    // Cleanup
    return () => {
      mountedRef.current = false;
      initializingRef.current = false;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Cleanup scanner
      if (scannerRef.current) {
        const scanner = scannerRef.current;
        scannerRef.current = null;

        scanner.stop()
          .catch(() => {
            // Ignore stop errors
          })
          .finally(() => {
            try {
              scanner.clear();
            } catch {
              // Ignore clear errors
            }
          });
      }

      // Clean up DOM element
      if (containerRef.current) {
        const element = containerRef.current.querySelector(`#${elementIdRef.current}`);
        if (element) {
          element.remove();
        }
      }
    };
  }, []); // Only run once on mount

  // Handle close
  const handleClose = useCallback(() => {
    if (scannerRef.current) {
      const scanner = scannerRef.current;
      scannerRef.current = null;
      
        scanner.stop()
          .catch(() => {})
          .finally(() => {
            try {
              scanner.clear();
            } catch {
              // Ignore clear errors
            }
            onCloseRef.current();
          });
    } else {
      onCloseRef.current();
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-section-title text-text-primary">Scan LinkedIn QR Code</h2>
          <button
            onClick={handleClose}
            className="text-text-muted hover:text-text-secondary transition-colors duration-150"
            aria-label="Close scanner"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div 
            ref={containerRef}
            className="w-full rounded-lg overflow-hidden bg-surface-muted" 
            style={{ minHeight: '300px' }}
          >
            {initializing && (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
                  <p className="text-helper text-text-secondary">Initializing camera...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-surface-muted border border-red-600 rounded-lg text-helper text-red-600">
            {error}
          </div>
        )}

        {scanning && !error && (
          <div className="text-center text-helper text-text-secondary mb-4">
            Position the QR code within the frame
          </div>
        )}

        <button
          onClick={handleClose}
          className="w-full bg-surface-muted text-text-primary font-medium py-2.5 rounded-lg hover:opacity-90 active:opacity-80 transition-opacity duration-150"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
