"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from 'sonner'

// Define the data structure based on your actual localStorage content
interface SectionItem {
  ref: string;
  active: boolean;
}

interface SectionsSetting {
  navMain: SectionItem[];
  navSecondary: SectionItem[];
  documents: SectionItem[];
  // navClouds is optional since it's not in your actual data
  navClouds?: SectionItem[];
}

const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

export function DisplayForm() {
  const [items, setItems] = useState<{ id: string; label: string; section: string }[]>([]);
  const [sectionsData, setSectionsData] = useState<SectionsSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create a flat array of all items for the form
  const getAllItems = (data: SectionsSetting) => {
    const items: { id: string; label: string; section: string }[] = [];

    // Add navMain items
    data.navMain.forEach((item, index) => {
      items.push({
        id: `navMain-${index}`,
        label: `Main: ${item.ref.replace('/', '').replace(/-/g, ' ')}`,
        section: 'navMain'
      });
    });

    // Add navSecondary items
    data.navSecondary.forEach((item, index) => {
      items.push({
        id: `navSecondary-${index}`,
        label: `Secondary: ${item.ref.replace('/', '').replace(/#/g, '').replace(/-/g, ' ')}`,
        section: 'navSecondary'
      });
    });

    // Add documents items
    data.documents.forEach((item, index) => {
      items.push({
        id: `documents-${index}`,
        label: `Documents: ${item.ref.replace('/', '').replace(/-/g, ' ')}`,
        section: 'documents'
      });
    });

    // Add navClouds items if they exist
    if (data.navClouds) {
      data.navClouds.forEach((item, index) => {
        items.push({
          id: `navClouds-${index}`,
          label: `Cloud Section ${index + 1}`,
          section: 'navClouds'
        });
      });
    }

    return items;
  };

  // Get default checked items based on active status
  const getDefaultValues = (data: SectionsSetting): Partial<DisplayFormValues> => {
    const activeItems: string[] = [];

    // Check navMain
    data.navMain.forEach((item, index) => {
      if (item.active) activeItems.push(`navMain-${index}`);
    });

    // Check navSecondary
    data.navSecondary.forEach((item, index) => {
      if (item.active) activeItems.push(`navSecondary-${index}`);
    });

    // Check documents
    data.documents.forEach((item, index) => {
      if (item.active) activeItems.push(`documents-${index}`);
    });

    // Check navClouds if they exist
    if (data.navClouds) {
      data.navClouds.forEach((item, index) => {
        if (item.active) activeItems.push(`navClouds-${index}`);
      });
    }

    return {
      items: activeItems
    };
  };

  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues: {
      items: []
    },
  })

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedData = localStorage.getItem("sectionsSetting");
        console.log("storedData", storedData);

        if (storedData) {
          const parsedData: SectionsSetting = JSON.parse(storedData);
          console.log("parsedData", parsedData);
          setSectionsData(parsedData);
          const formItems = getAllItems(parsedData);
          console.log("formItems", formItems);
          setItems(formItems);
          const defaultValues = getDefaultValues(parsedData);
          console.log("defaultValues", defaultValues);
          form.reset(defaultValues);
        } else {
          setSectionsData(null);
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        setSectionsData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [form]);

  function onSubmit(data: DisplayFormValues) {
    if (!sectionsData) return;

    try {
      // Update the sections data based on form submission
      const updatedSectionsData: SectionsSetting = { ...sectionsData };

      // Update navMain
      updatedSectionsData.navMain = updatedSectionsData.navMain.map((item, index) => ({
        ...item,
        active: data.items.includes(`navMain-${index}`)
      }));

      // Update navSecondary
      updatedSectionsData.navSecondary = updatedSectionsData.navSecondary.map((item, index) => ({
        ...item,
        active: data.items.includes(`navSecondary-${index}`)
      }));

      // Update documents
      updatedSectionsData.documents = updatedSectionsData.documents.map((item, index) => ({
        ...item,
        active: data.items.includes(`documents-${index}`)
      }));

      // Update navClouds if they exist
      if (updatedSectionsData.navClouds) {
        updatedSectionsData.navClouds = updatedSectionsData.navClouds.map((item, index) => ({
          ...item,
          active: data.items.includes(`navClouds-${index}`)
        }));
      }

      // Save to localStorage
      localStorage.setItem("sectionsSetting", JSON.stringify(updatedSectionsData));
      setSectionsData(updatedSectionsData);

      toast.success("Settings updated successfully! Your section preferences have been saved.");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      toast.error("Error updating settings. There was a problem saving your preferences.");
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!sectionsData) {
    return (
      <div className="p-4 text-center">
        <p>No sections settings found in localStorage.</p>
        <p className="text-sm text-muted-foreground">
          Please make sure the "sectionsSetting" key exists in localStorage with the correct format.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Navigation Sections</FormLabel>
                <FormDescription>
                  Select the sections you want to display in the navigation.
                </FormDescription>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update display</Button>
      </form>
    </Form>
  )
}
