import PropTypes from "prop-types";

const ProductCard = ({ product }) => {
  return (
    <div className=" bg-dark-4 rounded-lg flex flex-col items-center text-justify justify-center px-7 w-full text-dark-5 max-sm:px-3 overflow-hidden max-h-[280px] transition ease-in-out ">
        {product.imageUrl ? (
          <div className="flex items-center justify-center w-full mb-3 max-sm:hidden ">
            <img src={product.imageUrl} alt={product.name} className="w-[200px] h-[90px] rounded-md object-contain opacity-90" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full mb-3 max-sm:hidden ">
            <img
              src="/images/thumb.png"
              className=" w-[200px] h-[90px] rounded-md opacity-90"
            />
          </div>
        )}
        <h2 className="text-xl font-semibold">
          {product.name}
        </h2>
        <div className="flex gap-5 mt-5 max-sm:mt-2 justify-center items-center bg-dark-3 p-2 rounded-xl border w-max px-3 border-dark-4">
          <p className="text-lg max-sm:text-sm">
            <span className="font-semibold">Price:</span> {product.price}
          </p>
          <p className="text-lg max-sm:text-sm">
            <span className="font-semibold">Stock:</span> {product.stock}
          </p>
        </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    imageUrl: PropTypes.string, // Add this line for imageUrl validation
  }).isRequired,
};

export default ProductCard;
