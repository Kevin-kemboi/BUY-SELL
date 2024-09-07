import { getProductsFrontend } from "@/lib/api/api";
import LeftSidebar from "@/zin-frontend/components/LeftSidebar";
import RightSidebar from "@/zin-frontend/components/RightSidebar";
import { useEffect, useState } from "react";

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const response = await getProductsFrontend();
    if (response.success) {
      setProducts(response.products);
    }
  };

  useEffect(() => {
    fetchProducts()
  }, [])
  

  return (
    <div className=" max-w-6xl flex mx-auto">
      <LeftSidebar />
      <div className="w-full mx-auto px-6 grid grid-cols-3   ">
        {products.map((product) => (
          <figure key={product._id}
            className="relative   cursor-pointer overflow-hidden rounded-md border  border-dark-4 bg-dark-1 flex justify-center items-center hover:border-blue-500"
          >
            <img
              src={product.imageUrl}
              className=" size-[95%] object-contain hover:scale-110 transition-all duration-300"
            />
            <div className="z-10 absolute bottom-5 left-3 mx-2 flex gap-2 border border-light-2/30 pl-3 pr-1 py-1 rounded-full bg-dark-1">
              <p className="px-2">{name}</p>
              <p className="bg-blue-500 rounded-full px-2">₹{product.price}</p>
            </div>
          </figure>
        ))}
      </div>
      <RightSidebar />
    </div>
  );
};

export default AllProducts;
