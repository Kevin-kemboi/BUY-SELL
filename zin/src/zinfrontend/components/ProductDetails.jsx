import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { addItemToCart, getProductById } from "@/lib/api/api";
import { mockProducts } from "@/lib/api/mockData";
import { formUrlQuery } from "@/lib/utils";
import { Loader, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
  Link
} from "react-router-dom";
import { useCart } from "../context/CartContext";
import ErrorBoundary from "@/components/ErrorBoundary";

// Inner component for product details logic
const ProductDetailsContent = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isAddToCartDisabled, setIsAddToCartDisabled] = useState(true); // State to control the button
  const {fetchCart} =  useCart()

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

    const token = localStorage.getItem('UserCookie')
    

    const item = await addItemToCart(id); // Include selected variants when adding to cart
    fetchCart();
    if (item.success) {
      toast({
        title: 'Item added.'
      })
    }else if(!token){
      toast({title: 'Login to add to cart'})
    } else{
      toast({title: 'Error'})
    }
  };

  // Function to check if all variant types have been selected
  const checkIfAllVariantsSelected = () => {
    if (!product) return false;
    return product.variations.every(
      (variant) => selectedVariants[variant.type]
    );
  };

  // UseEffect to update the button's disabled state based on variant selections
  useEffect(() => {
    setIsAddToCartDisabled(!checkIfAllVariantsSelected());
  }, [selectedVariants, product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Show loading state
        setProduct(null);
        
        const response = await getProductById(id);
        if (response && response.success && response.product) {
          setProduct(response.product);
          return;
        }
        
        // API returned success: false or no product
        console.warn('[ProductDetails] API response missing product data, using fallback');
        const fallback = mockProducts.find(p => p._id === id) || mockProducts[0];
        setProduct(fallback);
      } catch (e) {
        console.error('[ProductDetails] Error fetching product:', e.message);
        const fallback = mockProducts.find(p => p._id === id) || mockProducts[0];
        setProduct(fallback);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="size-full min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="size-10 animate-spin"/>
          <p className="text-zinc-400 text-sm">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex max-sm:flex-col max-sm:justify-center bg-dark-2 w-[95%] xl:w-[75%] min-h-[85vh] md:max-h-[850px] mx-auto mt-5 rounded-md px-5 max-sm:py-3">
        <div className="w-[70%]  flex items-center justify-center max-sm:w-full max-sm:border-b pb-5 border-dark-5/30">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="size-[90%] object-contain max-sm:w-full"
          />
        </div>
        <div className="w-1/2 py-16 max-sm:w-full max-sm:p-0">
          <div className="mx-3 py-6 flex flex-col gap-3  border-b border-dark-5/30 max-sm:flex-row max-sm:justify-between max-sm:items-center max-sm:border-none max-sm:py-5">
            <h1 className="text-5xl font-bold text-wrap max-sm:text-2xl capitalize">
              {" "}
              {product.name}
            </h1>
            <span className="bg-blue-700 w-max font-semibold p-2 px-3  rounded-full text-base max-sm:text-xs flex font-mono items-center justify-center h-max">
              ₹{product.price}
            </span>
          </div>

          <div className="mx-3 py-6 max-sm:py-0 text-sm font-medium flex flex-col justify-between gap-3">
            {product.variations.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-2 items-start justify-center my-1.5 max-sm:m-0"
              >
                <p className="text-xl max-sm:text-sm">{item.type}</p>
                <div className="flex gap-3">
                  {item.options.map((option) => {
                    const isSelected = selectedVariants[item.type] === option;
                    return (
                      <div
                        key={option}
                        className={`${
                          isSelected ? "border-blue-700" : "border-dark-5/10"
                        } bg-dark-4/80 p-1 px-3 rounded-full text-sm font-normal cursor-pointer border-2`}
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
          <p className="text-sm mx-3 my-6 line-clamp-3 text-zinc-400/80">
            {product.description}
          </p>
          <Button
            onClick={addItem}
            className="bg-blue-700 relative p-2 w-full font-bold rounded-full hover:bg-blue-900/80 group transition-all"
            disabled={isAddToCartDisabled} // Disable button if not all variants are selected
          >
            <Plus className="w-4 absolute left-5 group-hover:rotate-45 transition-all"/>
            Add to Cart
          </Button>
        </div>
      </div>
    </>
  );
};

export default function ProductDetails() {
  return (
    <ErrorBoundary
      onReset={() => window.history.back()}
    >
      <ProductDetailsContent />
    </ErrorBoundary>
  );
};
