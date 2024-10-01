import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {  variants } from "@/lib/constants";

const Configs = () => {
  return (
    <>
      <div className=" absolute inset-0 flex p-5 gap-2 max-sm:p-2">
        <BentoGrid className="md:grid-rows-3  grid-rows-4 ">
          {variants.map((feature) => (
            <BentoCard  key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </>
  );
};

export default Configs;
