import Marquee from "@/components/magicui/marquee";
import { ProductCard } from "@/components/magicui/ProductCard";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
const items = [
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: <Skeleton />,
    icon: <Clock className="h-4 w-4 text-neutral-500" />,
    className: "md:col-start-1 md:row-start-1 md:col-end-3 md:row-end-3",
  },
  {
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    header: <Skeleton />,
    icon: <Clock className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Art of Design",
    description: "Discover the beauty of thoughtful and functional design.",
    header: <Skeleton />,
    icon: <Clock className="h-4 w-4 text-neutral-500" />,
  },
];

const Home = () => {
  return (
    <div className="mt-2 px-3 w-full h-full">
      <BentoGrid className="max-w-7xl h-[80%] max-sm:min-h-screen mx-auto md:grid-cols-3 w-full">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={` ${i === 3 || i === 6 ? "md:col-span-2" : ""} ${
              item.className
            }`}
          />
        ))}
      </BentoGrid>

      <div className="mt-3">
        <Marquee pauseOnHover className="[--duration:30s]">
          {items.map((review) => (
            <ProductCard key={review.title} {...review} />
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Home;
