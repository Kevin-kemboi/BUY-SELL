import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { features } from "@/zin-admin/lib/constants/index";
const Product = () => {
  
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
