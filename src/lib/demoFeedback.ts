import { toast } from 'sonner';

export function demoToast(message: string, description?: string) {
  toast.success(message, description ? { description } : undefined);
}

export function demoInfo(message: string, description?: string) {
  toast.message(message, description ? { description } : undefined);
}

export async function shareOrCopyLink(title: string, text: string, url: string) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      demoToast('Shared successfully');
      return;
    } catch {
      /* user cancelled or share failed */
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    demoToast('Link copied', url);
  } catch {
    demoInfo('Copy blocked', 'Select and copy the address from the bar instead.');
  }
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
  demoToast('Download started', filename);
}
