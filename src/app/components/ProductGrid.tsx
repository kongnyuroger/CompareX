import ProductCard from "./ProductCard";

interface Props {
  products: any[];
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className="flex flex-wrap gap-6 mt-3 px-4 sm:px-0 justify-center lg:justify-start">
      {products.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}
