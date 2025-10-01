"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "./ui/date-picker";

const companyFormSchema = z.object({
  legalName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  acn: z.string().regex(/^\d{9}$/, {
    message: "Please enter a valid 9-digit ACN.",
  }),
  abn: z.string().regex(/^\d{11}$/, {
    message: "Please enter a valid 11-digit ABN.",
  }),
  paygWithholding: z.boolean().default(false),
  gstRegistered: z.boolean().default(false),
  austracRegistered: z.boolean().default(false),
  gstEffectiveDate: z.string().optional(),
  asicRegistration: z.string().optional(),
  chessHin: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

const defaultValues: CompanyFormValues = {
  legalName: "",
  acn: "",
  abn: "",
  paygWithholding: false,
  gstRegistered: false,
  gstEffectiveDate: "",
  asicRegistration: "",
  austracRegistered: false,
  chessHin: "",
};

export type CompanyIdentificationFormHandle = {
  submit: () => Promise<boolean>;
};

const fieldLabels: Record<keyof CompanyFormValues, string> = {
  legalName: "Legal Company Name",
  acn: "ACN (Australian Company Number)",
  abn: "ABN (Australian Business Number)",
  paygWithholding: "PAYG Withholding Registration",
  gstRegistered: "GST Registration",
  gstEffectiveDate: "GST Registration Effective Date",
  asicRegistration: "ASIC Registration Details",
  austracRegistered: "AUSTRAC Registration",
  chessHin: "CHESS Holding Identification Number (HIN)",
};

export const CompanyIdentificationForm = forwardRef<
  CompanyIdentificationFormHandle,
  {
    onSubmitData?: (data: CompanyFormValues) => void;
    data?: CompanyFormValues;
  }
>(({ onSubmitData, data }, ref) => {
  const form = useForm({
    resolver: zodResolver(companyFormSchema),
    defaultValues: data ?? defaultValues,
    mode: "onChange",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    async submit() {
      const isValid = await form.trigger();
      if (!isValid) return false;
      const values = form.getValues();
      const submissionData: CompanyFormValues = {
        ...values,
        paygWithholding: values.paygWithholding ?? false,
        gstRegistered: values.gstRegistered ?? false,
        austracRegistered: values.austracRegistered ?? false,
      };
      onSubmitData?.(submissionData);
      return true;
    },
  }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setLogoPreview(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Company Identification</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please provide your company's core identification details.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {/* Logo Upload */}
          <FormField
            name="logo"
            render={() => (
              <FormItem className="space-y-3">
                <FormLabel>Organization Logo</FormLabel>
                <FormControl>
                  <div>
                    {!logoPreview ? (
                      <div className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="logo-upload"
                          onChange={handleImageUpload}
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm font-medium">
                            Click to upload your organization logo
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            SVG, PNG, JPG or GIF (Max. 2MB)
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="relative w-40 h-40 mx-auto">
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Organization logo preview"
                          className="w-full h-full object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload your organization's logo for identification purposes.
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Dynamic Fields */}
          {(
            [
              "legalName",
              "acn",
              "abn",
              "paygWithholding",
              "gstRegistered",
              "gstEffectiveDate",
              "asicRegistration",
              "austracRegistered",
              "chessHin",
            ] as (keyof CompanyFormValues)[]
          ).map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fieldLabels[fieldName]}</FormLabel>
                  <FormControl>
                    {["paygWithholding", "gstRegistered", "austracRegistered"].includes(
                      fieldName
                    ) ? (
                      <Checkbox
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 m-4"
                      />
                    ) : fieldName === "gstEffectiveDate" ? (
                      <DatePicker
                        value={field.value ? new Date(field.value as string) : undefined}
                        onChange={(date) => field.onChange(date?.toISOString() || '')}
                        placeholder="Select GST effective date"
                        error={form.formState.errors.gstEffectiveDate?.message}
                        disabled={{ after: new Date() }}
                      />
                    ) : (
                      <Input
                        placeholder={`Enter your ${fieldLabels[fieldName]}`}
                        {...field}
                        value={field.value as string}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </form>
      </Form>
    </div>
  );
});

CompanyIdentificationForm.displayName = "CompanyIdentificationForm";
