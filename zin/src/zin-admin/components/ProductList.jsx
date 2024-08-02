// components/ProductList.jsx
import { getProducts } from "@/zin-admin/lib/api/api";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLocation } from "react-router-dom";
import UpdateModal from "./UpdateModal";

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

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const pageWindow = 0;

    if (currentPage >= 1) {
      pageNumbers.push(1);
    }

    if (currentPage > pageWindow + 2) {
      pageNumbers.push("...");
    }

    for (
      let i = Math.max(2, currentPage - pageWindow);
      i <= Math.min(totalPages - 1, currentPage + pageWindow);
      i++
    ) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - pageWindow - 1) {
      pageNumbers.push("...");
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="absolute inset-0 p-5 max-sm:p-2 min-h-full">
      <h2 className="text-5xl m-5 font-bold pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-pink-200 to-dark-4 bg-clip-text leading-none text-transparent max-sm:text-3xl max-sm:text-center">
        Products List
      </h2>
      <div className="flex flex-col md:gap-4 overflow-auto gap-2 h-[78%]">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className=" bg-dark-2 flex  gap-2 px-7 w-full text-dark-5 max-sm:px-3 overflow-hidden h-full"
            >
              {product.imageUrl ? (
                <div className="flex items-center justify-center w-1/3 mb-3 h-full max-sm:hidden ">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full"
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
              <div className="p-2 w-1/2">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p>
                  {product.description.substring(0, 90)}
                  {product.description.length < 90 ? "" : "..."}
                </p>
              </div>
              <div className="flex items-center justify-center w-1/3">
                {pathname === "/admin/updateproducts" ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <UpdateModal />
                  </div>
                ) : (
                  <div className=""></div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-3xl w-full font-bold flex items-center justify-center col-start-1 text-pink-200 col-end-3">
            <p>No products available</p>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center w-full mt-5 max-md:mt-4 max-sm:mt-2 ">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {renderPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    className={
                      page === currentPage
                        ? "font-extrabold bg-white text-dark-2"
                        : " "
                    }
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ProductList;
