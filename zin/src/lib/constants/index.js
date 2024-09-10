// @/zin-admin/lib/constants/index.js or index.ts
import { AmpersandIcon, DeleteIcon, List, Plus, User } from "lucide-react";
import { UpdateIcon } from "@radix-ui/react-icons";

export const productMenu = [
  {
    Icon: Plus,
    name: "Add Products",
    description: "Seed your ecommerce website",
    href: "/admin/addproducts",
    cta: "Go to",
    className: "md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-3",
  },
  {
    Icon: UpdateIcon,
    name: "Update Products",
    description: "Update existing product info",
    href: "/admin/updateproducts",
    cta: "Learn more",
    className: "md:col-start-1 md:col-end-3 md:row-start-3 md:row-end-4",
  },
  {
    Icon: List,
    name: "Products List",
    description: "Get a list of all your products",
    href: "/admin/productslist",
    cta: "Learn more",
    className: "md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-2",
  },
  {
    Icon: DeleteIcon,
    name: "Delete Products",
    description: "Delete your products",
    href: "/admin/deleteproducts",
    cta: "Learn more",
    className: "md:col-start-3 md:col-end-3 md:row-start-2 md:row-end-4",
  },
];

export const admindashboard = [
  {
    Icon: AmpersandIcon,
    name: "Admins",
    description: "Manage your Admin users",
    href: "/admin/admin-users",
    cta: "Go to",
    className: "md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-3",
  },
  {
    Icon: UpdateIcon,
    name: "Update Products",
    description: "Update existing product info",
    href: "/admin/updateproducts",
    cta: "Learn more",
    className: "md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4",
  },
  {
    Icon: List,
    name: "Products List",
    description: "Get a list of all your products",
    href: "/admin/productslist",
    cta: "Learn more",
    className: "md:col-start-2 md:col-end-3 md:row-start-3 md:row-end-4",
  },
  {
    Icon: Plus,
    name: "Add Products",
    description: "Seed your ecommerce website",
    href: "/admin/addproducts",
    cta: "Learn more",
    className: "md:col-start-3 md:col-end-3 md:row-start-2 md:row-end-4",
  },
  {
    Icon: User,
    name: "Customers",
    description: "Manage your store customers",
    href: "/admin/users",
    cta: "Go to",
    className: "md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-2",
  },
];

export const usersMenu = [
  {
    Icon: User,
    name: "Customers",
    description: "Manage your store customers",
    href: "/admin/users",
    cta: "Go to",
    className: "md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-3",
  },
  {
    Icon: AmpersandIcon,
    name: "Admins",
    description: "Manage your Admin users",
    href: "/admin/admin-users",
    cta: "Go to",
    className: "md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-3",
  },
];


export const categories = [
  { name: "All", value: ""},
  { name: "Electronics", value: "electronics" },
  { name: "Mens", value: "mens" },
  { name: "Womens", value: "womens" },
  { name: "Kids", value: "kids" },
  { name: "Footwear", value: "footwear" },
  { name: "Accessories", value: "accessories" },
];

export const sortOptions = [
  { name: "None", value: ""},
  { name: "Latest arrivals", value: "latest"},
  { name: "Price: Low to high", value: "low"},
  { name: "Price: High to low", value: "high"},
];
