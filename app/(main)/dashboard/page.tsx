"use client";
import { resetDashboard, setDashboard } from "@/app/redux/dashboardSlice";
import { useAppDispatch } from "@/app/redux/use-dispatch";
import { ClientsDashboard } from "@/components/clients-dashboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { getPostLoginRedirectUrl } from "@/lib/utils";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { SWE, orgType } = useSelector((state: RootState) => state.dashboard);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await dispatch(setDashboard());

        if (res.meta.requestStatus === "rejected") {
          if (res.payload === "Organization not found") {
            return router.push("/organisation/create");
          }
          if (res.payload === "User not found") {
            return router.push("/sign-in");
          }
          throw new Error(
            (res.payload as string) || "Failed to fetch dashboard data"
          );
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(
            err.message || "An error occurred while fetching dashboard data"
          );
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
      dispatch(resetDashboard());
    };
  }, []);

  // Auto-redirect based on user type and company data
  // useEffect(() => {
  //   if (!isLoading && !error) {
  //     const redirectUrl = getPostLoginRedirectUrl(orgType, SWE);
  //     if (redirectUrl !== "/dashboard") {
  //       router.push(redirectUrl);
  //     }
  //   }
  // }, [isLoading, error, orgType, SWE, router]);

  if (error) {
    return (
      <main className="container mx-auto py-8 px-4 bg-red-100">
        <h1 className="text-red-600 text-xl font-bold">Error: {error}</h1>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="container mx-auto py-8 px-4 bg-slate-50">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </main>
    );
  }

  // This will only render for intermediaries or SME users without companies
  return (
    <main className="container mx-auto py-8 px-4 bg-slate-50">
      <ClientsDashboard />
    </main>
  );
}
