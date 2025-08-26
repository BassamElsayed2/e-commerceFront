"use client";
import React, { useState } from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  removeItemFromCart,
  updateCartItemQuantity,
} from "@/redux/features/cart-slice";
import Image from "next/image";
import { Link } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";

const SingleItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const dispatch = useDispatch<AppDispatch>();
  const locale = useLocale();

  const handleRemoveFromCart = () => {
    dispatch(removeItemFromCart(item.id));
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
    dispatch(updateCartItemQuantity({ id: item.id, quantity: quantity + 1 }));
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      dispatch(updateCartItemQuantity({ id: item.id, quantity: quantity - 1 }));
    }
  };

  // صورة المنتج
  let imageSrc = "/images/placeholder.png";
  if (item.imgs && Array.isArray(item.imgs.thumbnails)) {
    const firstImg = item.imgs.thumbnails[0];
    if (firstImg && firstImg.trim() !== "") {
      imageSrc = firstImg;
    }
  }

  return (
    <div className="flex items-center border-t border-white/20 py-6 px-7.5 text-white bg-[#0C2756]/70 rounded-2xl mb-4 shadow-lg">
      {/* المنتج */}
      <div className="min-w-[320px] flex items-center gap-5">
        {/* الصورة */}
        <div className="flex items-center justify-center rounded-xl bg-[#0f2f66] max-w-[100px] w-full h-28 overflow-hidden shadow-md">
          <Image
            width={120}
            height={120}
            src={imageSrc}
            alt={item.title || "Placeholder"}
            className="object-contain"
          />
        </div>

        {/* العنوان */}
        <div>
          <h3 className="text-white font-bold text-base hover:text-[#239FBF] transition-colors">
            <Link href={`/shop-details?id=${item.id}`}>
              {item.title}
            </Link>
          </h3>
        </div>
      </div>

      {/* السعر */}
      <div className="min-w-[150px] text-center">
        <p className="text-[#239FBF] font-semibold">
          ${item.discountedPrice}
        </p>
      </div>

      {/* الكمية */}
      <div className="min-w-[220px] flex justify-center">
        <div className="flex items-center rounded-full border border-white/20 bg-[#0f2f66] overflow-hidden">
          <button
            onClick={handleDecreaseQuantity}
            aria-label="decrease product"
            className="w-10 h-10 flex items-center justify-center hover:bg-[#239FBF] hover:text-[#0C2756] transition rounded-full"
          >
            −
          </button>

          <span className="w-14 text-center font-bold">{quantity}</span>

          <button
            onClick={handleIncreaseQuantity}
            aria-label="increase product"
            className="w-10 h-10 flex items-center justify-center hover:bg-[#239FBF] hover:text-[#0C2756] transition rounded-full"
          >
          + 
          </button>
        </div>
      </div>

      {/* المجموع */}
      <div className="min-w-[160px] text-center">
        <p className="text-[#239FBF] font-semibold">
          ${item.discountedPrice * quantity}
        </p>
      </div>

      {/* زرار الحذف */}
      <div className="min-w-[60px] flex justify-end">
        <button
          onClick={handleRemoveFromCart}
          aria-label="remove product"
          className="flex items-center justify-center rounded-full w-10 h-10 bg-red-600/80 hover:bg-red-500 transition shadow-md"
        >
          <svg
            className="fill-white"
            width="18"
            height="18"
            viewBox="0 0 22 22"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.45 2.063h3.1c.199 0 .372 0 .535.026.645.103 1.203.505 1.505 1.084l.198.509c.16.444.576.744 1.048.756h2.75a.688.688 0 1 1 0 1.375H3.208a.688.688 0 1 1 0-1.375h2.75c.472-.012.888-.312 1.049-.756l.197-.509c.302-.579.86-.981 1.505-1.084.163-.026.336-.026.535-.026ZM5.423 7.746l.423 6.464c.079 1.176.142 2.125.29 2.87.155.775.418 1.422.96 1.93.543.507 1.206.726 1.99.829.753.099 1.705.099 2.883.099h.806c1.178 0 2.13 0 2.883-.099.784-.103 1.447-.322 1.99-.829.542-.508.805-1.155.96-1.93.148-.745.211-1.694.29-2.87l.424-6.463a.688.688 0 1 0-1.37-.095l-.422 6.324c-.082 1.236-.14 2.096-.269 2.743-.125.627-.3.959-.55 1.194-.25.234-.593.386-1.227.469-.654.086-1.516.087-2.754.087h-.71c-1.238 0-2.1-.001-2.754-.087-.634-.083-.977-.235-1.228-.469-.25-.235-.424-.567-.55-1.194-.128-.647-.186-1.507-.268-2.743l-.423-6.324a.688.688 0 0 0-1.37.095Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
