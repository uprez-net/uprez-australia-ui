"use client";

import { useAppDispatch } from "@/app/redux/use-dispatch";
import { useEffect } from "react";
import {
  clearClient,
  setClientData as fetchData,
  refreshToken,
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
  const { clientData, sessionToken } = useSelector(
    (state: RootState) => state.client
  );

  useEffect(() => {
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
      } catch (error) {
        console.error(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching client data"
        );
      }
    };

    fetchClientData();
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const reloadToken = async () => {
      try {
        if (!sessionToken) return;

        // Assuming the token expires in 15 minutes, refresh every 14 minutes
        interval = setInterval(async () => {
          console.log("Refreshing session token for client ID:", id);
          const response = await dispatch(refreshToken({ sessionToken }));

          if (response.meta.requestStatus === "rejected") {
            throw new Error(
              (response.payload as string) || "Failed to refresh session token"
            );
          }
        }, 30 * 60 * 1000); // 30 minutes
      } catch (error) {
        console.error(
          error instanceof Error
            ? error.message
            : "An error occurred while refreshing session token"
        );
      }
    };

    reloadToken();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionToken]);

  useEffect(() => {
    return () => {
      dispatch(clearClient());
    };
  }, []);

  return <>{children}</>;
}
