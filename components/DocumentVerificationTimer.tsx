import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const MAX_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours in ms

function formatETA(msLeft: number): string {
  const totalSeconds = Math.max(Math.floor(msLeft / 1000), 0);
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

interface DocumentVerificationTimerProps {
  updatedAt: Date; // ISO timestamp
}

export function DocumentVerificationTimer({
  updatedAt,
}: DocumentVerificationTimerProps) {
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState("08:00:00");
  const [isDelayed, setIsDelayed] = useState(false); // new state

  useEffect(() => {
    const start = new Date(updatedAt).getTime();

    const update = () => {
      const now = Date.now();
      const elapsed = now - start;
      const percent = Math.min((elapsed / MAX_DURATION_MS) * 100, 100);
      const msLeft = Math.max(MAX_DURATION_MS - elapsed, 0);

      setProgress(percent);
      setEta(formatETA(msLeft));
      if (msLeft <= 0) {
        setIsDelayed(true);
      }
    };

    update(); // initial run

    const interval = setInterval(update, 1000); // update every second

    return () => clearInterval(interval);
  }, [updatedAt]);

  return (
    <div className="text-center py-8">
      <RefreshCw className="h-16 w-16 mx-auto mb-4 text-[#027055] animate-spin" />
      <h3 className="text-lg font-medium mb-2">Verifying Documents...</h3>
      <p className="text-muted-foreground mb-2">
        Please wait while we analyze your uploaded documents and check
        compliance requirements.
      </p>
      <Progress value={progress} className="w-full max-w-md mx-auto mb-2" />
      {isDelayed ? (
        <p className="text-sm text-yellow-600">
          Taking longer than expected. Will be completed soon...
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Estimated time remaining: <span className="font-medium">{eta}</span>
        </p>
      )}
    </div>
  );
}
