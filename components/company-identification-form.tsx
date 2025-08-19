"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { forwardRef, useImperativeHandle, useState } from "react"
import { Button } from "./ui/button"
import { Upload, X } from "lucide-react"

const companyFormSchema = z.object({
  legalName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  cin: z.string().regex(/^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/, {
    message: "Please enter a valid 21-character CIN.",
  }),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: "Please enter a valid 10-character PAN.",
  }),
  tan: z.string().regex(/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/, {
    message: "Please enter a valid 10-character TAN.",
  }),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/, {
    message: "Please enter a valid 15-character GSTIN.",
  }),
})

type CompanyFormValues = z.infer<typeof companyFormSchema>

// This can be used to pre-fill the form with existing data
const defaultValues: Partial<CompanyFormValues> = {
  legalName: "",
  cin: "",
  pan: "",
  tan: "",
  gstin: "",
}

export type CompanyIdentificationFormHandle = {
  submit: () => Promise<boolean>
}

const fieldLabels: Record<string, string> = {
  legalName: "Legal Company Name",
  cin: "CIN (Corporate Identification Number)",
  pan: "PAN (Permanent Account Number)",
  tan: "TAN (Tax Deduction Account Number)",
  gstin: "GSTIN (Goods and Services Tax Identification Number)",
}

export const CompanyIdentificationForm = forwardRef<CompanyIdentificationFormHandle, {
  onSubmitData?: (data: CompanyFormValues) => void
  data?: CompanyFormValues
}>(({ onSubmitData, data }, ref) => {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: data ?? defaultValues,
    mode: "onChange",
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useImperativeHandle(ref, () => ({
    async submit() {
      const isValid = await form.trigger()
      if (!isValid) return false
      const values = form.getValues()
      onSubmitData?.(values)
      return true
    },
  }))

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setLogoPreview(null)
  }

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
                          <p className="text-sm font-medium">Click to upload your organization logo</p>
                          <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (Max. 2MB)</p>
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

          {/* Regular fields */}
          {["legalName", "cin", "pan", "tan", "gstin"].map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName as keyof CompanyFormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fieldLabels[fieldName]}</FormLabel>
                  <FormControl>
                    <Input placeholder={`Enter your ${fieldLabels[fieldName]}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </form>
      </Form>
    </div>
  )
})

CompanyIdentificationForm.displayName = "CompanyIdentificationForm"