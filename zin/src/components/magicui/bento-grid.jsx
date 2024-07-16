import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
import { BorderBeam } from "./border-beam";
import { Link } from "react-router-dom";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

const BentoGrid = ({ children, className }) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  return(
  <Link to={href}
    key={name}
    onMouseMove={(e) => {
      const { left, top } = e.currentTarget.getBoundingClientRect();

      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    }}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-dark-2 [box-shadow:0_-30px_60px_-15px_#ffffff1f_inset] border border-dark-4 max-sm:py-3",
      // dark styles
      "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className
    )}
  >
    <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
						radial-gradient(${400}px circle at ${mouseX}px ${mouseY}px, ${`#262626`}, transparent 100%)
					`,
        }}
      />
    <BorderBeam />
    <div>{background}</div>
    <div className="pointer-events-none  z-10 flex transform-gpu flex-col gap-1 max-sm:px-6 p-6 max-sm:py-2 transition-all duration-300 group-hover:-translate-y-5 ">
      <Icon className="h-12 w-12 xl:h-16 xl:w-16 origin-left transform-gpu text-pink-100 transition-all duration-300 ease-in-out group-hover:scale-75 max-sm:h-8 max-sm:w-8" />
      <h3 className="xl:text-2xl text-xl font-semibold text-pink-200 max-sm:text-base ">
        {name}
      </h3>
      <p className="max-w-lg text-sm text-neutral-400 max-sm:hidden">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      )}
    >
      {/* <Button asChild size="sm" className="pointer-events-auto bg-dark-4 hover:bg-pink-300 hover:text-black max-sm:h-7 ">
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </a>
      </Button> */}
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    
  </Link>
)};

export { BentoCard, BentoGrid };
