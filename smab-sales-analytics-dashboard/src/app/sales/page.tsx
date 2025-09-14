

import { SiteHeader } from "@/components/shadcnkit/site-header"
import { TooltipDoc } from "@/components/shadcnkit/TooltipDoc"
import { SalesAgentSharesChart } from '@/components/custom/salesMetrics/SalesAgentSharesChart';
import { TotalOrdersChart } from '@/components/custom/salesMetrics/TotalOrdersChart';
import { AgentOrdersSharesChart } from '@/components/custom/salesMetrics/AgentOrdersSharesChart';
import { TotalSalesChart } from '@/components/custom/salesMetrics/TotalSalesChart';
import { OrdersGoalChart } from '@/components/custom/salesMetrics/OrdersGoalChart';
import { SellGoalChart } from '@/components/custom/salesMetrics/SellGoalChart';
import { SalesOrdersDataTable } from '@/components/custom/salesMetrics/SalesOrdersDataTable';
import { DateFilter } from '@/components/shadcnkit/DateFilter';
import { AvgConvertionRateGoal } from '@/components/custom/salesMetrics/AvgConvertionRateGoal2';
import { PageDescriptions } from '@/components/custom/salesMetrics/PageDescriptions';
import { IconChartBar } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { HeaderMetrics } from "@/components/custom/salesMetrics/HeaderMetrics";
import { PageToolBar } from "@/components/shadcnkit/PageToolBar";


export const dynamic = 'force-dynamic';
export const revalidate = 0;

const filterDocTltp = `Note: any search, sort or filter operation are only applyed on data within the selected date range`

export default function Page() {


  return (
      <>
        <PageDescriptions />
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <HeaderMetrics />
              <h1 className="text-5xl font-bold ml-8 mt-12 mb-4">Sales Analytics</h1>
              <PageToolBar />

              <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow- lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 mb-6 mt-4">
               <OrdersGoalChart />
               <SellGoalChart />
               <AvgConvertionRateGoal />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6">
                <TotalSalesChart />
                <TotalOrdersChart />
                <SalesAgentSharesChart />
                <AgentOrdersSharesChart />
              </div>

              <h1 className="text-3xl font-bold ml-8 mt-7" id="sales-orders">Sales orders details</h1>
              <SalesOrdersDataTable />
            </div>
          </div>
        </div>
      </>
  )
}
