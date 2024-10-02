import { Button } from "@/components/ui/button";
import { addItemToCart, getProductById } from "@/lib/api/api";
import { formUrlQuery } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isAddToCartDisabled, setIsAddToCartDisabled] = useState(true); // State to control the button

  // Function to handle variant selection
  const handleVariantSelect = (type, option) => {
    const updatedVariants = { ...selectedVariants, [type]: option };

    // Update the URL query parameters
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: type,
      value: option,
    });
    navigate(newUrl);

    setSelectedVariants(updatedVariants);
  };

  // Function to remove variant from URL
  const handleVariantDeselect = (type) => {
    const updatedVariants = { ...selectedVariants };
    delete updatedVariants[type];

    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(type);

    navigate({
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    });

    setSelectedVariants(updatedVariants);
  };

  // Add item to cart
  const addItem = async () => {
    const item = await addItemToCart(id); // Include selected variants when adding to cart
    if (item.success) {
      console.log("added");
    }
  };

  // Function to check if all variant types have been selected
  const checkIfAllVariantsSelected = () => {
    if (!product) return false;
    return product.variations.every((variant) => selectedVariants[variant.type]);
  };

  // UseEffect to update the button's disabled state based on variant selections
  useEffect(() => {
    setIsAddToCartDisabled(!checkIfAllVariantsSelected());
  }, [selectedVariants, product]);

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
          <img
            src={product.imageUrl}
            alt={product.name}
            className="size-[90%] object-contain"
          />
        </div>
        <div className="w-1/2 py-16">
          <div className="mx-3 py-6 flex flex-col gap-3  border-b border-dark-5/30">
            <h1 className="text-5xl font-bold text-wrap"> {product.name}</h1>
            <p className="text-xl line-clamp-3">{product.description}</p>
            <span className="bg-blue-500 w-max font-semibold p-1 px-3 rounded-full text-xl">
              ₹{product.price}
            </span>
          </div>

          <div className="mx-3 py-6 text-sm font-medium flex flex-col justify-between gap-3">
            {product.variations.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-2 items-start justify-center my-1.5"
              >
                <p className="text-xl">{item.type}</p>
                <div className="flex gap-3">
                  {item.options.map((option) => {
                    const isSelected = selectedVariants[item.type] === option;
                    return (
                      <div
                        key={option}
                        className={`${
                          isSelected ? "border-blue-600" : "border-dark-5/20"
                        } bg-dark-4/80 border p-1 px-3 rounded-full text-xs font-normal cursor-pointer`}
                        onClick={() =>
                          isSelected
                            ? handleVariantDeselect(item.type)
                            : handleVariantSelect(item.type, option)
                        }
                      >
                        {option}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={addItem}
            className="bg-blue-500 p-2 font-bold m-5 hover:bg-blue-500/80"
            disabled={isAddToCartDisabled} // Disable button if not all variants are selected
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
