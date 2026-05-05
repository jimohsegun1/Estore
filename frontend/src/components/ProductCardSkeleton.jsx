import Skeleton from "./Skeleton";

const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] rounded-2xl overflow-hidden">
    <Skeleton className="w-full h-48 rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export default ProductCardSkeleton;
