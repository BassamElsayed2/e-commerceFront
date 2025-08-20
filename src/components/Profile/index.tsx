"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocale, useTranslations } from "next-intl";
import supabase from "@/services/supabase";
import toast from "react-hot-toast";

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  profile_image_url: string | null;
  preferred_language: string | null;
  created_at: string;
  updated_at: string;
}

interface OrderData {
  id: string;
  user_id: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  total_price: number;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const { user, requireAuth, signOut, loading } = useAuth();
  const locale = useLocale();
  const t = useTranslations("profile");
  const commonT = useTranslations("common");

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [ordersData, setOrdersData] = useState<OrderData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  });

  // Require authentication to access this page
  useEffect(() => {
    if (!loading && !user) {
      requireAuth();
    }
  }, [loading, user, requireAuth]);

  // Fetch profile data when user is authenticated
  useEffect(() => {
    if (user && !loading) {
      fetchProfileData();
      fetchOrdersData();
    }
  }, [user, loading]);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
        return;
      }

      setProfileData(data);
      setFormData({
        full_name: data.full_name || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        postal_code: data.postal_code || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    }
  };

  const fetchOrdersData = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders data");
        return;
      }

      setOrdersData(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders data");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone || null,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          country: formData.country || null,
          postal_code: formData.postal_code || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchProfileData(); // Refresh data
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "paid":
        return "text-blue-600 bg-blue-100";
      case "shipped":
        return "text-purple-600 bg-purple-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return t("pending");
      case "paid":
        return t("paid");
      case "shipped":
        return t("shipped");
      case "delivered":
        return t("delivered");
      case "cancelled":
        return t("cancelled");
      default:
        return status;
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will be redirected)
  if (!user) {
    return null;
  }

  return (
    <>
      <Breadcrumb title={t("profile")} pages={[t("profile")]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[800px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                {t("profile")}
              </h2>
              <p>{t("manageYourProfile")}</p>
            </div>

            <div className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-1 p-6 rounded-lg">
                <h3 className="font-medium text-dark mb-4 text-lg">
                  {t("basicInformation")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-4 mb-2">
                      {t("email")}
                    </label>
                    <p className="text-dark">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-4 mb-2">
                      {t("userID")}
                    </label>
                    <p className="text-dark text-sm">{user.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-4 mb-2">
                      {t("accountCreated")}
                    </label>
                    <p className="text-dark">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-4 mb-2">
                      {t("emailVerified")}
                    </label>
                    <p className="text-dark">
                      {user.email_confirmed_at ? t("yes") : t("no")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="bg-gray-1 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-dark text-lg">
                    {t("personalInformation")}
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {t("edit")}
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="full_name"
                          className="block text-sm font-medium text-dark-4 mb-2"
                        >
                          {t("fullName")} *
                        </label>
                        <input
                          type="text"
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-dark-4 mb-2"
                        >
                          {t("phone")}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-dark-4 mb-2"
                      >
                        {t("address")}
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-dark-4 mb-2"
                        >
                          {t("city")}
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-dark-4 mb-2"
                        >
                          {t("state")}
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-dark-4 mb-2"
                        >
                          {t("country")}
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="postal_code"
                          className="block text-sm font-medium text-dark-4 mb-2"
                        >
                          {t("postalCode")}
                        </label>
                        <input
                          type="text"
                          id="postal_code"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? t("saving") : t("saveChanges")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form data to original values
                          if (profileData) {
                            setFormData({
                              full_name: profileData.full_name || "",
                              phone: profileData.phone || "",
                              address: profileData.address || "",
                              city: profileData.city || "",
                              state: profileData.state || "",
                              country: profileData.country || "",
                              postal_code: profileData.postal_code || "",
                            });
                          }
                        }}
                        className="px-6 py-2 bg-gray-3 text-dark rounded-lg hover:bg-gray-4 transition-colors"
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-4 mb-2">
                          {t("fullName")}
                        </label>
                        <p className="text-dark">
                          {profileData?.full_name || t("notProvided")}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-4 mb-2">
                          {t("phone")}
                        </label>
                        <p className="text-dark">
                          {profileData?.phone || t("notProvided")}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-4 mb-2">
                        {t("address")}
                      </label>
                      <p className="text-dark">
                        {profileData?.address || t("notProvided")}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-4 mb-2">
                          {t("city")}
                        </label>
                        <p className="text-dark">
                          {profileData?.city || t("notProvided")}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-4 mb-2">
                          {t("state")}
                        </label>
                        <p className="text-dark">
                          {profileData?.state || t("notProvided")}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-4 mb-2">
                          {t("country")}
                        </label>
                        <p className="text-dark">
                          {profileData?.country || t("notProvided")}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-4 mb-2">
                          {t("postalCode")}
                        </label>
                        <p className="text-dark">
                          {profileData?.postal_code || t("notProvided")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Orders History */}
              <div className="bg-gray-1 p-6 rounded-lg">
                <h3 className="font-medium text-dark mb-4 text-lg">
                  {t("orderHistory")}
                </h3>

                {ordersData.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-dark-4">{t("noOrders")}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full bg-white border border-gray-3 rounded-lg">
                      <thead className="bg-gray-2">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-dark border-b border-gray-3">
                            {t("orderId")}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-dark border-b border-gray-3">
                            {t("status")}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-dark border-b border-gray-3">
                            {t("totalPrice")}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-dark border-b border-gray-3">
                            {t("orderDate")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersData.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-1">
                            <td className="px-4 py-3 text-sm text-dark border-b border-gray-3">
                              {order.id.slice(0, 8)}...
                            </td>
                            <td className="px-4 py-3 text-sm border-b border-gray-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusText(order.status)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-dark border-b border-gray-3">
                              {formatPrice(order.total_price)}
                            </td>
                            <td className="px-4 py-3 text-sm text-dark border-b border-gray-3">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Sign Out Button */}
              <div className="text-center pt-6 border-t border-gray-3">
                <button
                  onClick={handleSignOut}
                  className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t("signOut")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
