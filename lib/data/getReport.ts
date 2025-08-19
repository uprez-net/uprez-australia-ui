import { UserBackendSession } from "@/app/interface/interface";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getReport(generationId: string, documentId: string) {
  const clientSession = await fetch(`${BACKEND_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "admin",
      email: "admin@uprez.net",
      company_id: generationId,
      role: "org:admin",
    }),
  });

  if (!clientSession.ok) {
    throw new Error("Failed to create client session");
  }
  const sessionData: UserBackendSession = await clientSession.json();

  const res = await fetch(
    `${BACKEND_URL}/api/v1/report/${generationId}/${documentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.access_token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error fetching compliance report:", errorData);
    console.log("Error status:", res.status);
    // return null;
  }

  const { report }: { report: string } = await res.json();

  return report;
}
