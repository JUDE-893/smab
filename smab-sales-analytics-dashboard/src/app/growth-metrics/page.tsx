import { DataTable } from "@/components/shadcnkit/data-table"
import { SiteHeader } from "@/components/shadcnkit/site-header"
import { LeadSourceChart } from '@/components/custom/growthMetrics/LeadSourceChart';
import { NewClientsChart } from '@/components/custom/growthMetrics/NewClientsChart';
import { ConvertionOverviewChart } from '@/components/custom/growthMetrics/ConvertionOverviewChart';
import { NewLeadsChart } from '@/components/custom/growthMetrics/NewLeadsChart';
import { LeadsGoalChart } from '@/components/custom/growthMetrics/LeadsGoalChart';
import { ClientsGoalChart } from '@/components/custom/growthMetrics/ClientsGoalChart';
import { LeadsDataTable } from '@/components/custom/growthMetrics/LeadsDataTable';

import data from "../data.json"
import { HeaderMetrics } from "@/components/custom/growthMetrics/HeaderMetrics";


export default function Page() {
  return (
      <>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <HeaderMetrics />
              <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card
                grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs
                lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">            
               <LeadsGoalChart />
               <ClientsGoalChart />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6">
                <NewLeadsChart />
                <NewClientsChart />    
                <LeadSourceChart />
                <ConvertionOverviewChart />
              </div>
              <LeadsDataTable />
            </div>
          </div>
        </div>
      </>
  )
}
