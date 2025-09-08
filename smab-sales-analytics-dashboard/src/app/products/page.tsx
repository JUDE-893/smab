
import { SiteHeader } from "@/components/shadcnkit/site-header"
import { TooltipDoc } from "@/components/shadcnkit/TooltipDoc"
import { SalesAgentSharesChart } from '@/components/custom/productsMetrics/SalesAgentSharesChart';
import { TotalProductQuantityChart } from '@/components/custom/productsMetrics/TotalProductQuantityChart';
import { TotalProductQuantity_Chart } from '@/components/custom/productsMetrics/TotalProductQuantity_Chart';
import { TotalSalesChart } from '@/components/custom/productsMetrics/TotalSalesChart';
import { OrdersGoalChart } from '@/components/custom/productsMetrics/OrdersGoalChart';
import { SellGoalChart } from '@/components/custom/productsMetrics/SellGoalChart';
import { SalesOrdersDataTable } from '@/components/custom/productsMetrics/SalesOrdersDataTable';
import { DateFilter } from '@/components/shadcnkit/DateFilter';
import { AvgConvertionRateGoal } from '@/components/custom/productsMetrics/AvgConvertionRateGoal2';
import { IconChartBar } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { HeaderMetrics } from "@/components/custom/productsMetrics/HeaderMetrics";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const filterDocTltp = `Note: any search, sort or filter operation are only applyed on data within the selected date range`

export default function Page() {
  return (
      <>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <HeaderMetrics />

              <h1 className="text-5xl font-bold ml-8 mt-12 mb-4">Sales Analytics</h1>

              <div className="flex items-center justify-between px-4 w-full lg:px-6 @container/card">
                <DateFilter />
                <div className="flex items-center gap-2 mr-2">
                  <Button variant="outline" size="sm" >
                  <IconChartBar />
                  <span className="hidden lg:inline">Generate Report</span>
                  </Button>
                  <TooltipDoc text={filterDocTltp}/>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6">
                <TotalSalesChart />
                <TotalProductQuantityChart />
                <SalesAgentSharesChart />
                <TotalProductQuantity_Chart />
              </div>

              <h1 className="text-3xl font-bold ml-8 mt-7" id="sales-orders">Sales orders details</h1>
              <SalesOrdersDataTable />
            </div>
          </div>
        </div>
      </>
  )
}
