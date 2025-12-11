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
    <div className="bg-white shadow-sm rounded-2xl p-6 flex flex-col items-center text-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-[280px] max-w-[380px]">
      {/* Fixed height image container */}
      <div className="w-full h-[200px] flex items-center justify-center mb-6">
        <img
          src={imageUrl}
          width={180}
          height={180}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Fixed height title container */}
      <div className="h-[48px] flex items-center justify-center mb-2 w-full">
        <h3 className="font-medium text-primary-900 line-clamp-2 text-sm">
          {title}
        </h3>
      </div>

      {/* Price - fixed position */}
      <p className="text-3xl font-semibold mb-2">${price}</p>

      {/* Badge - fixed height */}
      <div className="h-[28px] flex items-center justify-center mb-4">
        <p className={`px-3 py-1 rounded-lg text-xs font-medium ${badgeColor}`}>
          {badge}
        </p>
      </div>

      {/* Source - fixed height */}
      <div className="h-[24px] flex items-center justify-center gap-3 mb-4">
        {source}
      </div>

      {/* Button - always at bottom */}
      <button
        type="button"
        onClick={() => {
          router.push(productUrl);
        }}
        className="btn-primary w-full mt-auto"
      >
        View
      </button>
    </div>
  );
}
