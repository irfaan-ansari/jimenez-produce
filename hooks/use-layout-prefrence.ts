import { LayoutGrid, TextAlignJustify } from "lucide-react";
import React from "react";

export const LAYOUT_MAP = {
  list: {
    value: "list",
    icon: TextAlignJustify,
    className: "grid-cols-1 gap-1",
  },

  grid: {
    value: "grid",
    icon: LayoutGrid,
    className:
      "grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @8xl:grid-cols-8 gap-4",
  },
} as const;

export type LayoutType = keyof typeof LAYOUT_MAP;

export function useLayoutPreference() {
  const [layout, setLayout] = React.useState<LayoutType>(() => {
    if (typeof window === "undefined") return "grid";

    return (localStorage.getItem("layout-state") as LayoutType) || "grid";
  });

  const updateLayout = React.useCallback((value: LayoutType) => {
    setLayout(value);
    localStorage.setItem("layout-state", value);
  }, []);

  return [layout, updateLayout] as const;
}
