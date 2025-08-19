"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { forwardRef, useImperativeHandle } from "react"

const businessFormSchema = z.object({
  industrySector: z.string({
    required_error: "Please select an industry sector.",
  }),
  businessDescription: z
    .string()
    .max(1000, {
      message: "Business description cannot exceed 1000 characters.",
    })
    .optional(),
})

type BusinessFormValues = z.infer<typeof businessFormSchema>

// This can be used to pre-fill the form with existing data
const defaultValues: Partial<BusinessFormValues> = {
  industrySector: "",
  businessDescription: "",
}

// Industry sectors relevant to Indian SMEs
const industrySectors = [
  { value: "agriculture", label: "Agriculture & Allied Activities" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "automotive", label: "Automotive & Auto Components" },
  { value: "chemicals", label: "Chemicals & Petrochemicals" },
  { value: "construction", label: "Construction & Real Estate" },
  { value: "consumer_goods", label: "Consumer Goods & FMCG" },
  { value: "education", label: "Education & Training" },
  { value: "electronics", label: "Electronics & Semiconductors" },
  { value: "energy", label: "Energy & Power" },
  { value: "financial_services", label: "Financial Services" },
  { value: "food_processing", label: "Food Processing" },
  { value: "healthcare", label: "Healthcare & Pharmaceuticals" },
  { value: "hospitality", label: "Hospitality & Tourism" },
  { value: "information_technology", label: "Information Technology" },
  { value: "logistics", label: "Logistics & Transportation" },
  { value: "media", label: "Media & Entertainment" },
  { value: "mining", label: "Mining & Minerals" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "telecommunications", label: "Telecommunications" },
  { value: "textiles", label: "Textiles & Apparel" },
  { value: "other", label: "Other" },
]

export type BusinessDetailsFormHandle = {
  submit: () => Promise<boolean>
}

export const BusinessDetailsForm = forwardRef<BusinessDetailsFormHandle, {
  onSubmitData?: (data: BusinessFormValues) => void
  data?: BusinessFormValues
}>(({ onSubmitData, data }, ref) => {
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: data ?? defaultValues,
    mode: "onChange",
  })

  useImperativeHandle(ref, () => ({
    async submit() {
      const isValid = await form.trigger()
      if (!isValid) return false
      const values = form.getValues()
      onSubmitData?.(values)
      return true
    },
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Business Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please provide information about your company's business operations.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="industrySector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Industry Sector</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industrySectors.map((sector) => (
                      <SelectItem key={sector.value} value={sector.value}>
                        {sector.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the primary industry sector that best describes your company's main business activities.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brief Business Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a brief description of your company..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This description will help in preparing your company profile for the DRHP. Maximum 1000 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("businessDescription") && (
            <div className="text-xs text-muted-foreground text-right">
              {form.watch("businessDescription")?.length || 0}/1000 characters
            </div>
          )}
        </form>
      </Form>
    </div>
  )
})

BusinessDetailsForm.displayName = "BusinessDetailsForm"