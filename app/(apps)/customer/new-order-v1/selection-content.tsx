"use client";

import React from "react";

type ProductSelectionContextValue = {
  isSelecting: boolean;
  selectedIds: Set<number>;
  selectedCount: number;
  startSelection: () => void;
  resetSelection: () => void;
  toggleSelected: (id: number) => void;
  isSelected: (id: number) => boolean;
};

const ProductSelectionContext =
  React.createContext<ProductSelectionContextValue | null>(null);

export function ProductSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedIds, setSelectedIds] = React.useState<Set<number> | null>(
    null,
  );

  const startSelection = React.useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const resetSelection = React.useCallback(() => {
    setSelectedIds(null);
  }, []);

  const toggleSelected = React.useCallback((id: number) => {
    setSelectedIds((prev) => {
      if (!prev) return prev;

      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const isSelected = React.useCallback(
    (id: number) => {
      return selectedIds?.has(id) ?? false;
    },
    [selectedIds],
  );

  const value = React.useMemo<ProductSelectionContextValue>(() => {
    return {
      isSelecting: selectedIds !== null,
      selectedIds: selectedIds ?? new Set(),
      selectedCount: selectedIds?.size ?? 0,
      startSelection,
      resetSelection,
      toggleSelected,
      isSelected,
    };
  }, [selectedIds, startSelection, resetSelection, toggleSelected, isSelected]);

  return (
    <ProductSelectionContext.Provider value={value}>
      {children}
    </ProductSelectionContext.Provider>
  );
}

export function useProductSelection() {
  const context = React.useContext(ProductSelectionContext);

  if (!context) {
    throw new Error(
      "useProductSelection must be used within ProductSelectionProvider",
    );
  }

  return context;
}
