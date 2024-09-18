import { useEffect, useState } from "react";
import CartItemCard from "./CartItemCard";
import { getCart } from "@/lib/api/api";

const Cart = ({user}) => {

  const [cartItems, setCartItems] = useState([])

  const fetchCart = async() => {
    const cartItems = await getCart();
    if(cartItems. success){
      setCartItems(cartItems.cart.items);
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])
  

  return (
    <>
      <h4 className="font-bold text-xl">My Cart</h4>
      <div className="h-full mt-5 flex flex-col">
        {cartItems.length > 0
        ? cartItems.map((product)=>(

          <CartItemCard {...product.products} quantity={product.quantity}  key={product.products._id} />
        )) 
        : (
          <>No items</>
        )
      }
      </div>
    </>
  );
};

export default Cart;
