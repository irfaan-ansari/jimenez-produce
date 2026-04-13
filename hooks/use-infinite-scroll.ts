import { useEffect, useRef } from "react";

export const useInfiniteScroll = (
  callback: () => void,
  enabled: boolean,
  rootMargin = "200px",
) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      {
        rootMargin,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [callback, enabled, rootMargin]);

  return ref;
};
