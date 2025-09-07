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
import {  IconTableImport
} from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"

import { exportOrdersToExcel } from '@/services/exportDataServices/exportOrdersToExcel'


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
    column: "orderNumber",
    label: " with order number"
  },
  facetedfilter : [{
    column: "salesAgent",
    label: "Sales Agent",
    options: agentsOptions
  },
  {
    column: "paymentMethod",
    label: "Payment Method",
    options: paymentOptions
  }]
}

// Export Data Buttons Configs
export const exportDataConfig = {
  label: "Export As",
  icon: ArrowUpFromLine,
  config : [
  {
    label: "Export as Excel",
    action: exportOrdersToExcel,
    icon: IconTableImport,
  }
]}

// skeleton Row
export const skeletonRow = {
  paymentMethod: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />,
  prixttc: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />,
  customerName: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />,
  salesAgent: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />,
  orderDate: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />,
  orderNumber: <Skeleton className="@container/card h-[25px] w-45 rounded-xl" />
}
