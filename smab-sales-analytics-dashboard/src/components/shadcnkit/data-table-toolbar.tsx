"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
};

export function DataTableToolbar<TData>({
  table,
  filterConfig
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Search ${filterConfig?.search?.label}`}
          value={(table.getColumn(filterConfig?.search?.column)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterConfig?.search?.column)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {filterConfig?.facetedfilter && filterConfig?.facetedfilter?.map((flt) => {

          return (<>{table.getColumn(flt?.column) && (
          <DataTableFacetedFilter
            column={table.getColumn(flt?.column)}
            title={flt?.label}
            options={flt?.options}
          />
        )}</>)
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
    </div>
  )
}
