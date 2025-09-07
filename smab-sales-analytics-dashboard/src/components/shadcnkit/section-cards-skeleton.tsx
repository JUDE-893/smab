import { Skeleton } from "@/components/ui/skeleton"

type SectionCardsSkeletonProps = {
  ln?: number;
};

export function SectionCardsSkeleton({ ln = 4 }: { ln?: number }) {
  const indices = Array.from({ length: ln }).map((_, i) => i);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {indices.map((ind) => (
        <Skeleton key={ind} className="@container/card h-[145px] w-full rounded-xl" >
        </Skeleton>
      ))}
    </div>
  );
}
