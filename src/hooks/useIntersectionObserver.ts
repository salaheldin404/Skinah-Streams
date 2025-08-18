"use client";
import { useEffect, useState } from "react";

const useIntersectionObserver = (
  ref: React.RefObject<Element | null>,
  rootMargin = "50px",
  threshold = 0
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [wasIntersected, setWasIntersected] = useState(false);

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setWasIntersected(true);
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setWasIntersected(true);
          setIsIntersecting(true);
        } else {
          setIsIntersecting(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return { isIntersecting, wasIntersected };
};

export default useIntersectionObserver;
