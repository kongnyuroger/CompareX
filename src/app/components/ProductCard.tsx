import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  title: string;
  price: number;
  badge: string;
  badgeColor: string;
  imageUrl: string;
  source: string;
  productUrl: string;
}

export default function ProductCard({
  title,
  price,
  badge,
  badgeColor,
  imageUrl,
  source,
  productUrl,
}: Props) {
  const router = useRouter();
  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 flex flex-col items-center text-center">
      <img
        src={imageUrl}
        width={180}
        height={180}
        alt={title}
        className="mx-auto w-[200px] h-[200px] object-contain"
      />

      <h3 className="mt-6 font-medium text-primary-900">{title}</h3>

      <p className="text-3xl font-semibold mt-2">${price}</p>

      <p
        className={`mt-2 px-3 py-1 rounded-lg text-xs font-medium inline-block ${badgeColor}`}
      >
        {badge}
      </p>

      <div className="flex items-center justify-center gap-3 mt-4">
        {source}
      </div>

      <button
        type="button"
        onClick={() => {
          router.push(productUrl);
        }}
        className="btn-primary w-full"
      >
        View
      </button>
    </div>
  );
}
