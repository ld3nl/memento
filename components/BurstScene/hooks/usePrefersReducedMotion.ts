import * as React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const getServerSnapshot = () => false;

const getSnapshot = () => window.matchMedia(QUERY).matches;

const subscribe = (onStoreChange: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
};

export function usePrefersReducedMotion() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
