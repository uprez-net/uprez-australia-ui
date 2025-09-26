"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FileText, Table, BarChart2, List } from "lucide-react"
import { useState } from "react"

interface AddSubsectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: { title: string; type: string }) => void
  sectionName: string
}

export function AddSubsectionModal({ isOpen, onClose, onConfirm, sectionName }: AddSubsectionModalProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState<"text" | "table" | "chart" | "list">("text")

  const handleSubmit = () => {
    if (!title.trim()) return
    onConfirm({ title, type })
    setTitle("")
    setType("text")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Add New Subsection</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add to <span className="font-semibold">{sectionName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="subsection-title">Subsection Title</Label>
            <Input
              id="subsection-title"
              placeholder="e.g., Market Analysis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-type">Content Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as "text" | "table" | "chart" | "list")}>
              <SelectTrigger id="content-type">
                <SelectValue placeholder="Choose content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Text Content
                  </div>
                </SelectItem>
                <SelectItem value="table">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    Data Table
                  </div>
                </SelectItem>
                <SelectItem value="chart">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    Chart / Graph
                  </div>
                </SelectItem>
                <SelectItem value="list">
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    Bullet Points
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit}>
            Add Subsection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
