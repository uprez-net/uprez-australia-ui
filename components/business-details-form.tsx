"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { forwardRef, useImperativeHandle } from "react"
import { DatePicker } from "./ui/date-picker"

const businessFormSchema = z.object({
  industrySector: z.string({
    required_error: "Please select an industry sector.",
  }),
  companyType: z.string({
    required_error: "Please select company type.",
  }),
  stateOfRegistration: z.string({
    required_error: "Please select a state of registration.",
  }),
  incorporationDate: z.string({
    required_error: "Please select the incorporation date.",
  })
})

type BusinessFormValues = z.infer<typeof businessFormSchema>

// This can be used to pre-fill the form with existing data
const defaultValues: Partial<BusinessFormValues> = {
  industrySector: "",
  companyType: "",
  stateOfRegistration: "",
  incorporationDate: "",
}

// Industry sectors relevant to Indian SMEs
export const industrySectors = [
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

export const companyTypes = [
  { value: "public", label: "Public Company" },
  { value: "proprietary", label: "Proprietary Limited Company" },
]

export const australianStates = [
  { value: "nsw", label: "New South Wales" },
  { value: "vic", label: "Victoria" },
  { value: "qld", label: "Queensland" },
  { value: "wa", label: "Western Australia" },
  { value: "sa", label: "South Australia" },
  { value: "tas", label: "Tasmania" },
  { value: "act", label: "Australian Capital Territory" },
  { value: "nt", label: "Northern Territory" },
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

          {/* Company Type */}
          <FormField
            control={form.control}
            name="companyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* State of Registration */}
          <FormField
            control={form.control}
            name="stateOfRegistration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State of Registration</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {australianStates.map((st) => (
                      <SelectItem key={st.value} value={st.value}>
                        {st.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Incorporation Date */}
          <FormField
            control={form.control}
            name="incorporationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Incorporation</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                    placeholder="Company Incorporation Date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
})

BusinessDetailsForm.displayName = "BusinessDetailsForm"