"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Plate, usePlateEditor } from "platejs/react";
import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { deserializeMd, MarkdownPlugin } from "@platejs/markdown";

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
  const [isLoading, setIsLoading] = useState(false);
  const [editorValue, setEditorValue] = useState<any[]>([]);

  // Initialize editor with content
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: editorValue,
  });

  // Convert markdown content to Plate.js value format
  const convertMarkdownToPlateValue = useCallback(
    (markdown: string) => {
      if (!markdown) return [{ type: "p", children: [{ text: "" }] }];

      // Convert markdown to HTML first, then to a basic Plate structure
      const value = deserializeMd(editor, markdown);
      return value;
    },
    [editor]
  );

  // Update editor value when content changes
  useEffect(() => {
    if (content && isOpen) {
      const plateValue = convertMarkdownToPlateValue(content);
      setEditorValue(plateValue);
      // Reset editor with new value
      editor.tf.setValue(plateValue);
    }
  }, [content, isOpen, convertMarkdownToPlateValue, editor]);

  // Convert Plate.js editor content back to markdown
  const convertPlateValueToMarkdown = useCallback(
    () => {
      // This is a simplified conversion - you'd want a proper Plate to HTML converter
      const md = editor.getApi(MarkdownPlugin).markdown.serialize();
      return md;
    },
    [editor]
  );

  const handleSave = useCallback(async () => {
    if (!editor) return;

    setIsLoading(true);

    try {
      // Get current editor value
      // const currentValue = editor.children;
      const markdown = convertPlateValueToMarkdown();

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      onSave(markdown);
    } catch (error) {
      console.error("Error saving content:", error);
    } finally {
      setIsLoading(false);
    }
  }, [editor, convertPlateValueToMarkdown, onSave]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="min-w-[1600px] max-h-[90vh]  py-6 flex flex-col overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto my-4">
          <Plate editor={editor}>
            <EditorContainer className="min-h-[800px] bg-white rounded-md border">
              <Editor placeholder="Start writing..." className="p-4" />
            </EditorContainer>
          </Plate>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Content is stored in Markdown format. Formatting is converted
            automatically.
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
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
