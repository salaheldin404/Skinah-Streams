"use client";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "../ui/skeleton";

interface LazyRenderProps {
  children: React.ReactNode;
}
const LazyRenderRadio = ({ children }: LazyRenderProps) => {
  const [isInView, setIsInView] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = placeholderRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "300px 0px",
      }
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  return isInView ? (
    <>{children}</>
  ) : (
    // Render a lightweight placeholder to hold the space
    <div ref={placeholderRef} className="mb-4 ">
      <Skeleton className="w-full h-[200px] bg-gray-300 dark:bg-muted" />
    </div>
  );
};

export default LazyRenderRadio;
