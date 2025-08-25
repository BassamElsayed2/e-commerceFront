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

  // تحديد الصورة بشكل آمن
let imageSrc = "/images/placeholder.png"; // الصورة الافتراضية

if (item.imgs && Array.isArray(item.imgs.thumbnails)) {
  const firstImg = item.imgs.thumbnails[0];
  if (firstImg && firstImg.trim() !== "") {
    imageSrc = firstImg;
  }
}

  return (
    <div className="flex items-center border-t border-gray-3 py-5 px-7.5">
      {/* المنتج */}
      <div className="min-w-[400px]">
        <div className="flex items-center justify-between gap-5">
          <div className="w-full flex items-center gap-5.5">
            {/* الصورة */}
            <div className="flex items-center justify-center rounded-[8px] bg-gray-2 max-w-[120px] w-full h-32 overflow-hidden">
            <Image
  width={140}
  height={140}
  src={imageSrc}
  alt={item.title || "Placeholder"}
  className="object-contain"
/>

            </div>

            {/* العنوان */}
            <div>
              <h3 className="text-[#0C2756] font-bold text-base transition-colors duration-200 hover:text-blue-600">
                <Link href={`/shop-details?id=${item.id}`}>
                  {item.title}
                </Link>
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* السعر */}
      <div className="min-w-[180px]">
        <p className="text-dark">${item.discountedPrice}</p>
      </div>

      {/* الكمية */}
      <div className="min-w-[275px]">
        <div className="w-max flex items-center rounded-md border border-gray-3">
          <button
            onClick={handleDecreaseQuantity}
            aria-label="button for remove product"
            className="flex items-center justify-center w-11.5 h-11.5 transition-colors duration-200 hover:text-blue"
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3.333 10c0-.46.373-.833.833-.833h11.667c.46 0 .833.373.833.833s-.373.833-.833.833H4.166A.833.833 0 0 1 3.333 10Z" />
            </svg>
          </button>

          <span className="flex items-center justify-center w-16 h-11.5 border-x border-gray-4">
            {quantity}
          </span>

          <button
            onClick={handleIncreaseQuantity}
            aria-label="button for add product"
            className="flex items-center justify-center w-11.5 h-11.5 transition-colors duration-200 hover:text-blue"
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 3.333c.46 0 .833.373.833.833v5h5a.833.833 0 1 1 0 1.667h-5v5a.833.833 0 1 1-1.667 0v-5h-5a.833.833 0 1 1 0-1.667h5v-5c0-.46.373-.833.834-.833Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* المجموع */}
      <div className="min-w-[200px]">
        <p className="text-dark">${item.discountedPrice * quantity}</p>
      </div>

      {/* زرار الحذف */}
      <div className="min-w-[50px] flex justify-end">
        <button
          onClick={handleRemoveFromCart}
          aria-label="button for remove product from cart"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark transition-colors duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <svg
            className="fill-current"
            width="22"
            height="22"
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
