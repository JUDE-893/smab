
import { z } from "zod";
import { useSortable } from "@dnd-kit/sortable";
import { type ColumnDef } from "@tanstack/react-table";
import { roundToTwo, formatPrice } from '@/lib/utils'
import { exportArrayToExcel } from '@/services/exportDataServices/exportArrayToExcel'

import {
    ArrowUpFromLine
  } from "lucide-react"
import {  IconTableImport, IconGripVertical
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"
import { CustomerDetailsDrawer } from '@/components/custom/customersMetrics/CustomerDetailsDrawer';
import { DataTableColumnHeader } from "@/components/shadcnkit/data-table-column-header"


// Table Columns
export const schema = z.object({
    id: z.string,
    customer_name: z.number(),
    orderDate: z.string(),
    order_count: z.string(),
    quantity: z.string(),
    name: z.string(),
    revenue: z.string(),
    reviewer: z.string(),
  })
export const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: ({ column }) => null,
    cell: ({ row }) => <DragHandle id={+(row.index)} />,
  },
  // customer_name
  {
    accessorKey: "customer_name",
    header: ({ column }) => (
      <p>Customer Name </p>
    ),
    cell: ({ row }) => {
      if (row?.original?.customer_name?.props) return row?.original?.customer_name
      return (
        <>
          {row?.original?.customer_name
            ? <CustomerDetailsDrawer
                customerName={row?.original?.customer_name}
                trigger={<p className="hover:underline">{row?.original?.customer_name}</p>}
          />
          : "Unknown"
        }
        </>
      )
    },
    enableHiding: false,
  },
  // revenue
  {
    accessorKey: "revenue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total revenue" />
    ),
    cell: ({ row }) => {
      if(row.original.revenue?.props) return row.original.revenue;

      return (
         <div className="w-32">
          <p>
            { row.original.revenue ? <span>{formatPrice(roundToTwo(row.original.revenue))} <span className="text-xs">MAD</span></span> : "Unknown" }
          </p>
        </div>
      )
    },
  },
  // quantity
  {
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity Sold" />,
    cell: ({ row }) => (
      <>
      {row?.original?.quantity ? <Badge variant="outline" className="ml-7 text-chart-3 px-1.5">
      {row.original.quantity}
      </Badge>
      : "Unknown"}
      </>
    ),
  },
  // order_count
  {
    accessorKey: "order_count",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order Number" />,
    cell: ({ row }) => (
      <p className='ml-20'>
        {row.original.order_count}
      </p>
    ),
  },

]

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id
  })


  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

// Filter Configs

export const tableFilterConfig = {
  search: {
    column: "customer_name",
    label: " with order customer name"
  },
  facetedfilter : []
}

// Export Data Buttons Configs
export const exportDataConfig = {
  label: "Export As",
  icon: ArrowUpFromLine,
  config : [
  {
    label: "Export as Excel",
    action: (data, timeRange) => exportArrayToExcel(data, timeRange, 'customer-data'),
    icon: IconTableImport,
  }
]}

// skeleton Row
export const skeletonRow = {
  customer_name: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />,
  name: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />,
  quantity: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />,
  revenue: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />,
  order_count: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />
}
