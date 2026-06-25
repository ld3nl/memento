import * as React from "react";

export function useElementSize<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [size, setSize] = React.useState({ w: 0, h: 0 });

  const observer = React.useRef<ResizeObserver>();

  React.useLayoutEffect(() => {
    if (!ref.current) return;

    observer.current = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        // Use contentRect or borderBox as needed.
        // contentRect is usually preferred for canvas drawing area.
        const { width, height } = entry.contentRect;
        setSize({ w: width, h: height });
      }
    });

    observer.current.observe(ref.current);

    return () => {
      observer.current?.disconnect();
    };
  }, []);

  return { ref, size };
}
