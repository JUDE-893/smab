"use client";

import { useQueryParams } from "@/hooks/useQueryParams"
import { TooltipDoc } from "@/components/shadcnkit/TooltipDoc"
import { DateFilter } from '@/components/shadcnkit/DateFilter';
import { IconChartBar } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

const filterDocTltp = `Note: any search, sort or filter operation are only applyed on data within the selected date range`


export function PageToolBar() {

    const { generatePDFMode } = useQueryParams();
  
    if (generatePDFMode) return <div className="h-4"></div>

    return (
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
    )
}