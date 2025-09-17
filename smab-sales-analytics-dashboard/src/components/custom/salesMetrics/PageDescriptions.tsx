"use client"

import { useQueryParams } from "@/hooks/useQueryParams"
import { useTimeRange } from "@/hooks/useTimeRange"
import { format } from 'date-fns'

import favicon from '@/favicon.ico';

export const dynamic = 'force-dynamic';

export function PageDescriptions({pageTitle}) {

  const { generatePDFMode } = useQueryParams();
  const dates = useTimeRange().split(",");


  if (!generatePDFMode) return <></>

  return (
    <div className="flex items-center justify-between bg-orange-600 px-5 py-4 mb-10">
  {/* Left section */}
  <div className="flex items-center">
    <img
      src="/LOGO-SMAB-CROP-1white.png"
      width="150"
      className="bg-orange-600 p-3"
      alt="Logo"
    />
    <h1 className="border-l-4 border-white pl-5 text-white text-2xl font-bold">
      {pageTitle}
    </h1>
  </div>

  {/* Right section */}
  <p className="text-gray-300">
    From {format(dates[0], 'dd/MM/yyyy')} To {format(dates[1], 'dd/MM/yyyy')}
  </p>
</div>

  )
}
