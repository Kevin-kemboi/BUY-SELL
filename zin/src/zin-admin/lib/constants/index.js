// @/zin-admin/lib/constants/index.js or index.ts
import { DeleteIcon, List, Plus } from "lucide-react";
import { UpdateIcon } from "@radix-ui/react-icons";

export const features = [
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
    href: "/",
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
    href: "/",
    cta: "Learn more",
    className: "md:col-start-3 md:col-end-3 md:row-start-2 md:row-end-4",
  },
];
