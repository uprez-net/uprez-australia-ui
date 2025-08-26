'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

export default function HomePage() {
  const { clientData, isLoading } = useSelector((state: RootState) => state.client);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">
          Valuation Insight Module
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Let's generate an indicative IPO valuation for your business.
        </p>
      </header>

      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-xl">
            Do you have a draft or final Prospectus document to analyze?
          </CardTitle>
          <CardDescription>
            This will determine the workflow. Providing a prospectus is the
            fastest path, but not required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              asChild
              className="w-full md:w-auto bg-green-600 hover:bg-green-700"
            >
              <Link
                href={`/dashboard/client/${encodeURIComponent(
                  clientData!.id
                )}/valuation/with-prospectus`}
              >
                Yes, I have a Prospectus
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="w-full md:w-auto bg-gray-700 hover:bg-gray-800 text-white"
            >
              <Link
                href={`/dashboard/client/${encodeURIComponent(
                  clientData!.id
                )}/valuation/without-prospectus`}
              >
                No, not yet
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
