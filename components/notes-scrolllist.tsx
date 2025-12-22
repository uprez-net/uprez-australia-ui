import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ReportUserNotes } from "@prisma/client"
import { FileText, User, Clock, CheckCircle2 } from "lucide-react"

interface UserNotesListProps {
  notes: (ReportUserNotes & { userName: string })[]
}

export function UserNotesList({
  notes,
}: UserNotesListProps) {
  /* ---------------- Empty State ---------------- */
  if (!notes || notes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/20 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              No notes yet
            </p>
            <p className="text-xs text-muted-foreground">
              Add justification or context below. Notes will appear here
              in chronological order.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="space-y-2">
      <h5 className="text-sm font-medium text-gray-700">
        Previous Notes
      </h5>

      <ScrollArea className="h-48 rounded-lg border">
        <div className="space-y-4 p-4">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className="relative rounded-md border bg-background p-4 text-sm shadow-sm"
            >
              {/* Left accent bar */}
              <span className="absolute left-0 top-0 h-full w-1 rounded-l-md bg-muted" />

              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    {note.userName}
                  </div>

                  <div className="flex items-center gap-2">
                    {note.expertVerified && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-100 text-green-800 border border-green-200 flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        Expert Verified
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {note.content}
                </p>

                {/* Footer */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {(new Date(note.createdAt)).toLocaleString("en-AU", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
