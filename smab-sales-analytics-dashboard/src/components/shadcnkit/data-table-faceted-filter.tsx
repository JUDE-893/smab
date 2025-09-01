// import * as React from "react"
// import { Column } from "@tanstack/react-table"
// import { Check, PlusCircle } from "lucide-react"
//
// import { cn } from "@/lib/utils"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator,
// } from "@/components/ui/command"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { Separator } from "@/components/ui/separator"
//
// interface DataTableFacetedFilterProps<TData, TValue> {
//   column?: Column<TData, TValue>
//   title?: string
//   options: {
//     label: string
//     value: string
//     icon?: React.ComponentType<{ className?: string }>
//   }[]
// }
//
// export function DataTableFacetedFilter<TData, TValue>({
//   column,
//   title,
//   options,
// }: DataTableFacetedFilterProps<TData, TValue>) {
//   const facets = column?.getFacetedUniqueValues()
//   const selectedValues = new Set(column?.getFilterValue() as string[])
//   console.log('[F-OPTION]', options);
//
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button variant="outline" size="sm" className="h-8 border-dashed">
//           <PlusCircle />
//           {title}
//           {selectedValues?.size > 10 && (
//             <>
//               <Separator orientation="vertical" className="mx-2 h-4" />
//               <Badge
//                 variant="secondary"
//                 className="rounded-sm px-1 font-normal lg:hidden"
//               >
//                 {selectedValues.size}
//               </Badge>
//               <div className="hidden space-x-1 lg:flex">
//                 {selectedValues.size > 2 ? (
//                   <Badge
//                     variant="secondary"
//                     className="rounded-sm px-1 font-normal"
//                   >
//                     {selectedValues.size} selected
//                   </Badge>
//                 ) : (
//                   options
//                     .filter((option) => selectedValues.has(option.value))
//                     .map((option) => (
//                       <Badge
//                         variant="secondary"
//                         key={option.value}
//                         className="rounded-sm px-1 font-normal"
//                       >
//                         {option.label}
//                       </Badge>
//                     ))
//                 )}
//               </div>
//             </>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent>
//         <Command>
//           <CommandInput placeholder={title} />
//           <CommandList >
//             <CommandEmpty>No results found.</CommandEmpty>
//
//
//
//
//             <CommandGroup>
//               {options.map((option) => {
//                 console.log("----",option);
//                 const isSelected = selectedValues.has(option.value)
//                 return (
//                   <CommandItem
//                     key={option.value}
//                     onSelect={() => {
//                       if (isSelected) {
//                         selectedValues.delete(option.value)
//                       } else {
//                         selectedValues.add(option.value)
//                       }
//                       const filterValues = Array.from(selectedValues)
//                       column?.setFilterValue(
//                         filterValues.length ? filterValues : undefined
//                       )
//                     }}
//                   >
//                     <div
//                       className={cn(
//                         "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
//                         isSelected
//                           ? "bg-primary text-primary-foreground"
//                           : "opacity-50 [&_svg]:invisible"
//                       )}
//                     >
//                       <Check />
//                     </div>
//                     {option.icon && (
//                       <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
//                     )}
//                     <span>{option.label}</span>
//                     {facets?.get(option.value) && (
//                       <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
//                         {facets.get(option.value)}
//                       </span>
//                     )}
//                   </CommandItem>
//                 )
//               })}
//             </CommandGroup>
//
//
//
//
//
//
//             {selectedValues.size > 0 && (
//               <>
//                 <CommandSeparator />
//                 <CommandGroup>
//                   <CommandItem
//                     onSelect={() => column?.setFilterValue(undefined)}
//                     className="justify-center text-center"
//                   >
//                     Clear filters
//                   </CommandItem>
//                 </CommandGroup>
//               </>
//             )}
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   )
// }













// -----------------------------------------------------------------------------
// data-table-faceted-filter.tsx
import * as React from "react"
import { Column } from "@tanstack/react-table"
import { Check, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Portal } from "@radix-ui/react-portal"

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])
  const triggerRef = React.useRef(null);

  return (
    <Popover >
      <PopoverTrigger ref={triggerRef} asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
          role="combobox"
          
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  Array.from(selectedValues).map((value) => {
                    const option = options.find((o) => o.value === value)
                    return option ? (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ) : null
                  })
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 max-w-64"
        align="start"
        style={{
          zIndex: 9999,
          position: 'relative'
        }}
      >
        <Portal container={triggerRef.current}>
          <Command className="relative z-50 p-0 w-auto w-64">
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options?.map((option) => {
                  const isSelected = selectedValues.has(option.value)

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        const newSelectedValues = new Set(selectedValues)
                        if (isSelected) {
                          newSelectedValues.delete(option.value)
                        } else {
                          newSelectedValues.add(option.value)
                        }
                        const filterValues = Array.from(newSelectedValues)
                        column?.setFilterValue(
                          filterValues.length ? filterValues : undefined
                        )
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className={cn("h-4 w-4")} />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                      {facets?.get(option.value) && (
                        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                          {facets.get(option.value)}
                        </span>
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        column?.setFilterValue(undefined)
                        
                      }}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </Portal>
          
              
      </PopoverContent>
    </Popover>
  )
}
