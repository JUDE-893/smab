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
    label: "Low",
    value: "Virement",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
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
