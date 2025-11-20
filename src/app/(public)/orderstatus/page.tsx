import { Suspense } from "react";
import { OrderStatus } from "./_component/orderStatus";
import { LoadingSpinner } from "@/components/ui/atoms/loading-spinner";


export default function OrderStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <LoadingSpinner size="lg" color="red" />
        </div>
      }
    >
      <OrderStatus />
    </Suspense>
  );
}
