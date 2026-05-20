import { Keyboard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../app/components/ui/dialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ['Ctrl', 'K'], description: 'Open AI search' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['Esc'], description: 'Close modal / clear selection' },
  { keys: ['J'], description: 'Next event (Discover page)' },
  { keys: ['K'], description: 'Previous event (Discover page)' },
];

export default function KeyboardShortcutsModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="surface-panel max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-h3">
            <Keyboard className="w-5 h-5 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          {shortcuts.map(({ keys, description }) => (
            <div key={description} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
              <span className="text-body-sm text-muted-foreground">{description}</span>
              <div className="flex items-center gap-1">
                {keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-2 py-0.5 rounded-md bg-secondary border border-border text-caption font-mono font-semibold text-foreground"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
