// profile-form.tsx
"use client"

import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useSidebar } from "@/components/ui/sidebar"
import { useCustomMutation, useCustomQuery } from '@/hooks/useCustomQuery';
import { putAllMetricsPlans, getAllMetricsPlans } from '@/services/salesServices';

// Define the schema for metrics plans
const metricsPlanSchema = z.object({
  _id: z.string(),
  name: z.string(),
  day: z.number().min(0, "Value must be non-negative"),
  week: z.number().min(0, "Value must be non-negative"),
  month: z.number().min(0, "Value must be non-negative"),
  year: z.number().min(0, "Value must be non-negative"),
})

const profileFormSchema = z.object({
  plans: z.array(metricsPlanSchema)
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { setOpen } = useSidebar();
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Fetch metrics plans data
  const { data, isLoading, error: queryError, refetch } = useCustomQuery(
    ['all-metrics-plans'],
    async () => await getAllMetricsPlans()
  );

  // Mutation for updating metrics plans - with proper success/error handling
  const { isPending, mutate } = useCustomMutation(putAllMetricsPlans, {
    onSuccess: (response) => {
      console.log('Mutation success:', response);
      toast.success("Metrics plans updated successfully!");
      setSubmitError(null);
      // Refetch the data to ensure we have the latest values
      refetch();
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      const errorMessage = error?.message || 'Failed to update metrics plans';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    }
  });

  useEffect(() => {
    setOpen(false);
  }, [])

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      plans: []
    },
    mode: "onChange",
  })

  // Reset form when data is loaded
  useEffect(() => {
    if (data && Array.isArray(data)) {
      form.reset({
        plans: data.map(plan => ({
          ...plan,
          // Ensure all values are numbers
          day: Number(plan.day),
          week: Number(plan.week),
          month: Number(plan.month),
          year: Number(plan.year)
        }))
      });
    }
  }, [data, form])

  function onSubmit(formData: ProfileFormValues) {
    console.log('Submitting data:', formData.plans);
    setSubmitError(null); // Clear previous errors
    mutate(formData.plans);
  }

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading metrics plans...</div>;
  }

  if (queryError) {
    return <div className="text-red-500 p-4">Error loading metrics plans. Please try again.</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {form.watch("plans")?.map((plan, index) => (
          <div key={plan._id} className="p-6 border rounded-lg space-y-4 bg-card">
            <h4 className="font-medium text-lg capitalize">
              {plan.name.replace('_', ' ')} Settings
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`plans.${index}.day`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Target</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        value={field.value}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`plans.${index}.week`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Target</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        value={field.value}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`plans.${index}.month`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Target</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        value={field.value}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`plans.${index}.year`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yearly Target</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        value={field.value}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
        
        <div className="flex space-x-4">
          <Button 
            type="submit" 
            disabled={isPending}
            className="bg-primary text-primary-foreground"
          >
            {isPending ? "Updating..." : "Update Metrics Plans"}
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Reset Changes
          </Button>
        </div>
        
        {submitError && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md">
            {submitError}
          </div>
        )}
      </form>
    </Form>
  )
}