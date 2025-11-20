// app/products/condition/[condition]/page.tsx
import ConditionProducts from "./_components/CondProducts";
import { Metadata } from "next";

interface PageParams {
  condition: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { condition } = await params;
  const formatted = condition ? condition.replace(/-/g, " ") : "Products";
  const title = `${formatted.charAt(0).toUpperCase() + formatted.slice(1)} | G'Lore`;
  const description = `Browse our ${formatted} collection and find the best deals on G'Lore.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/products/${condition}`,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { condition } = await params;

  if (!condition) {
    return (
      <div className="max-w-6xl mx-auto p-4 text-center text-red-500">
        No condition specified.
      </div>
    );
  }

  return (
    <div className="lg:container mx-auto lg:p-4 p-1">
      <ConditionProducts />
    </div>
  );
}