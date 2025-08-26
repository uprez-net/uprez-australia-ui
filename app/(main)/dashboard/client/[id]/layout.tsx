"use client";

import { useAppDispatch } from "@/app/redux/use-dispatch";
import { useEffect } from "react";
import {
  clearClient,
  setClientData as fetchData,
} from "@/app/redux/clientSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useParams } from "next/navigation";
// import { SMECompany } from "@prisma/client";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  // const { id } = use(params);
  const params = useParams();
  const id = params.id as string;
  const { clientData } = useSelector((state: RootState) => state.client);

  useEffect(() => {
    let isMounted = true;

    const fetchClientData = async () => {
      try {
        console.log("Fetching client data for ID:", id);
        if (id === clientData?.id) {
          return; // If the client data is already loaded, skip fetching
        }
        const response = await dispatch(fetchData(id));

        if (response.meta.requestStatus === "rejected") {
          throw new Error(
            (response.payload as string) || "Failed to fetch client data"
          );
        }

        if (isMounted) {
          //   const { Documents, sessionToken, ...rest } =
          //     response.payload as unknown as SMECompany & {
          //       Documents: Document[];
          //     } & { sessionToken?: string };
          //   setClientData(rest);
          //   const progress = getDocumentUploadProgress(Documents);
          //   setDocumentProgress(progress);
          //   setOverallProgress(progress.find((p) => p.category === "Overall")!);
          //   setIsLoading(false);
        }
      } catch (error) {
        // if (isMounted) {
        //   setError(
        //     error instanceof Error
        //       ? error.message
        //       : "An error occurred while fetching client data"
        //   );
        //   setIsLoading(false);
        // }
      }
    };

    fetchClientData();

    return () => {
      isMounted = false;
      // Only clear if navigating to a different client ID
      if (clientData?.id && clientData.id !== id) {
        dispatch(clearClient());
      }
    };
  }, [id]);

  return <>{children}</>;
}
