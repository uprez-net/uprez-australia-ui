import { File, FileImage, FileText, Table } from "lucide-react";

export const returnFileType = (file: string) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "tiff", "ico", "avif"];
    const extension = file.split(".").pop()?.toLowerCase();

    return extension && imageExtensions.includes(extension) ? "image" : extension;
};

export function formatFileName(fileName: string, maxLength = 20) {
    const parts = fileName.split(".");
    const extension = parts.length > 1 ? "." + parts.pop() : "";
    const name = parts.join(".");
  
    // If the name is longer than maxLength, truncate and add "..."
    return name.length > maxLength
      ? name.substring(0, maxLength) + "..." + extension
      : name + extension;
  }
  export function getFileTypeIcon(fileType?: string) {
    switch (fileType) {
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
      case "webp":
      case "image":
        return FileImage;
      case "docx":
      case "pdf":
        return FileText;
      case "xlsx":
        return Table;
      default:
        return File;
    }
  }
  export function getMimeType(filename: string): string | undefined {
    const mimeTypes: Record<string, string> = {
      // Documents
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      csv: "text/csv",
      txt: "text/plain",
      json: "application/json",
      xml: "application/xml",
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
      ts: "application/typescript",
      md: "text/markdown",
  
      // Images
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      bmp: "image/bmp",
      webp: "image/webp",
      svg: "image/svg+xml",
      ico: "image/x-icon",
      tiff: "image/tiff",
  
      // Audio
      mp3: "audio/mpeg",
      wav: "audio/wav",
      ogg: "audio/ogg",
      flac: "audio/flac",
      aac: "audio/aac",
      m4a: "audio/mp4",
  
      // Video
      mp4: "video/mp4",
      avi: "video/x-msvideo",
      mov: "video/quicktime",
      wmv: "video/x-ms-wmv",
      flv: "video/x-flv",
      webm: "video/webm",
      mkv: "video/x-matroska",
  
      // Archives & Compressed Files
      zip: "application/zip",
      rar: "application/x-rar-compressed",
      tar: "application/x-tar",
      gz: "application/gzip",
      "7z": "application/x-7z-compressed",
  
      // Executables & Binary
      exe: "application/vnd.microsoft.portable-executable",
      apk: "application/vnd.android.package-archive",
      iso: "application/x-iso9660-image",
      bin: "application/octet-stream",
      dmg: "application/x-apple-diskimage",
  
      // Fonts
      ttf: "font/ttf",
      otf: "font/otf",
      woff: "font/woff",
      woff2: "font/woff2",
    };
  
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext ? mimeTypes[ext] : undefined;
  }