"use client";

import { useQueryParams } from "@/hooks/useQueryParams"
import { TooltipDoc } from "@/components/shadcnkit/TooltipDoc"
import { DateFilter } from '@/components/shadcnkit/DateFilter';
import { GenerateReportButton } from '@/components/shadcnkit/GenerateReportButton';

const filterDocTltp = `Note: any search, sort or filter operation are only applyed on data within the selected date range`

export const dynamic = 'force-dynamic'

export function PageToolBar({reportMetadate}) {

    const { generatePDFMode } = useQueryParams();

    if (generatePDFMode) return <></>

    return (
        <div className="flex items-center justify-between px-4 w-full lg:px-6 @container/card">
            <DateFilter />
            <div className="flex items-center gap-2 mr-2">
                <GenerateReportButton reportMetadate={reportMetadate} />
                <TooltipDoc text={filterDocTltp}/>
            </div>
        </div>
    )
}
