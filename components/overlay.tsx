import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface OverlayProps {
  isVisible: boolean
  onCancel: () => void
  onDismiss: () => void
}

export function Overlay({ isVisible, onCancel, onDismiss }: OverlayProps) {
  if (!isVisible) return null

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Generate New Report?</CardTitle>
          <CardDescription>
            A report has already been generated. To continue, you'll need to start a new report generation. 
            This will replace your existing data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Keep Existing Report
          </Button>
          <Button onClick={onDismiss} className="flex-1">
            Generate New Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
