
import { z } from "zod";
import { useSortable } from "@dnd-kit/sortable";
import { type ColumnDef } from "@tanstack/react-table";
import { roundToTwo } from '@/lib/utils'
import { exportArrayToExcel } from '@/services/exportDataServices/exportArrayToExcel'

import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    CheckCircle,
    Circle,
    CircleOff,
    HelpCircle,
    Timer,
    ArrowUpFromLine
  } from "lucide-react"
import {  IconTableImport, IconGripVertical
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"
import { ProductDetailsDrawer } from '@/components/custom/productsMetrics/ProductDetailsDrawer';
import { DataTableColumnHeader } from "@/components/shadcnkit/data-table-column-header"



// Table Columns
export const schema = z.object({
    id: z.string,
    barcode: z.number(),
    orderDate: z.string(),
    order_frequency: z.string(),
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
  // barcode
  {
    accessorKey: "barcode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference" />
    ),
    cell: ({ row }) => {
      if (row?.original?.barcode?.props) return row?.original?.barcode
      return (
        <>
          {row?.original?.barcode
            ? <ProductDetailsDrawer
                barcode={row?.original?.barcode}
                trigger={<p className="hover:underline">{row?.original?.barcode}</p>}
          />
          : "Unknown"
        }
        </>
      )
    },
    enableHiding: false,
  },
  // name
  {
    accessorKey: "name",
    header: ({ column }) => <div className="">Product Name</div>,
    cell: ({ row }) => (
      <p>
        {row.original.name}
      </p>
    ),
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
            { row.original.revenue ? `${roundToTwo(row.original.revenue)} MAD` : "Unknown" }
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
  // order_frequency
  {
    accessorKey: "order_frequency",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order Frequency - FMCG" />,
    cell: ({ row }) => (
      <p className='ml-20'>
        {row.original.order_frequency}
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
const agentsOptions = [
  {
    value: "Sales Agent1",
    label: "Sales Agent1",
    icon: HelpCircle,
  },
  {
    value: "Sales Agent2",
    label: "Sales Agent2",
    icon: Circle,
  },
  {
    value: "Sales Agent3",
    label: "Sales Agent3",
    icon: Timer,
  },
  {
    value: "Sales Agent4",
    label: "Sales Agent4",
    icon: CheckCircle,
  },
  {
    value: "Sales Agent5",
    label: "Sales Agent5",
    icon: CircleOff,
  },
];
const paymentOptions = [
  {
    label: "Virement",
    value: "Virement",
    icon: ArrowDown,
  },
  {
    label: "Cash",
    value: "Cash",
    icon: ArrowUp,
  },
  {
    label: "Other",
    value: "Other",
    icon: ArrowRight,
  }
];

export const tableFilterConfig = {
  search: {
    column: "barcode",
    label: " with order barcode"
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
    action: (data, timeRange) => exportArrayToExcel(data, timeRange, 'sales-products-data'),
    icon: IconTableImport,
  }
]}

// skeleton Row
export const skeletonRow = {
  barcode: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />,
  name: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />,
  quantity: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />,
  revenue: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />,
  order_frequency: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />
}
