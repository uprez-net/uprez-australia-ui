"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  error?: string; // <-- NEW
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Select date",
  className,
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label htmlFor="date-picker" className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker"
            className={cn(
              "w-64 justify-between font-normal",
              !value && "text-muted-foreground",
              error && "border-red-500 focus:ring-red-500"
            )}
          >
            {value ? format(value, "PPP") : placeholder}
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            className="rounded-md border shadow-sm py-6"
            captionLayout="dropdown"
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500 px-1">{error}</p>}
    </div>
  );
}
