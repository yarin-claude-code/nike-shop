interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps): JSX.Element {
  return <div className={`skeleton ${className}`} />;
}

export function ProductCardSkeleton(): JSX.Element {
  return (
    <div className="card animate-pulse">
      <div className="aspect-square skeleton rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <div className="h-3 skeleton w-1/3" />
        <div className="h-5 skeleton w-3/4" />
        <div className="h-5 skeleton w-1/4" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton(): JSX.Element {
  return (
    <div className="border border-primary-200 rounded-2xl animate-pulse">
      <div className="p-6 text-center">
        <div className="w-12 h-12 skeleton rounded-full mx-auto mb-4" />
        <div className="h-4 skeleton w-2/3 mx-auto" />
      </div>
    </div>
  );
}

export function BrandCardSkeleton(): JSX.Element {
  return (
    <div className="bg-white border border-primary-200 rounded-2xl animate-pulse">
      <div className="p-8 flex items-center justify-center min-h-[100px]">
        <div className="h-8 skeleton w-24" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }): JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryGridSkeleton({ count = 6 }: { count?: number }): JSX.Element {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[...Array(count)].map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BrandGridSkeleton({ count = 6 }: { count?: number }): JSX.Element {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[...Array(count)].map((_, i) => (
        <BrandCardSkeleton key={i} />
      ))}
    </div>
  );
}
