"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  CircleX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { EligibilityStatus } from "@prisma/client";
import { useAppDispatch } from "@/app/redux/use-dispatch";
import { toast } from "sonner";
import { deleteSMECompany } from "@/app/redux/dashboardSlice";

// Sample client data
const clients = [
  {
    id: "1",
    name: "Acme Technologies Ltd.",
    status: "Onboarding",
    complianceStatus: "high",
    lastActivity: "2023-05-20T14:30:00",
    industry: "Information Technology",
  },
  {
    id: "2",
    name: "Sunrise Manufacturing Co.",
    status: "In Progress",
    complianceStatus: "medium",
    lastActivity: "2023-05-18T09:15:00",
    industry: "Manufacturing",
  },
  {
    id: "3",
    name: "Green Energy Solutions",
    status: "DRHP Preparation",
    complianceStatus: "high",
    lastActivity: "2023-05-19T16:45:00",
    industry: "Energy",
  },
  {
    id: "4",
    name: "Healthwise Pharmaceuticals",
    status: "In Progress",
    complianceStatus: "low",
    lastActivity: "2023-05-15T11:20:00",
    industry: "Healthcare",
  },
  {
    id: "5",
    name: "Urban Retail Chains",
    status: "Onboarding",
    complianceStatus: "medium",
    lastActivity: "2023-05-17T13:10:00",
    industry: "Retail",
  },
  {
    id: "6",
    name: "Quantum Financial Services",
    status: "DRHP Filed",
    complianceStatus: "high",
    lastActivity: "2023-05-16T10:30:00",
    industry: "Financial Services",
  },
  {
    id: "7",
    name: "Oceanic Logistics Ltd.",
    status: "In Progress",
    complianceStatus: "medium",
    lastActivity: "2023-05-14T15:45:00",
    industry: "Logistics",
  },
];

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function ClientsDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { SWE } = useSelector((state: RootState) => state.dashboard);
  const dispatch = useAppDispatch();

  // Filter clients based on search query
  const filteredClients = useMemo(() => {
    return SWE.filter(
      (client) =>
        client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industrySector?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [SWE, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">IPO Assessment</h1>
        <Button
          className="bg-[#027055] hover:bg-[#025a44]"
          onClick={() => router.push("/onboarding/")}
        >
          <Plus className="mr-2 h-4 w-4" /> Start New Assessment
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <Button variant="ghost" className="p-0 font-medium">
                    Company Name <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Compliance Status</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium">
                    Last Activity <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No clients found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.companyName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          client.eligibilityStatus ===
                          EligibilityStatus.Mainboard_Eligible
                            ? "border-blue-500 text-blue-700 bg-blue-50"
                            : client.eligibilityStatus ===
                              EligibilityStatus.SME_Eligible
                            ? "border-purple-500 text-purple-700 bg-purple-50"
                            : client.eligibilityStatus ===
                              EligibilityStatus.Pending
                            ? "border-amber-500 text-amber-700 bg-amber-50"
                            : client.eligibilityStatus ===
                              EligibilityStatus.Not_Eligible
                            ? "border-red-500 text-red-700 bg-red-50"
                            : client.eligibilityStatus ===
                              EligibilityStatus.Failed
                            ? "border-red-500 text-red-700 bg-red-50"
                            : "border-gray-500 text-gray-700 bg-gray-50"
                        }
                      >
                        {client.eligibilityStatus.split("_").join(" ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div
                          className={`h-2.5 w-2.5 rounded-full mr-2 ${
                            client.complianceStatus === "high"
                              ? "bg-green-500"
                              : client.complianceStatus === "medium"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {client.complianceStatus === "high"
                            ? "Compliant"
                            : client.complianceStatus === "medium"
                            ? "Partial"
                            : client.complianceStatus === "failed"
                            ? "Check Failed"
                            : "Attention Required"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(client.updatedAt.toISOString())}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-[#027055] hover:bg-[#025a44]"
                          onClick={() =>
                            router.push(`/dashboard/client/${client.id}`)
                          }
                        >
                          View Workspace
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/dashboard/client/${client.id}`)
                              }
                            >
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/onboarding?id=${client.id}`)
                              }
                            >
                              Edit client
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/client/${client.id}/upload`
                                )
                              }
                            >
                              View documents
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={async () => {
                                try {
                                  toast.loading("Deleting client...");
                                  const res = await dispatch(
                                    deleteSMECompany({ id: client.id })
                                  );
                                  if (res.meta.requestStatus === "rejected") {
                                    throw new Error(
                                      (res.payload as string) ||
                                        "Failed to delete client"
                                    );
                                  }
                                  toast.dismiss();
                                  toast.success("Client deleted successfully", {
                                    icon: (
                                      <CheckCircle className="notification-icon" />
                                    ),
                                  });
                                } catch (error) {
                                  toast.dismiss();
                                  toast.error(
                                    error instanceof Error
                                      ? error.message
                                      : "Failed to delete client",
                                    {
                                      icon: (
                                        <CircleX className="notification-icon" />
                                      ),
                                    }
                                  );
                                  console.error(
                                    "Error deleting client:",
                                    error
                                  );
                                }
                              }}
                            >
                              Remove client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
