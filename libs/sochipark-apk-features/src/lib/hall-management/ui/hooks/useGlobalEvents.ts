import { useEffect } from 'react';

export const useGlobalEvents = (
  resetSelection: () => void,
  hallWrapperRef: React.RefObject<HTMLDivElement | null>
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') resetSelection();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [resetSelection]);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (hallWrapperRef.current && hallWrapperRef.current.contains(target))
        return;
      resetSelection();
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [resetSelection, hallWrapperRef]);
};
