import ProductCard from "./ProductCard";

interface Props {
  products: any[];
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 px-4 sm:px-0">
      {products.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}
