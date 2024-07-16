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

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    const data = await getProducts(currentPage);
    if (data && data.products) {
      setProducts(data.products);
      const totalCount = data.totalCount;
      const pageSize = 5;
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
    const pageWindow = 1;
  
    if (currentPage >= 1) {
      pageNumbers.push(1);
    }
  
    if (currentPage > pageWindow + 2) {
      pageNumbers.push("...");
    }
  
    for (let i = Math.max(2, currentPage - pageWindow); i <= Math.min(totalPages - 1, currentPage + pageWindow); i++) {
      pageNumbers.push(i);
    }
  
    if (currentPage < totalPages - pageWindow - 1) {
      pageNumbers.push("...");
    }
  
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    console.log(pageNumbers)
  
    return pageNumbers;
  };
  

  return (
    <div className="absolute inset-0 p-5 max-sm:p-2 min-h-full">
      <div className="flex flex-wrap md:grid md:gap-4 overflow-auto gap-2 grid-rows-5 min-h-[90%]">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-dark-2 flex flex-col justify-center px-7 rounded-lg w-full text-dark-5 max-sm:px-3"
            >
              <h2 className="text-xl max-sm:text-lg font-bold">{product.name}</h2>
              <p className="text-lg max-sm:text-sm">Price: ${product.price}</p>
              <p className="text-lg max-sm:text-sm">Stock: {product.stock}</p>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
      <div className="flex justify-between items-center w-full mt-7 max-md:mt-6 max-sm:mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
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
                    className={page === currentPage ? "font-extrabold" : ""}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
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
