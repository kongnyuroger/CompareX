import Image from "next/image";

interface Props {
  name: string;
  price: number;
  tag: string;
  tagColor: string;
  image: string;
  stores: string[];
}

export default function ProductCard({
  name,
  price,
  tag,
  tagColor,
  image,
  stores,
}: Props) {
  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 flex flex-col items-center text-center">
      <Image
        src={image}
        width={180}
        height={180}
        alt={name}
        className="mx-auto"
      />

      <h3 className="mt-6 font-medium text-primary-900">{name}</h3>

      <p className="text-3xl font-semibold mt-2">${price}</p>

      <p
        className={`mt-2 px-3 py-1 rounded-lg text-xs font-medium inline-block ${tagColor}`}
      >
        {tag}
      </p>

      <div className="flex items-center justify-center gap-3 mt-4">
        {stores.map((s) => (
          <span key={s} className="text-gray-700 text-sm capitalize">
            {s}
          </span>
        ))}
      </div>

      <button type="button" className="btn-primary">
        Compare Prices
      </button>
    </div>
  );
}
