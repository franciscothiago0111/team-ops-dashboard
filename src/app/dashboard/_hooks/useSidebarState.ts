import { useEffect, useState } from "react";

export function useSidebarState() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true); // Open by default on desktop
      } else {
        setIsSidebarOpen(false); // Closed by default on mobile
      }
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    closeSidebarOnMobile,
  };
}
