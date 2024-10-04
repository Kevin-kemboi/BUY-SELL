import { SheetClose } from "@/components/ui/sheet";
import { globalSearch } from "@/lib/api/api";
import { ArrowUpRight, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const GlobalResult = ({ isSheet }) => {
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
          <div className="flex items-center justify-center gap-2 px-5">
            <Loader className=" my-2 size-5 animate-spin text-zinc-500" />
            <p className="text-zinc-500 body-regular">searching...</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {result.length > 0 ? (
              result.map((item, index) => (
                <Link
                  to={renderLink(item.id)}
                  key={item.type + item.id + index}
                >
                  {isSheet ? (
                    <SheetClose className="flex border-b w-full border-dark-4 cursor-pointer items-start gap-3 px-5 py-1 hover:bg-dark-2 hover:dark:bg-dark-500/50 max-sm:px-1">
                      <ArrowUpRight className="w-4 text-zinc-300 " />
                      <div className="flex flex-col">
                        <p className="body-medium text-dark200_light800 line-clamp-1 text-zinc-300">
                          {item.title}
                        </p>
                      </div>
                    </SheetClose>
                  ) : (
                    <div className="flex border-b w-full border-dark-4 cursor-pointer items-start gap-3 px-5 py-1 hover:bg-dark-2 hover:dark:bg-dark-500/50 max-sm:px-1 group">
                      <ArrowUpRight className="w-4 text-zinc-300 group-hover:rotate-45 transition-all duration-300 ease-in-out" />
                      <div className="flex flex-col">
                        <p className="body-medium text-dark200_light800 line-clamp-1 text-zinc-300">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5 text-zinc-500">
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
