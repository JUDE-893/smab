import { Skeleton } from "@/components/ui/skeleton"

export function CardHeaderSkeleton() {

  return (
    <>
      <Skeleton key={"c-h-title"} className="@container/card h-[25px] w-45 rounded-xl" />
      <Skeleton key={'c-h-description'} className="@container/card h-[25px] w-64 rounded-xl" />
    </>
  )
}
