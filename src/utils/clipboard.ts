/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Use modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Shares data using Web Share API or falls back to clipboard
 */
export async function shareData(data: { title?: string; text?: string; url?: string }): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share(data);
      return true;
    }
    
    // Fallback: copy text to clipboard
    const text = [data.title, data.text, data.url].filter(Boolean).join('\n');
    if (text) {
      return await copyToClipboard(text);
    }
    
    return false;
  } catch (err: any) {
    // User cancelled share
    if (err.name === 'AbortError') {
      return false;
    }
    console.error('Failed to share:', err);
    return false;
  }
}


