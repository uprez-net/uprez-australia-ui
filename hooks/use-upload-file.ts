import * as React from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export type UploadedFile = {
  key?: string;
  appUrl?: string;
  name: string;
  size: number;
  type: string;
  url?: string; // for preview
  path?: string; // GCS path
};

interface UseUploadFileProps {
  generateSignedUrl: (file: { name: string; type: string }) => Promise<{ url: string; filePath: string }>;
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
}

export function useUploadFile({ generateSignedUrl, onUploadComplete, onUploadError }: UseUploadFileProps) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadingFile(file);

    try {
      const { url: signedUrl, filePath } = await generateSignedUrl({ name: file.name, type: file.type });

      await axios.put(signedUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (evt) => {
          if (evt.total) {
            setProgress(Math.min((evt.loaded / evt.total) * 100, 100));
          }
        },
      });

      const uploaded: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        path: filePath,
        url: URL.createObjectURL(file),
      };

      setUploadedFile(uploaded);
      onUploadComplete?.(uploaded);

      return uploaded;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong, please try again later.';

      toast.error(message);
      onUploadError?.(error);

      // Mock fallback for unauthenticated users
      const mockUploaded: UploadedFile = {
        key: 'mock-key-0',
        appUrl: `https://mock-app-url.com/${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      };

      // Simulate upload progress
      let simulatedProgress = 0;
      while (simulatedProgress < 100) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        simulatedProgress += 2;
        setProgress(Math.min(simulatedProgress, 100));
      }

      setUploadedFile(mockUploaded);
      return mockUploaded;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  };

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile,
    uploadingFile,
  };
}
