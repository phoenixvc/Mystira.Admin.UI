import { useState, useCallback } from "react";

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  resolve: ((value: boolean) => void) | null;
}

const defaultOptions: ConfirmationOptions = {
  title: "Confirm",
  message: "Are you sure?",
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "danger",
};

/**
 * Hook for managing confirmation dialogs with promise-based API
 *
 * Usage:
 * ```tsx
 * const { confirm, confirmationProps } = useConfirmation();
 *
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: "Delete Item",
 *     message: "Are you sure you want to delete this item?",
 *   });
 *   if (confirmed) {
 *     // Proceed with delete
 *   }
 * };
 *
 * return (
 *   <>
 *     <button onClick={handleDelete}>Delete</button>
 *     <ConfirmationDialog {...confirmationProps} />
 *   </>
 * );
 * ```
 */
export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    ...defaultOptions,
    isOpen: false,
    resolve: null,
  });

  const confirm = useCallback((options: Partial<ConfirmationOptions> = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...defaultOptions,
        ...options,
        isOpen: true,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((prev) => ({ ...prev, isOpen: false, resolve: null }));
  }, [state.resolve]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState((prev) => ({ ...prev, isOpen: false, resolve: null }));
  }, [state.resolve]);

  const confirmationProps = {
    isOpen: state.isOpen,
    title: state.title,
    message: state.message,
    confirmText: state.confirmText,
    cancelText: state.cancelText,
    variant: state.variant,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  };

  return {
    confirm,
    confirmationProps,
  };
}
