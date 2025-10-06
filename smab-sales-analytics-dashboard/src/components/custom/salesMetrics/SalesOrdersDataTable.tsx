"use client";

import { z } from "zod";
import { type ColumnDef } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { format } from "date-fns";

import { useIsMobile } from "@/hooks/use-mobile";
import { getAllOrders } from '@/services/salesServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";
import {
    ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import {
    IconGripVertical,
    IconCircleCheckFilled,
    IconLoader,
    IconDotsVertical,
    IconTrendingUp,
} from "@tabler/icons-react";

import { DataTable } from '@/components/shadcnkit/data-table'
import { tableFilterConfig, exportDataConfig, skeletonRow } from "@/components/config/salesCompos/dataTableConfig"
import { OrderDetailsDrawer } from '@/components/shadcnkit/order-details-drawer'
import { DataTableColumnHeader } from "@/components/shadcnkit/data-table-column-header"
import { CustomerDetailsDrawer } from '@/components/custom/customersMetrics/CustomerDetailsDrawer';
import { AgentDetailsDrawer } from '@/components/custom/salesMetrics/AgentDetailsDrawer';
import { formatPrice } from '@/lib/utils'


export const schema = z.object({
    id: z.string,
    orderNumber: z.number(),
    orderDate: z.string(),
    paymentMethod: z.string(),
    salesAgent: z.string(),
    customerName: z.string(),
    prixttc: z.string(),
    reviewer: z.string(),
  })

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

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={+(row.index)} />,
  },
  // order Number
  {
    accessorKey: "orderNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Number" />
    ),
    cell: ({ row }) => {

      return (
        <>
          {row?.original?.orderNumber
            ? <OrderDetailsDrawer
            order={row.original}
            trigger={<p className="hover:underline cursor-pointer">{row?.original?.orderNumber}</p>}
          />
          : "Unknown"
        }
        </>
      )
    },
    enableHiding: false,
  },
  // order Date
  {
    accessorKey: "orderDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Date" />
    ),
    cell: ({ row }) => {
      let OrderDate = row.original.orderDate;

      if(row.original.orderDate?.props) return OrderDate

      const date = new Date(OrderDate);

      return (
        <div className="w-32">
          <p>
            {date ?
            format(date, "HH:mm dd/M/yy")
            : "Unknown date"
          }
          </p>
        </div>
      )}
  },
  // salesAgent
  {
    accessorKey: "salesAgent",
    header: () => <div className="">Sales Agent</div>,
    cell: ({ row }) => (
      <>
      {row?.original?.salesAgent ? <AgentDetailsDrawer agentName={row?.original?.salesAgent} trigger={<Badge variant="outline" className="text-chart-3 px-1.5">
                                      {row.original.salesAgent}
                                      </Badge>}>
                                    </AgentDetailsDrawer>
                                  : "Unknown"}
      </>
    ),
  },
  // customerName
  {
    accessorKey: "customerName",
    header: () => <div className="">Customer Name</div>,
    cell: ({ row }) => {
      if (row.original.customerName?.props) return row.original.customerName
      return (
        <>
          {row.original.customerName
            ? <CustomerDetailsDrawer
                customerName={row.original.customerName}
                trigger={<p className="hover:underline">{row.original.customerName}</p>}
          />
          : "Unknown"
        }
        </>
      )
    }
  },
  // prixttc
  {
    accessorKey: "prixttc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      if(row.original.prixttc?.props) return row.original.prixttc;

      return (
         <div className="w-32">
          <p>
            {row.original.prixttc ? <span> {formatPrice(row.original.prixttc)} <span className='text-xs'>MAD</span> </span> : "Unknown"}
          </p>
        </div>
      )
    },
  },
  // paymentMethod
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => (
      <>
      {row?.original?.paymentMethod ? <Badge variant="outline" className="text-chart-1 px-1.5">
      {row.original.paymentMethod}
      </Badge>
      : "Unknown"}
      </>
    ),
  },

]

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]

const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--primary)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--primary)",
    },
  }

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={true} />
                  <XAxis
                    dataKey="month"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Header</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Table of Contents">
                      Table of Contents
                    </SelectItem>
                    <SelectItem value="Executive Summary">
                      Executive Summary
                    </SelectItem>
                    <SelectItem value="Technical Approach">
                      Technical Approach
                    </SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Capabilities">Capabilities</SelectItem>
                    <SelectItem value="Focus Documents">
                      Focus Documents
                    </SelectItem>
                    <SelectItem value="Narrative">Narrative</SelectItem>
                    <SelectItem value="Cover Page">Cover Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Target</Label>
                <Input id="target" defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Limit</Label>
                <Input id="limit" defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select defaultValue={item.reviewer}>
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                  <SelectItem value="Jamik Tashpulatov">
                    Jamik Tashpulatov
                  </SelectItem>
                  <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
 }


export function SalesOrdersDataTable() {

  const timeRange = useTimeRange();

  const { data:d, isLoading } = useCustomQuery(
    ['sales-orders',timeRange],
    async () => await getAllOrders(timeRange)
  );

  // if loading create 10 table records where each cell is a skeleoton
  let initialData = !(isLoading) ? d?.orders : Array.from({ length: 10 }, (_, i) => i).map((r) => skeletonRow )

    return (
        <DataTable
            initialData={initialData ?? []}
            columns={columns}
            tableFilterConfig={tableFilterConfig}
            exportDataConfig={exportDataConfig}
            key={isLoading ? "key" : initialData?.length}
            className='table-container'
        />
    )
}
