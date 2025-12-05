"use client";

import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { createOrganizationAction } from "@/app/actions/organisationAction";
import { Organisation } from "@/app/interface/interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const IntermediaryType = {
  MerchantBanker: "MerchantBanker",
  CompanySecretary: "CompanySecretary",
  Auditor: "Auditor",
  Other: "Other",
} as const;
import { toast } from "sonner";

const formSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  type: z.nativeEnum(IntermediaryType, {
    errorMap: () => ({ message: "Please select a valid organization type." }),
  }),
});

interface IntermediaryFormProps {
  onComplete?: (intermediaryId?: string) => void;
}

export function IntermediaryForm({ onComplete }: IntermediaryFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, { logo: logoPreview });
    const orgData: Organisation = {
      organisationName: values.organizationName,
      orgType: "intermediary",
      organisationImage: "",
    };
    try {
      toast.loading("Creating organization...");
      const result = await createOrganizationAction(orgData, undefined, {
        userId: "",
        id: "",
        firmName: values.organizationName,
        type: values.type,
      });
      toast.dismiss();
      toast.success("Organization created successfully!");

      if (onComplete && result?.intermediaryId) {
        onComplete(result.intermediaryId);
      } else if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.dismiss();
      toast.error("Failed to create organization. Please try again.");
      return;
    }
  }

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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Intermediary Profile</CardTitle>
        <CardDescription>
          Please provide your organization details to complete your profile
          setup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your organization name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The official registered name of your organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                          <label
                            htmlFor="logo-upload"
                            className="cursor-pointer"
                          >
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
                    Upload your organization's logo for identification purposes
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={IntermediaryType.MerchantBanker}>
                          Merchant Banker
                        </SelectItem>
                        <SelectItem value={IntermediaryType.CompanySecretary}>
                          Company Secretary
                        </SelectItem>
                        <SelectItem value={IntermediaryType.Auditor}>
                          Auditor
                        </SelectItem>
                        <SelectItem value={IntermediaryType.Other}>
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the type of intermediary you represent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          className="w-full bg-[#027055] hover:bg-[#025a44]"
        >
          Complete Setup
        </Button>
      </CardFooter>
    </Card>
  );
}
