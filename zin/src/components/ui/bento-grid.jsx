import { cn } from "@/lib/utils";

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({ className }) => {
  return (
    <div
      className={cn(
        "row-span-1 h-full relative rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-dark-1 border border-dark-4  flex items-end space-y-4 overflow-hidden ",
        className
      )}
    >
      <img src="/images/t2.png" className="absolute inset-0 size-full object-contain hover:scale-110 transition-all duration-300" />
      <div className="z-10 mx-2 flex gap-2 border border-light-2/30 pl-3 pr-1 py-1 rounded-full bg-dark-1">
        <p>shirt</p>
        <p className="bg-blue-500 rounded-full px-2">10.99</p>
      </div>
      
    </div>
  );
};
