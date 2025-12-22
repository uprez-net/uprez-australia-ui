"use client";

import * as React from "react";

import { PlaceholderPlugin, UploadErrorCode } from "@platejs/media/react";
import { usePluginOption } from "platejs/react";
import { toast } from "sonner";
import { CircleX } from "lucide-react";

export function MediaUploadToast() {
  useUploadErrorToast();

  return null;
}

const useUploadErrorToast = () => {
  const uploadError = usePluginOption(PlaceholderPlugin, "error");

  React.useEffect(() => {
    if (!uploadError) return;

    const { code, data } = uploadError;

    switch (code) {
      case UploadErrorCode.INVALID_FILE_SIZE: {
        toast.error(
          `The size of files ${data.files
            .map((f) => f.name)
            .join(", ")} is invalid`,
          {
            icon: <CircleX className="notification-icon" />,
          }
        );

        break;
      }
      case UploadErrorCode.INVALID_FILE_TYPE: {
        toast.error(
          `The type of files ${data.files
            .map((f) => f.name)
            .join(", ")} is invalid`,
          { icon: <CircleX className="notification-icon" /> }
        );

        break;
      }
      case UploadErrorCode.TOO_LARGE: {
        toast.error(
          `The size of files ${data.files
            .map((f) => f.name)
            .join(", ")} is too large than ${data.maxFileSize}`,
          { icon: <CircleX className="notification-icon" /> }
        );

        break;
      }
      case UploadErrorCode.TOO_LESS_FILES: {
        toast.error(
          `The mini um number of files is ${data.minFileCount} for ${data.fileType}`,
          {
            icon: <CircleX className="notification-icon" />,
          }
        );

        break;
      }
      case UploadErrorCode.TOO_MANY_FILES: {
        toast.error(
          `The maximum number of files is ${data.maxFileCount} ${
            data.fileType ? `for ${data.fileType}` : ""
          }`,
          {
            icon: <CircleX className="notification-icon" />,
          }
        );

        break;
      }
    }
  }, [uploadError]);
};
