import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../app/components/ui/dialog';

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  destructive?: boolean;
  children?: React.ReactNode;
  maxWidthClassName?: string;
}

export default function ConfirmationModal({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
  children,
  maxWidthClassName = 'max-w-lg',
}: ConfirmationModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidthClassName} overflow-hidden border-border/70 p-0`}>
        <DialogHeader className="border-b border-border/60 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent px-5 py-4">
          <div className="mb-2 flex justify-center">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                destructive
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-primary/15 text-primary'
              }`}
            >
              {destructive ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            </span>
          </div>
          <DialogTitle className={`text-center text-h3 font-black ${destructive ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-body-sm text-muted-foreground">
            {message}
          </DialogDescription>
        </DialogHeader>

        {children && <div className="max-h-[60vh] overflow-y-auto px-5 py-4">{children}</div>}

        <DialogFooter className="flex-col-reverse gap-2 border-t border-border/60 bg-background/80 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            onClick={handleCancel}
            className="w-full rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:w-auto"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className={`w-full rounded-xl px-4 py-2 text-sm font-semibold transition-colors sm:w-auto ${
              destructive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'btn-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
