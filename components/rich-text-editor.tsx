"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Plate, usePlateEditor } from "platejs/react";
import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { deserializeMd, MarkdownPlugin } from "@platejs/markdown";
import { Value } from "platejs";

interface RichTextEditorProps {
  content: string;
  onSave: (content: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function RichTextEditor({
  content,
  onSave,
  onCancel,
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
      let value: Value;
      try {
        value = JSON.parse(content);
      } catch (error) {
        // If JSON parse fails, treat as Markdown and deserialize
        console.warn(
          "Failed to parse content as JSON, treating as Markdown:",
          error
        );
        value = deserializeMd(editor, markdown);
      }
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
  const convertPlateValueToMarkdown = useCallback(() => {
    // This is a simplified conversion - you'd want a proper Plate to HTML converter
    const md = editor.getApi(MarkdownPlugin).markdown.serialize();
    return md;
  }, [editor]);

  const handleSave = useCallback(async () => {
    if (!editor) return;

    setIsLoading(true);

    try {
      // Get current editor value
      // const markdown = convertPlateValueToMarkdown();
      const value = editor.children;
      console.log("Editor Value on Save:", value);
      const markdown = JSON.stringify(value);

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
    <div>
      <div className="w-auto max-h-[90vh]  py-6 flex flex-col overflow-auto">
        <div className="flex-1 overflow-auto mb-4">
          <Plate editor={editor}>
            <EditorContainer className="min-h-[450px] bg-white rounded-md border">
              <Editor placeholder="Start writing..." className="p-4" />
            </EditorContainer>
          </Plate>
        </div>

        <div className="flex items-center justify-between">
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
        </div>
      </div>
    </div>
  );
}
