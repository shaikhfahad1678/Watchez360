import { createContext, useContext, useState, useCallback, useMemo } from "react";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = useCallback((product) => {
    setCompareList((prev) => {
      if (prev.length >= 2) {
        alert("You can compare up to 2 watches.");
        return prev;
      }
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((id) => {
    setCompareList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const isInCompare = useCallback((id) => {
    return compareList.some((item) => item.id === id);
  }, [compareList]);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const contextValue = useMemo(() => ({
    compareList,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare
  }), [compareList, addToCompare, removeFromCompare, isInCompare, clearCompare]);

  return (
    <CompareContext.Provider value={contextValue}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}