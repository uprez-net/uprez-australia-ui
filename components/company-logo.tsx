import { getPublicUrl } from "@/lib/data/bucketAction";
import { Building2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function CompanyLogo({ filePath, height, width }: { filePath: string; height?: number; width?: number }) {
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPublicUrl() {
      try {
        const url = await getPublicUrl(filePath);
        setPublicUrl(url);
      } catch (error) {
        console.error("Error fetching public URL:", error);
        setError("Failed to load company logo.");
      }
    }
    fetchPublicUrl();
  }, [filePath]);

  if (!publicUrl && !error) {
    return <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />;
  }

  if (error && !publicUrl) {
    return (
      <div className="p-2 bg-blue-100 rounded-lg">
        <Building2 className="h-6 w-6 text-blue-600" />
      </div>
    );
  }

  return (
    <Image src={publicUrl!} alt="Company Logo" width={width ?? 30} height={height ?? 30} />
  );
}