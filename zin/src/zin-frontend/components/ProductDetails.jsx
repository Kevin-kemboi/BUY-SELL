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
      <div className="flex bg-dark-2 w-[95%] xl:w-[75%] h-[85vh]  mx-auto mt-5 rounded-md">
        <div className="w-[75%] flex items-center justify-center ">
          <img src={product.imageUrl} alt={product.name} className="w-[70%]" />
        </div>
        <div className="w-1/2  bg-green-400 py-16">
          <div className=" bg-red flex flex-col ">
            <h1 className="text-5xl font-bold text-wrap"> {product.name}</h1>
            <p>{product.description}</p>
            <p>Price: ₹{product.price}</p>
            {/* Add more product details as needed */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
