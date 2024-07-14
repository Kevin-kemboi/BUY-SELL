
import {
  UpdateIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { DeleteIcon, List, Plus } from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";


const Product = () => {
  const features = [
    {
      Icon: Plus,
      name: "Add Products",
      description: "Seed your ecommerce website",
      href: "/",
      cta: "Go to",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-3",
    },
    {
      Icon: UpdateIcon,
      name: "Update Products",
      description: "Update existing product info",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "md:col-start-1 md:col-end-3 md:row-start-3 md:row-end-4",
    },
    {
      Icon: List,
      name: "Products List",
      description: "Get a list of al your products",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-2",
    },
    {
      Icon: DeleteIcon,
      name: "Delete Products",
      description:
        "Delete your products",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "md:col-start-3 md:col-end-3 md:row-start-2 md:row-end-4",
    },
  ];
  return (
    <>
      <div className=" absolute inset-0 flex p-5 gap-2 max-sm:p-2">
        <BentoGrid className="md:grid-rows-3  grid-rows-4 ">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </>
  );
};

export default Product;
