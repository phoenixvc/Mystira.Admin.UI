import { useState } from "react";
import { ValidationResult } from "../utils/schemaValidator";

interface UseFileUploadOptions {
  onUpload: (file: File) => Promise<void>;
  validationResult?: ValidationResult | null;
}

export function useFileUpload({ onUpload, validationResult }: UseFileUploadOptions) {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    if (!file) {
      return;
    }

    // Check if validation is required
    if (!validationResult) {
      const shouldContinue = window.confirm(
        "You haven't validated the file yet. Do you want to upload without validation?"
      );
      if (!shouldContinue) return;
    } else if (!validationResult.valid) {
      const shouldContinue = window.confirm(
        `Validation failed with ${validationResult.errors.length} error(s). Do you still want to upload?`
      );
      if (!shouldContinue) return;
    }

    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadFile,
  };
}
