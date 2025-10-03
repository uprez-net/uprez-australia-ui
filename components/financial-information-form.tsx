"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { forwardRef, useImperativeHandle } from "react";
import { getYear } from "date-fns";

const financialFormSchema = z.object({
  paidUpCapital: z.coerce
    .number({
      error: "Paid-up capital is required.",
      // invalid_type_error: "Paid-up capital must be a number.",
    })
    .min(1500000, {
      error:
        "Paid-up capital must be at least $1,500,000 for SME IPO eligibility in Australia.",
    })
    .max(500000000, {
      error: "Paid-up capital cannot exceed $500 million for SME category.",
    }),

  turnover: z.coerce
    .number({
      error: "Turnover is required.",
      // invalid_type_error: "Turnover must be a number.",
    })
    .min(0, { error: "Turnover cannot be negative." })
    .max(50000000, {
      error: "Turnover cannot exceed $50 million for SME IPO eligibility.",
    }),

  netWorth: z.coerce
    .number({
      error: "Net worth is required.",
      // invalid_type_error: "Net worth must be a number.",
    })
    .min(0, { error: "Net worth cannot be negative." }),

  last3YearsRevenue: z
    .array(
      z.object({
        year: z
          .number({ error: "Year is required." })
          .min(2000)
          .max(getYear(new Date())),
        revenue: z.coerce
          .number({ error: "Revenue is required." })
          .min(0),
      })
    )
    .length(3, { error: "You must provide exactly 3 years of revenue." }),

  yearsOperational: z.coerce
    .number({
      error: "Years operational is required.",
      // invalid_type_error: "Years operational must be a number.",
    })
    .min(1, { error: "Company must be operational for at least 1 year." })
    .max(200, { error: "Please enter a valid number of years." }),
});

type FinancialFormValues = z.infer<typeof financialFormSchema>;

// Define the input type explicitly to handle form inputs
type FinancialFormInput = {
  paidUpCapital: number;
  turnover: number;
  netWorth: number;
  last3YearsRevenue: { year: number; revenue: number }[];
  yearsOperational: number;
};

const defaultValues: Partial<FinancialFormInput> = {
  paidUpCapital: NaN,
  turnover: NaN,
  netWorth: NaN,
  yearsOperational: NaN,
  last3YearsRevenue: [
    { year: getYear(new Date()) - 2, revenue: NaN },
    { year: getYear(new Date()) - 1, revenue: NaN },
    { year: getYear(new Date()), revenue: NaN },
  ],
};

// Format numbers as Australian currency
const formatNumber = (value: string) => {
  const number = value.replace(/,/g, "");
  if (isNaN(Number(number))) return value;
  return Number(number).toLocaleString("en-AU");
};

export type FinancialInformationFormHandle = {
  submit: () => Promise<boolean>;
};

export const FinancialInformationForm = forwardRef<
  FinancialInformationFormHandle,
  {
    onSubmitData?: (data: FinancialFormValues) => void;
    data?: FinancialFormInput;
  }
>(({ data, onSubmitData }, ref) => {
  const form = useForm<FinancialFormInput>({
    resolver: zodResolver(financialFormSchema) as any,
    defaultValues: data ?? defaultValues,
    mode: "onChange",
  });

  useImperativeHandle(ref, () => ({
    async submit() {
      const isValid = await form.trigger();
      const errors = form.formState.errors;
      console.log("Financial Information Form Errors:", errors);
      if (!isValid) return false;
      const values = form.getValues();
      onSubmitData?.(values);
      return true;
    },
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Financial Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please provide your company's recent financial figures
          (self-declared).
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="paidUpCapital"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paid-up Capital ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 2000000" {...field} />
                </FormControl>
                <FormDescription>
                  The amount of capital that has been paid by shareholders.
                  Minimum $1,500,000 required for SME IPO.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="turnover"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turnover (Last Financial Year - $)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 10000000"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Total revenue generated by your company in the last completed
                  financial year. Must not exceed $50 million for SME
                  eligibility.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="netWorth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Net Worth (Latest Audited - $)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 4000000" {...field} />
                </FormControl>
                <FormDescription>
                  Company's net worth as per the latest audited financial
                  statements (Assets - Liabilities).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last3YearsRevenue"
            render={({ field }) => {
              const { fields } = useFieldArray({
                control: form.control,
                name: "last3YearsRevenue",
              });

              return (
                <div className="space-y-4">
                  <FormLabel>Last 3 Years Revenue</FormLabel>
                  {fields.map((item, index) => (
                    <FormItem
                      key={item.id}
                      className="grid grid-cols-2 gap-4 items-end"
                    >
                      {/* Year Input */}
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={`Year ${index + 1}`}
                          min={2000}
                          max={getYear(new Date())}
                          onChange={(e) => {
                            const formatted = formatNumber(e.target.value);
                            field.onChange(
                              field.value?.map((val, i) =>
                                i === index
                                  ? {
                                      ...val,
                                      year: Number(formatted.replace(/,/g, "")),
                                    }
                                  : val
                              )
                            );
                          }}
                          value={(field.value ?? [])[index]?.year ?? ""}
                        />
                      </FormControl>

                      {/* Revenue Input */}
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Revenue (AUD)"
                          min={0}
                          onChange={(e) => {
                            const formatted = formatNumber(e.target.value);
                            field.onChange(
                              field.value?.map((val, i) =>
                                i === index
                                  ? {
                                      ...val,
                                      revenue: Number(
                                        formatted.replace(/,/g, "")
                                      ),
                                    }
                                  : val
                              )
                            );
                          }}
                          value={(field.value ?? [])[index]?.revenue ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  ))}
                  {/* Display validation error for last3YearsRevenue */}
                  {form.formState.errors.last3YearsRevenue && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.last3YearsRevenue.message}
                    </p>
                  )}
                  <FormDescription>
                    Enter your revenue for the last 3 years. Most recent year
                    last.
                  </FormDescription>
                </div>
              );
            }}
          />

          <FormField
            control={form.control}
            name="yearsOperational"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years Operational</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 5"
                    min="1"
                    max="200"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Number of years your company has been in operation since
                  incorporation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {(() => {
            const paidUpCapital = Number(form.watch("paidUpCapital"));
            const turnover = Number(form.watch("turnover"));
            const netWorth = Number(form.watch("netWorth"));
            const yearsOperational = Number(form.watch("yearsOperational"));
            const last3YearsRevenue = form.watch("last3YearsRevenue");

            const hasAny =
              !isNaN(paidUpCapital) ||
              !isNaN(turnover) ||
              !isNaN(netWorth) ||
              !isNaN(yearsOperational) ||
              (Array.isArray(last3YearsRevenue) &&
                last3YearsRevenue.some((r) => r.year && r.revenue));

            if (!hasAny) return null;

            return (
              <div className="rounded-md border p-4 bg-muted/50">
                <h3 className="text-sm font-medium mb-2">
                  Summary (for verification)
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {!isNaN(paidUpCapital) && (
                    <p>
                      Paid-up Capital: ${paidUpCapital.toLocaleString("en-AU")}
                    </p>
                  )}
                  {!isNaN(turnover) && (
                    <p>Turnover: ${turnover.toLocaleString("en-AU")}</p>
                  )}
                  {!isNaN(netWorth) && (
                    <p>Net Worth: ${netWorth.toLocaleString("en-AU")}</p>
                  )}
                  {!isNaN(yearsOperational) && (
                    <p>Years Operational: {yearsOperational} years</p>
                  )}

                  {Array.isArray(last3YearsRevenue) &&
                    last3YearsRevenue.length > 0 && (
                      <div>
                        <p className="font-medium mt-2">
                          Last 3 Years Revenue:
                        </p>
                        <ul className="list-disc ml-5">
                          {last3YearsRevenue.map((r, idx) =>
                            isNaN(r.revenue) ? null : (
                              <li key={idx}>
                                {r.year}: $
                                {Number(r.revenue).toLocaleString("en-AU")}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            );
          })()}
        </form>
      </Form>
    </div>
  );
});

FinancialInformationForm.displayName = "FinancialInformationForm";