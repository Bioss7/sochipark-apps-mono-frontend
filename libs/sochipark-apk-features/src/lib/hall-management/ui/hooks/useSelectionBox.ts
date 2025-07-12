import { useState, useCallback } from "react";

export const useSelectionBox = () => {
  const [selectionBox, setSelectionBox] = useState<DOMRect | null>(null);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null);

  const updateSelectionBox = useCallback((startX: number, startY: number, endX: number, endY: number) => {
    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    setSelectionBox(new DOMRect(left, top, width, height));
  }, []);

  const resetSelectionBox = useCallback(() => {
    setSelectionBox(null);
    setStartPosition(null);
  }, []);

  return {
    selectionBox,
    startPosition,
    setStartPosition,
    updateSelectionBox,
    resetSelectionBox,
  };
};