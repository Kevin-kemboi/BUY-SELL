import Marquee from "@/components/magicui/marquee";
import { ProductCard } from "@/components/magicui/ProductCard";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductsFrontend } from "@/lib/api/api";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";



const Home = () => {
  const [products, setProducts] = useState([]);

  const displayProducts = products.slice(0, 3).map((product, index) => {
    let className;
    if (index === 0) {
      className = "md:col-start-1 md:row-start-1 md:col-end-3 md:row-end-3";
    }
    return {
      ...product,
      className,
    };
  });

  const fetchProducts = async () => {
    const data = await getProductsFrontend();
    if (data && data.products) {

      setProducts(data.products.slice(0,10));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="mt-2 px-3 w-full h-full">
      <BentoGrid className="max-w-7xl h-[80%] max-sm:min-h-screen mx-auto md:grid-cols-3 w-full">
        {displayProducts.map((item) => (
          <BentoGridItem
            key={item._id}
            _id={item._id}
            name={item.name}
            price={item.price}
            {...item}
            className={` ${
              item.className
            }`}
          />
        ))}
      </BentoGrid>

      <div className="mt-3">
        <Marquee  className="[--duration:50s]">
          {products.slice(3).map((item) => (
            <ProductCard key={item._id} {...item} />
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Home;
