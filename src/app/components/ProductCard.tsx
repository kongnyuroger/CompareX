import { useRouter } from "next/navigation";
import { getShopLogo } from "../utils/getShopLogo";

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
  const shopLogo = getShopLogo(source);

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 pt-12 flex flex-col items-center text-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-[280px] max-w-[380px] relative">
      {/* Fixed height image container */}
      <div className="w-full h-[200px] flex items-center justify-center mb-6 relative">
        <img
          src={imageUrl}
          width={140}
          height={140}
          alt={title}
          className="w-5/6 h-5/6 object-contain"
        />
      </div>
      {/* Shop logo */}
      {shopLogo && (
        <img
          src={shopLogo}
          alt={`${source} logo`}
          className="h-6 w-auto object-contain absolute top-7 right-0 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-1/2 shadow"
        />
      )}

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

      {/* Source - fixed height 
      <div className="h-[24px] flex items-center justify-center gap-3 mb-4">
        {source}
      </div> */}

      {/* Button - always at bottom */}
      <a
        href={productUrl}
        target="_blank"
        rel="noopener noreferrer"
        className=" bg-primary text-white font-medium  cursor-pointer px-6 h-12 rounded-xl flex items-center justify-center w-full hover:bg-primary-dark transition-colors"
      >
        View
      </a>
    </div>
  );
}
