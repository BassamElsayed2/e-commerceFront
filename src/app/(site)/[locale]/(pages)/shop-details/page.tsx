import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Details Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Details Page for NextCommerce Template",
  // other metadata
};

interface ShopDetailsPageProps {
  searchParams: { id?: string };
}

const ShopDetailsPage = ({ searchParams }: ShopDetailsPageProps) => {
  return (
    <main>
      <ShopDetails productId={searchParams.id} />
    </main>
  );
};

export default ShopDetailsPage;
