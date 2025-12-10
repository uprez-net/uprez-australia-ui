import { IndustrySectorValue, industrySubSectors } from "@/app/interface/interface";
import { useMemo, useState } from "react";
import { industrySectors } from "./business-details-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Building2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- STAGE 1 COMPONENT ---
interface StageOneProps {
  onNext: () => void;
  data: StageOneData;
  updateData: (field: string, value: string) => void;
  isLoading: boolean;
}

type StageOneData = {
  companyName: string;
  ticker: string;
  sector: string;
  subSector: string;
  shares: string;
};


export function StageOneCard({ onNext, data, updateData, isLoading }: StageOneProps) {
  // Local state only for errors, as data is now props
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const subSectors = useMemo(
    () =>
      isLoading
        ? []
        : industrySubSectors[data.sector as IndustrySectorValue] ?? [],
    [data.sector, isLoading]
  );

  const handleChange = (field: string, value: string) => {
    updateData(field, value); // Update parent state
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleContinue = () => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    if (!data.companyName.trim()) {
      newErrors.companyName = true;
      isValid = false;
    }
    if (!data.ticker.trim()) {
      newErrors.ticker = true;
      isValid = false;
    }
    if (!data.sector) {
      newErrors.sector = true;
      isValid = false;
    }
    if (!data.subSector) {
      newErrors.subSector = true;
      isValid = false;
    }
    if (!data.shares) {
      newErrors.shares = true;
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      onNext();
    }
  };

  return (
    <Card className="shadow-xl border-slate-200 bg-white mb-4">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <Building2 size={24} />
          </div>
          <CardTitle className="text-xl">Identity & Sector</CardTitle>
        </div>
        <CardDescription>
          Establish the peer set for Comparative Company Analysis (CCA).
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="companyName"
                className={errors.companyName ? "text-red-500" : ""}
              >
                Company Name
              </Label>
              <Input
                id="companyName"
                placeholder="e.g. Acme Corp"
                value={isLoading ? "Loading..." : data.companyName} // Controlled by Parent
                // onChange={(e) => handleChange("companyName", e.target.value)}
                disabled
                className={cn(
                  "transition-colors", // base styles (optional)
                  errors.companyName &&
                    "border-red-500 focus-visible:ring-red-500",
                  isLoading && "opacity-50 cursor-not-allowed bg-muted"
                )}
              />
              {errors.companyName && (
                <span className="text-xs text-red-500">Required</span>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="ticker"
                className={errors.shares ? "text-red-500" : ""}
              >
                Proposed Ticker
              </Label>
              {/* <div className="relative"> */}
              {/* <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">$</span> */}
              <Input
                id="ticker"
                className={cn(
                  "uppercase transition-colors",
                  errors.ticker && "border-red-500 focus-visible:ring-red-500",
                  isLoading && "opacity-50 cursor-not-allowed bg-muted"
                )}
                placeholder="ACME"
                maxLength={5}
                value={isLoading ? "Loading..." : data.ticker} // Controlled by Parent
                onChange={(e) => handleChange("ticker", e.target.value)}
              />
              {/* </div> */}
            </div>
          </div>

          {/* Sector Info */}
          <div className="space-y-4">
            {/* -------- Sector -------- */}
            <div className="space-y-2">
              <Label
                className={cn(
                  errors.sector && "text-red-500",
                  isLoading && "opacity-50"
                )}
              >
                Sector Selection
              </Label>

              <Select
                disabled
                onValueChange={(val) => handleChange("sector", val)}
                value={data.sector}
              >
                <SelectTrigger
                  className={cn(
                    errors.sector &&
                      "border-red-500 focus-visible:ring-red-500",
                    isLoading && "opacity-50 cursor-not-allowed bg-muted"
                  )}
                >
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>

                <SelectContent>
                  {industrySectors.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* -------- Sub Sector -------- */}
            <div className="space-y-2">
              <Label
                className={cn(
                  errors.subSector && "text-red-500",
                  isLoading && "opacity-50"
                )}
              >
                Industry Sub-sector
              </Label>

              <Select
                disabled={isLoading}
                onValueChange={(val) => handleChange("subSector", val)}
                value={data.subSector}
              >
                <SelectTrigger
                  className={cn(
                    errors.subSector &&
                      "border-red-500 focus-visible:ring-red-500",
                    isLoading && "opacity-50 cursor-not-allowed bg-muted"
                  )}
                >
                  <SelectValue placeholder="Select Sub-sector" />
                </SelectTrigger>

                <SelectContent>
                  {subSectors.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="space-y-2 max-w-md">
            <Label
              htmlFor="shares"
              className={errors.shares ? "text-red-500" : ""}
            >
              Current Capital Structure
            </Label>
            <div className="relative">
              <Input
                id="shares"
                type="number"
                placeholder="Total Shares on Issue (pre-IPO)"
                value={data.shares} // Controlled by Parent
                onChange={(e) => handleChange("shares", e.target.value)}
                className={
                  errors.shares
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs">
                Shares
              </span>
            </div>
            <p
              className={`text-[0.8rem] ${
                errors.shares ? "text-red-500" : "text-slate-500"
              }`}
            >
              {errors.shares
                ? "Please enter share count"
                : "Total authorized shares currently held by shareholders."}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-6 pb-6">
        {Object.keys(errors).length > 0 && (
          <div className="text-red-500 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            Please fill all fields
          </div>
        )}
        <div className="ml-auto">
          {" "}
          {/* Pushes button to right */}
          <Button
            onClick={handleContinue}
            className="w-full md:w-auto gap-2 bg-green-600 hover:bg-green-700"
          >
            Continue to Narrative <ArrowRight size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
