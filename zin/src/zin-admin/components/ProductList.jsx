// components/ProductList.jsx
import { deleteProduct, getProducts } from "@/lib/api/api";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem, 
} from "@/components/ui/pagination";
import { useLocation } from "react-router-dom";
import UpdateModal from "./UpdateModal";
import { Button } from "@/components/ui/button";
import { Modal, ModalBody, ModalTrigger } from "@/components/ui/animated-modal";
import { toast } from "@/components/ui/use-toast";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { pathname } = useLocation();

  const fetchData = async () => {
    const data = await getProducts(currentPage);
    if (data && data.products) {
      setProducts(data.products);
      const totalCount = data.totalCount;
      const pageSize = 4;
      const totalPages = Math.ceil(totalCount / pageSize);
      setTotalPages(totalPages);
      console.log(totalPages)
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteProduct(id);
    if (result.success) {
      fetchData();
      toast({
        title: "Product deleted successfully",
      });
    } else {
      toast({
        title: "Failed to delete product",
      });
    }
  };



  return (
    <div className="absolute inset-0 p-5 max-sm:p-2 min-h-full">
      <div className="flex flex-col md:gap-4 overflow-auto gap-2 h-[90%]">
        {products.length > 0 ? (
          products.map((product) => (
            // Main card div for product list
            <div
              key={product._id}
              className=" bg-dark-2 flex  gap-2 px-7 w-full text-dark-5 max-sm:px-3 border-b border-dark-4 overflow-hidden h-1/4"
            >
              {product.imageUrl ? (
                <div className="flex items-center justify-center w-1/3 mb-3 h-full max-sm:hidden ">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-[200px] h-[90px] rounded-md"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-1/3 mb-3  h-full max-sm:hidden ">
                  <img
                    src="/images/thumb.png"
                    className=" w-[200px] h-[90px] rounded-md"
                  />
                </div>
              )}
              <div className="p-2 w-1/2 max-sm:w-3/4 flex flex-col justify-center">
                <h2 className="text-xl font-semibold">
                  {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
                </h2>
                {/* Title and description */}
                <p className="text-sm">
                  {product.description.substring(0, 50)}
                  {product.description.length < 50 ? "" : "..."}
                </p>
              </div>
              <div className="flex items-center justify-center w-1/4">
                {pathname === "/admin/updateproducts" && (
                  // interraction button
                  <div className="h-full w-full flex items-center justify-center">
                    <Modal>
                      <ModalTrigger className="bg-transparent flex justify-center">
                        <img
                          src="/icons/edit.svg"
                          height={20}
                          width={20}
                          alt=""
                        />
                      </ModalTrigger>
                      <ModalBody className={`bg-dark-3`}>
                        <UpdateModal
                          product={product}
                          refreshProducts={fetchData}
                        />
                      </ModalBody>
                    </Modal>
                  </div>
                )}
                {pathname === "/admin/deleteproducts" && (
                  <div className="h-full w-full flex items-center justify-center">
                    <Button
                      className="bg-transparent py-2"
                      onClick={() => handleDelete(product._id)}
                    >
                      <img
                        src="/icons/delete.svg"
                        alt=""
                        className="cursor-pointer"
                      />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-3xl w-full h-full font-bold flex items-center justify-center col-start-1 text-pink-200 col-end-3">
            <p>No products available</p>
          </div>
        )}
      </div>
      <div className="flex  justify-between items-center w-full mt-5 max-md:mt-4 max-sm:mt-2 ">
        <Pagination>
          <PaginationContent className=" w-full flex gap-4 items-center justify-center">
            <PaginationItem className=" flex items-center">
            <Button
                className="bg-transparent py-2"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-5"/>
              </Button>
            </PaginationItem>
            
              <PaginationItem className="bg-white font-bold px-3 py-1 rounded-md text-black" >
                {currentPage}
              </PaginationItem>
            <PaginationItem className="flex items-center">
              <Button
                className="bg-transparent py-2"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="h-5"/>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ProductList;
