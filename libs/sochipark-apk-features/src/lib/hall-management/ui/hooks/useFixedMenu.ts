import { useState, useEffect, useRef } from "react";

export const useFixedMenu = (lastRowRef: React.RefObject<HTMLDivElement | null>) => {
  const [isMenuFixed, setIsMenuFixed] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!lastRowRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsMenuFixed(!entry.isIntersecting),
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    observer.observe(lastRowRef.current);
    observerRef.current = observer;

    return () => observerRef.current?.disconnect();
  }, [lastRowRef]);

  return isMenuFixed;
};
