"use client";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { Search } from "lucide-react";
import GlobalResult from "./GlobalResult";
// import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [searchParams] = useSearchParams();
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  const query = searchParams.get("global");

  const [search, setSearch] = useState(query || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // close modal useEffect
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsModalOpen(false);
        setSearch("");
      }
    };

    setIsModalOpen(false);

    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [pathname]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        navigate(newUrl);
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });

          navigate(newUrl);
        }
        setIsModalOpen(false); // Close modal when search is cleared
      }
    }, 180);

    return () => clearTimeout(delayDebounceFn);
  }, [query, search, pathname, searchParams]);

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-xl">
      <div
        className={`relative flex items-center gap-1 rounded-xl border border-dark-4 px-4 ${
          isFocused ? "border-blue-600" : "border-dark-4"
        }`}
      >
        <label htmlFor="global-search">
          <Search className="cursor-pointer" />
        </label>
        <Input
          type="text"
          id="global-search"
          value={search}
          placeholder="search globally"
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isModalOpen) {
              setIsModalOpen(true);
            }
            if (e.target.value === "" && isModalOpen) {
              setIsModalOpen(false);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className=" h-7 bg-dark-6 my-1  border-dark-6 shadow-none "
        />
      </div>
      {isModalOpen && <GlobalResult search={search} />}
    </div>
  );
};

export default GlobalSearch;
