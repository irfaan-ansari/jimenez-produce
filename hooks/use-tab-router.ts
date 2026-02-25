"use client";

import { useRouterStuff } from "./use-router-stuff";

export type TabItem = {
  href: string;
  query?: Record<string, string>;
};

export function useTabRouter() {
  const { pathname, searchParamsObj } = useRouterStuff();
  const isActive = (item: TabItem) => {
    if (item.href !== pathname) return false;
    if (!item.query) return false;

    const [key, value] = Object.entries(item.query)[0];
    const currentValue = searchParamsObj[key];

    return currentValue === value || (!value && !currentValue);
  };

  const buildPath = (item: TabItem) => {
    if (!item.query) return item.href;

    const [_, value] = Object.entries(item.query)[0];

    if (!value) return item.href;

    const qs = new URLSearchParams(item.query).toString();
    return `${item.href}?${qs}`;
  };

  return {
    isActive,
    buildPath,
    searchParamsObj,
    pathname,
  };
}
