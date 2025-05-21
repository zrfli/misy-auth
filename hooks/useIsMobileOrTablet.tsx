"use client"

import { useState, useEffect } from "react";

export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(min-width: 1025px)");

      setIsDesktop(mediaQuery.matches);

      const handleChange = () => setIsDesktop(mediaQuery.matches);

      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, []);

  return isDesktop;
};