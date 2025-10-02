import { useMemo } from "react";
import { createStaticEditor } from "platejs";
import { PlateStatic } from "platejs";
import { BaseEditorKit } from "@/components/editor/editor-base-kit";
import { MarkdownPlugin, remarkMdx, remarkMention } from "@platejs/markdown";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface SlateToHtmlBlockProps {
  content: string;
}

// Shared remark plugins configuration
const REMARK_PLUGINS = [
  remarkMath,
  remarkGfm,
  remarkMdx,
  remarkMention,
  remarkEmoji as any,
];

// Parse content once and memoize
const parseContent = (content: string) => {
  try {
    return JSON.parse(content);
  } catch (error) {
    // Content is markdown, will be deserialized later
    console.warn("Failed to parse content as JSON, treating as Markdown:");
    return null;
  }
};

export default function SlateToHtmlBlock({ content }: SlateToHtmlBlockProps) {
  // Memoize the editor creation to prevent unnecessary re-renders
  const editor = useMemo(() => {
    let value;
    
    // Try parsing as JSON first
    const parsedJson = parseContent(content);
    
    if (parsedJson) {
      value = parsedJson;
    } else {
      // Create a temporary editor only once for markdown deserialization
      const tempEditor = createStaticEditor({
        plugins: BaseEditorKit,
        value: [],
      });
      
      value = tempEditor.getApi(MarkdownPlugin).markdown.deserialize(content, {
        remarkPlugins: REMARK_PLUGINS,
      });
    }

    // Create and return the final static editor
    return createStaticEditor({
      plugins: BaseEditorKit,
      value: value,
    });
  }, [content]);

  return <PlateStatic editor={editor} />;
}