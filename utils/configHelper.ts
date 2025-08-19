// utils/gcpCredentials.ts
type GCPCredentials = {
  credentials: {
    client_email: string;
    private_key: string;
  };
  projectId: string;
};

export const getGCPCredentials = (): GCPCredentials | null => {
  const gcpJson = process.env.GCP_JSON;

  if (!gcpJson) {
    console.warn("⚠️ GCP_JSON environment variable is not set.");
    return null;
  }

  try {
    const parsed = JSON.parse(gcpJson);

    if (!parsed.client_email || !parsed.private_key || !parsed.project_id) {
      console.error("❌ Invalid GCP_JSON: missing required fields.");
      return null;
    }

    return {
      credentials: {
        client_email: parsed.client_email,
        private_key: parsed.private_key.replace(/\\n/g, "\n"), // fixes multiline private key issues
      },
      projectId: parsed.project_id,
    };
  } catch (error) {
    console.error("❌ Failed to parse GCP_JSON:", error);
    return null;
  }
};
