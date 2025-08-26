"use client";
import React from "react";

const ShopDetailsSkeleton = () => (
  <div className="max-w-[1170px] mx-auto px-4 animate-pulse">
    <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
      {/* Skeleton for Image Gallery */}
      <div className="lg:max-w-[570px] w-full">
        <div className="bg-gray-300 h-[512px] rounded-xl"></div>
        <div className="flex gap-4.5 mt-6">
          <div className="bg-gray-300 w-20 h-20 rounded-lg"></div>
          <div className="bg-gray-300 w-20 h-20 rounded-lg"></div>
          <div className="bg-gray-300 w-20 h-20 rounded-lg"></div>
        </div>
      </div>

      {/* Skeleton for Product Details */}
      <div className="max-w-[539px] w-full">
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-6"></div>
        <div className="h-10 bg-gray-300 rounded w-1/2 mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  </div>
);

export default ShopDetailsSkeleton;
