import { Button } from "@/components/ui/button";
import { addItemToCart, getProductById } from "@/lib/api/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const addItem = async () => {
    const item = addItemToCart(id);
    if (item.success) {
      console.log("added");
    }
  };

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
console.log(product)
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
            <span className="bg-blue-500 w-max font-semibold p-1 px-3 rounded-full text-xl">
              ₹{product.price}
            </span>
            {/* Add more product details as needed */}
          </div>
          <div className=" mx-3 py-6 text-sm font-medium flex flex-col justify-between gap-3">
            {product.variations.map((item) => (
              <div key={item._id} className="flex flex-col gap-2 items-start justify-center my-2">
                <p className="text-xl">{item.type}</p>
                <div className="flex gap-3">
                  {item.options.map((item) => (
                    <div
                      key={item}
                      className="bg-dark-4/80 border border-dark-5/20 p-1 px-4 rounded-full text-sm font-normal cursor-pointer hover:border-blue-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={addItem}
            className="bg-blue-500 p-2 font-bold m-5 hover:bg-blue-500/80"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
