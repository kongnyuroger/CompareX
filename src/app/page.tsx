import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";

export default function Home() {
  return (
    <main>
      <Navbar />

      <section className="section container-x text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Find the Best Prices in Seconds
        </h1>
        <p className="mt-3 text-gray-600 text-lg max-w-xl mx-auto">
          CompareX scans top e-commerce stores to bring you the lowest prices.
        </p>

        <div className="mt-8 max-w-xl mx-auto"></div>
      </section>
      <section className="section ">
        <ProductCard />
      </section>
    </main>
  );
}
