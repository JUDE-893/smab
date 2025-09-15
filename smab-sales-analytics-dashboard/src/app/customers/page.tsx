
import { SiteHeader } from "@/components/shadcnkit/site-header"
import { TopTenCustomerRevenue } from '@/components/custom/customersMetrics/TopTenCustomerRevenue';
import { TotalCustomerRevenueAndQantittyChart } from '@/components/custom/customersMetrics/TotalCustomerRevenueAndQantittyChart';
import { TotalCustomerOrdersChart } from '@/components/custom/customersMetrics/TotalCustomerOrdersChart';
import { CustomersDataTable } from '@/components/custom/customersMetrics/CustomersDataTable';
import { HeaderMetrics } from "@/components/custom/customersMetrics/HeaderMetrics";
import { PageToolBar } from "@/components/shadcnkit/PageToolBar";
import { PageDescriptions } from '@/components/custom/salesMetrics/PageDescriptions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default function Page() {
  return (
      <>
        <PageDescriptions pageTitle='Sales Products Analytics Report' />
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <HeaderMetrics />

              <h1 className="text-5xl font-bold ml-8 mt-12 mb-4">Sales Analytics</h1>

                <PageToolBar />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6">
              <div className="lg:col-span-2">
                <TotalCustomerRevenueAndQantittyChart />
              </div>
                <TopTenCustomerRevenue />
                <TotalCustomerOrdersChart />
              </div>

              <h1 className="text-3xl font-bold ml-8 mt-7" id="sales-orders">Sales orders details</h1>
              <CustomersDataTable />
            </div>
          </div>
        </div>
      </>
  )
}
