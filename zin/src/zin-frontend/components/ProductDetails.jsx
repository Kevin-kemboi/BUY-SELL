import { getProductById } from "@/lib/api/api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await getProductById(id);
      if (response.success) {
        setProduct(response.product);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex bg-dark-2 w-[95%] xl:w-[75%] h-[85vh]  mx-auto mt-5 rounded-md px-5">
        <div className="w-[70%] flex items-center justify-center ">
          <img src={product.imageUrl} alt={product.name} className="w-[70%]" />
        </div>
        <div className="w-1/2 py-16">
          <div className="mx-3 py-6 flex flex-col gap-3  border-b border-dark-5/30">
            <h1 className="text-5xl font-bold text-wrap"> {product.name}</h1>
            <p className="text-xl line-clamp-3">{product.description}</p>
            <span className="bg-blue-500 w-max font-semibold p-1 px-3 rounded-full text-xl">₹{product.price}</span>
            {/* Add more product details as needed */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
