import { Link } from "react-router-dom";

const UtilityBar = () => {
  return (
    <div className=" w-max mx-auto px-10 rounded-3xl flex gap-5 items-center justify-center h-20 border border-dark-4 m-5 max-sm:max-w-[300px] max-sm:text-xs max-sm:gap-1 ">
      <div className="bg-dark-3 py-2 rounded-full px-4 font-semibold cursor-pointer hover:text-pink-300 hover:bg-zinc-800 ">
        <Link to="/admin">
          
          Home 
        </Link>
      </div>
      <div className="bg-dark-3 py-2 rounded-full px-4 font-semibold cursor-pointer hover:text-pink-300 hover:bg-zinc-800 ">
        <Link to="">
          Users 
        </Link>
      </div>
      <div className="bg-dark-3 py-2 rounded-full px-4 font-semibold cursor-pointer hover:text-pink-300 hover:bg-zinc-800 ">
        <Link to="/admin/products">
          Manage Products 
        </Link>
      </div>
      <div className="bg-dark-3 py-2 rounded-full px-4 font-semibold cursor-pointer hover:text-pink-300 hover:bg-zinc-800 ">
        <Link to="">
          Website Config 
        </Link>
      </div>
      
      
    </div>
  );
};

export default UtilityBar;
