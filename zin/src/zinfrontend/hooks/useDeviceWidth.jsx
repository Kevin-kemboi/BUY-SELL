import { useState, useEffect } from "react";

// Hook to detect if the current device is mobile or desktop based on window width
export const useDeviceWidth = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Change this breakpoint as per your design
    };

    // Check width on initial render
    handleResize();

    // Add event listener to detect window resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};