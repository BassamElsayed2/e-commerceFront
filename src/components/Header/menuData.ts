import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "menu.popular",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "menu.shop",
    newTab: false,
    path: "/shop-with-sidebar",
  },
  {
    id: 3,
    title: "menu.contact",
    newTab: false,
    path: "/contact",
  },
  {
    id: 6,
    title: "menu.pages",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 61,
        title: "menu.shopWithSidebar",
        newTab: false,
        path: "/shop-with-sidebar",
      },
      {
        id: 62,
        title: "menu.shopWithoutSidebar",
        newTab: false,
        path: "/shop-without-sidebar",
      },
      {
        id: 64,
        title: "menu.checkout",
        newTab: false,
        path: "/checkout",
      },
      {
        id: 65,
        title: "common.cart",
        newTab: false,
        path: "/cart",
      },
      {
        id: 66,
        title: "common.wishlist",
        newTab: false,
        path: "/wishlist",
      },
      {
        id: 67,
        title: "menu.signIn",
        newTab: false,
        path: "/signin",
      },
      {
        id: 68,
        title: "menu.signUp",
        newTab: false,
        path: "/signup",
      },
      {
        id: 69,
        title: "menu.myAccount",
        newTab: false,
        path: "/my-account",
      },
      {
        id: 70,
        title: "menu.contact",
        newTab: false,
        path: "/contact",
      },
      {
        id: 62,
        title: "menu.error",
        newTab: false,
        path: "/error",
      },
      {
        id: 63,
        title: "menu.mailSuccess",
        newTab: false,
        path: "/mail-success",
      },
    ],
  },
  {
    id: 7,
    title: "menu.blogs",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 71,
        title: "menu.blogGridWithSidebar",
        newTab: false,
        path: "/blogs/blog-grid-with-sidebar",
      },
      {
        id: 72,
        title: "menu.blogGrid",
        newTab: false,
        path: "/blogs/blog-grid",
      },
      {
        id: 73,
        title: "menu.blogDetailsWithSidebar",
        newTab: false,
        path: "/blogs/blog-details-with-sidebar",
      },
      {
        id: 74,
        title: "menu.blogDetails",
        newTab: false,
        path: "/blogs/blog-details",
      },
    ],
  },
];
