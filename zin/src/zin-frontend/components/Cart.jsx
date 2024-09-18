import CartItemCard from "./CartItemCard";

const Cart = ({user}) => {
  return (
    <>
      <h4 className="font-bold text-xl">My Cart</h4>
      <div className="h-full mt-5">
        <CartItemCard />
      </div>
    </>
  );
};

export default Cart;
