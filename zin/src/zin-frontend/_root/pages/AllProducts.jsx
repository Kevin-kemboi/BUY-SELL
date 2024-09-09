import { getProductsFrontend } from "@/lib/api/api";
import LeftSidebar from "@/zin-frontend/components/LeftSidebar";
import RightSidebar from "@/zin-frontend/components/RightSidebar";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  const filter = searchParams.get("filter") || "";
  const sortBy = searchParams.get("sortby") || "";

  const fetchProducts = async () => {
    const response = await getProductsFrontend({ filter, sortBy });
    if (response.success) {
      setProducts(response.products);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filter, sortBy]);

  return (
    <div className=" max-w-6xl flex mx-auto">
      <LeftSidebar />
      <div className="w-full mx-auto h-max px-6 grid md:grid-cols-3 grid-cols-2  gap-2">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="relative p-7 h-[250px] xl:h-[300px] cursor-pointer overflow-hidden rounded-md border  border-dark-4 group bg-dark-1 flex justify-center items-center hover:border-blue-500 "
            >
              <img
                src={product.imageUrl}
                className=" size-[85%] absolute m-auto inset-0 left-0 right-0 bottom-0 top-0 object-contain group-hover:scale-110  transition-all duration-300"
              />
              <div className="z-10 absolute bottom-5 left-3 mx-2 flex gap-1 border border-light-2/20 pl-3 pr-1 py-1 rounded-full bg-dark-1">
                <p className="pr-1 text-xs line-clamp-1 capitalize">{product.name}</p>
                <p className="bg-blue-500 rounded-full text-xs px-2">
                  ₹{product.price}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className=" w-full flex items-center justify-center">
            <p>No Products found</p>
          </div>
        )}
      </div>
      <RightSidebar />
    </div>
  );
};

export default AllProducts;
