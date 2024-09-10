import { globalSearch } from "@/lib/api/api";
import { Arrow } from "@radix-ui/react-dropdown-menu";
import { ArrowBigRight, ArrowBigRightDash, ArrowUpRight, ChevronRightIcon, Loader, MoveDiagonal } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const GlobalResult = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const [result, setResult] = useState([]);

  const global = searchParams.get("global");

  // global search useEffect
  useEffect(() => {
    const fetchResult = async () => {
      setIsLoading(true);
      try {
        // fetch everything everywhere all at once => globalSearch, filter
        const res = await globalSearch({
          query: global,
        });

        console.log(res.results)
        setResult(res.results);
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    if (global) {
      fetchResult();
    }
  }, [global]);

  const renderLink = (id) => {
    return `/product/${id}`;
  };

  return (
    <div className="bg-dark-6 border border-dark-4 absolute top-full z-10 mt-3 w-full rounded-md shadow-lg dark:border dark:border-dark-4 dark:shadow-light-100">
      <div className="">

        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <Loader className=" my-2 size-10 animate-spin" />
            <p className="text-dark200_light800 body-regular">Searching..</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {result.length > 0 ? (
              result.map((item, index) => (
                <Link
                  to={renderLink(item.id)}
                  key={item.type + item.id + index}
                  className="flex border-b border-dark-4 cursor-pointer items-start gap-3 px-5 py-1 hover:bg-dark-2 hover:dark:bg-dark-500/50 max-sm:px-1"
                >
                  <ArrowUpRight className="w-4" />
                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  Result not found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default GlobalResult;
