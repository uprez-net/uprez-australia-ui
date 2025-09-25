"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "quill/dist/quill.snow.css";
import { marked } from "marked";
import TurndownService from "turndown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, X } from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onSave: (content: string) => void;
  onCancel: () => void;
  title: string;
  isOpen: boolean;
}

export function RichTextEditor({
  content,
  onSave,
  onCancel,
  title,
  isOpen,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const turndown = useRef(new TurndownService()).current;

  // Initialize Quill (client-only)
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const QuillModule = (await import("quill")).default;
      if (cancelled || !editorRef.current) return;

      quillRef.current = new QuillModule(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            [{ color: [] }, { background: [] }],
            ["blockquote", "code-block", "link"],
            ["clean"],
          ],
        },
      });
      setIsReady(true); // ✅ mark editor ready
    };

    init();
    return () => {
      cancelled = true;
      quillRef.current = null;
    };
  }, []);

  // Load content once Quill is ready
  useEffect(() => {
    if (isReady && quillRef.current && content) {
      console.log("Loading content into editor:", content);
      const html = marked(content || "");
      quillRef.current.clipboard.dangerouslyPasteHTML(html as string);
    }
  }, [isReady, content]);

  const handleSave = useCallback(async () => {
    if (!quillRef.current) return;
    setIsLoading(true);
    const html = quillRef.current.root.innerHTML;
    const markdown = turndown.turndown(html);
    await new Promise((res) => setTimeout(res, 500));
    onSave(markdown);
    setIsLoading(false);
  }, [onSave, turndown]);

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Edit Section</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div ref={editorRef} className="h-[400px] bg-white rounded-md" />
        </div>

        <DialogFooter className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Content is stored in Markdown format. Formatting is converted
            automatically.
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
