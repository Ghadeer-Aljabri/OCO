import * as DialogPrimitive from "@radix-ui/react-dialog";

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

export function DialogContent({ children, className }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
      <DialogPrimitive.Content className={`fixed p-4 bg-white rounded-lg shadow-lg ${className}`}>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ children }) {
  return <DialogPrimitive.Title className="text-xl font-bold">{children}</DialogPrimitive.Title>;
}
