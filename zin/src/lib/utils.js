import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formUrlQuery = ({ params, key, value }) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};


export const urlQuery = ({ searchParams, key}) => {
  // When sortby is '', remove the 'sortby' parameter and keep the others
  const newParams = new URLSearchParams(searchParams);

  // Delete the 'sortby' parameter
  newParams.delete(`${key}`);

  // Generate the new URL without 'sortby'
 return `/allproducts?${newParams.toString()}`;
};
