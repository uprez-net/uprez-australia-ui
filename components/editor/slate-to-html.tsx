"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Plate, usePlateEditor, usePlateViewEditor } from "platejs/react"
import { Button } from "@/components/ui/button"

import { BaseEditorKit } from "./editor-base-kit"
import { Editor, EditorView } from "../ui/editor"
import { EditorKit } from "./editor-kit"

// Hook: Apply theme class to given HTML
function useThemedHtml(html: string, serverTheme?: string) {
  const { resolvedTheme } = useTheme()

  const getThemedHtml = React.useCallback(() => {
    if (typeof window === "undefined") return html

    // Only update if the client theme differs from server-rendered
    if (serverTheme === resolvedTheme) return html

    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const htmlElement = doc.documentElement

    if (resolvedTheme === "dark") {
      htmlElement.classList.add("dark")
    } else {
      htmlElement.classList.remove("dark")
    }

    return doc.documentElement.outerHTML
  }, [html, resolvedTheme, serverTheme])

  return { getThemedHtml }
}

// Export button: download editor HTML
export function ExportHtmlButton({
  className,
  html,
  serverTheme,
}: {
  html: string
  className?: string
  serverTheme?: string
}) {
  const { getThemedHtml } = useThemedHtml(html, serverTheme)
  const [url, setUrl] = React.useState<string>()

  React.useEffect(() => {
    const updatedHtml = getThemedHtml()
    const blob = new Blob([updatedHtml], { type: "text/html" })
    const blobUrl = URL.createObjectURL(blob)
    setUrl(blobUrl)

    return () => {
      URL.revokeObjectURL(blobUrl)
    }
  }, [getThemedHtml])

  return (
    <a
      className={className}
      download="export-plate.html"
      href={url}
      rel="noopener noreferrer"
      role="button"
    >
      <Button>Export HTML</Button>
    </a>
  )
}

// Iframe preview of themed HTML
export function HtmlIframe({
  html,
  serverTheme,
  ...props
}: {
  html: string
  serverTheme?: string
} & React.ComponentProps<"iframe">) {
  const { getThemedHtml } = useThemedHtml(html, serverTheme)
  const [content, setContent] = React.useState(html)

  React.useEffect(() => {
    setContent(getThemedHtml())
  }, [getThemedHtml])

  return <iframe title="Preview" srcDoc={content} {...props} />
}

// Read-only editor client
export function EditorClient({ value }: { value: unknown }) {
  const editor = usePlateEditor({
    override: {
      enabled: {
        "fixed-toolbar": false,
        "floating-toolbar": false,
      },
    },
    plugins: EditorKit,
    value: value as any,
  })

  return (
    <Plate readOnly editor={editor}>
      <Editor variant="none" />
    </Plate>
  )
}

// Read-only editor view client
export function EditorViewClient({ value }: { value: unknown }) {
  const editor = usePlateViewEditor({
    plugins: BaseEditorKit,
    value: value as any,
  })

  return <EditorView variant="none" editor={editor} />
}
