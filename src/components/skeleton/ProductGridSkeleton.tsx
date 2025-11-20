import { Skeleton } from "@/components/ui/atoms/skeleton";

interface ProductGridSkeletonProps {
    count?: number;
}

const ProductGridSkeleton = ({ count = 8 }: ProductGridSkeletonProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-full" />
                </div>
            ))}
        </div>
    );
};

export default ProductGridSkeleton;