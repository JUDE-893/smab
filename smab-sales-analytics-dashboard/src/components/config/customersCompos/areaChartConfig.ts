import {
    ArrowUpFromLine
  } from "lucide-react"
import {  IconTableImport
} from "@tabler/icons-react"

import { exportDailySalesToExcel } from '@/services/exportDataServices/exportDailySalesToExcel'


// Export Data Buttons Configs
export const exportDataConfig = {
  label: "Export As",
  icon: ArrowUpFromLine,
  config : [
  {
    label: "Export as Excel",
    action: exportDailySalesToExcel,
    icon: IconTableImport,
  }
]}
