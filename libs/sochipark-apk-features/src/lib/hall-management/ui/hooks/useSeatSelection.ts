import { useState, useCallback, useEffect, useRef } from 'react';

export type SeatPosition = { row: number; seat: number };

export const useSeatSelection = (ROWS_COUNT: number, SEATS_PER_ROW: number) => {
  const [selectionStart, setSelectionStart] = useState<SeatPosition | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<SeatPosition | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<DOMRect | null>(null);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Record<string, true>>({});

  // anchorRef хранит "якорь" для shift-selection — надёжнее, чем Object.keys(...)
  const anchorRef = useRef<SeatPosition | null>(null);

  const resetSelection = useCallback(() => {
    setSelectedSeats({});
    setSelectionStart(null);
    setSelectionEnd(null);
    setIsSelecting(false);
    setSelectionBox(null);
    setStartPosition(null);
    anchorRef.current = null;
  }, []);

  const getSeatAtPosition = useCallback((clientX: number, clientY: number) => {
    const element = document.elementFromPoint(clientX, clientY);
    if (!element || !element.closest('.item-seat')) return null;

    const seatElement = element.closest('.item-seat') as HTMLElement | null;
    const row = seatElement?.getAttribute('data-row');
    const seat = seatElement?.getAttribute('data-seat');

    return row && seat ? { row: parseInt(row), seat: parseInt(seat) } : null;
  }, []);

  const updateSelectionBox = useCallback((startX: number, startY: number, endX: number, endY: number) => {
    setSelectionBox(new DOMRect(
      Math.min(startX, endX),
      Math.min(startY, endY),
      Math.abs(endX - startX),
      Math.abs(endY - startY)
    ));
  }, []);

  const isSeatSelected = useCallback((rowIndex: number, seatIndex: number) => {
    if (isSelecting && selectionStart && selectionEnd) {
      const minRow = Math.min(selectionStart.row, selectionEnd.row);
      const maxRow = Math.max(selectionStart.row, selectionEnd.row);
      const minSeat = Math.min(selectionStart.seat, selectionEnd.seat);
      const maxSeat = Math.max(selectionStart.seat, selectionEnd.seat);

      return (
        rowIndex >= minRow &&
        rowIndex <= maxRow &&
        seatIndex >= minSeat &&
        seatIndex <= maxSeat
      );
    }
    return !!selectedSeats[`${rowIndex}-${seatIndex}`];
  }, [isSelecting, selectionStart, selectionEnd, selectedSeats]);

  const handleSeatClick = useCallback((e: React.MouseEvent, rowIndex: number, seatIndex: number) => {
    e.stopPropagation();
    const seatKey = `${rowIndex}-${seatIndex}`;

    setSelectedSeats((prev) => {
      const newSelected = { ...prev };

      // Toggle with Ctrl / Meta
      if (e.ctrlKey || e.metaKey) {
        if (newSelected[seatKey]) delete newSelected[seatKey];
        else newSelected[seatKey] = true;

        // обновляем якорь на последний клик
        anchorRef.current = { row: rowIndex, seat: seatIndex };
        return newSelected;
      }

      // Shift: расширяем от anchor до текущего
      if (e.shiftKey) {
        // используем anchorRef если он есть, иначе пробуем взять первый ключ из prev, иначе текущий клик
        const anchor = anchorRef.current ?? (() => {
          const keys = Object.keys(prev);
          if (keys.length > 0) {
            const [r, s] = keys[0].split('-').map(Number);
            return { row: r, seat: s };
          }
          return { row: rowIndex, seat: seatIndex };
        })();

        const minRow = Math.min(anchor.row, rowIndex);
        const maxRow = Math.max(anchor.row, rowIndex);
        const minSeat = Math.min(anchor.seat, seatIndex);
        const maxSeat = Math.max(anchor.seat, seatIndex);

        for (let r = minRow; r <= maxRow; r++) {
          for (let s = minSeat; s <= maxSeat; s++) {
            newSelected[`${r}-${s}`] = true;
          }
        }

        // не меняем anchorRef (оставляем тот, от которого расширяем)
        return newSelected;
      }

      // Обычный клик: делаем единственную выбранную точку (сбрасываем остальные)
      const single: Record<string, true> = {};
      single[seatKey] = true;
      anchorRef.current = { row: rowIndex, seat: seatIndex };
      return single;
    });

    // обновляем selection anchors для drag и визуалки
    setSelectionStart({ row: rowIndex, seat: seatIndex });
    setSelectionEnd({ row: rowIndex, seat: seatIndex });
  }, [setSelectedSeats]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const seat = getSeatAtPosition(e.clientX, e.clientY);
    if (!seat || e.ctrlKey || e.metaKey || e.shiftKey) return;

    setIsSelecting(true);
    setSelectionStart(seat);
    setSelectionEnd(seat);
    setStartPosition({ x: e.clientX, y: e.clientY });
  }, [getSeatAtPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isSelecting || !startPosition) return;
    updateSelectionBox(startPosition.x, startPosition.y, e.clientX, e.clientY);
    const seat = getSeatAtPosition(e.clientX, e.clientY);
    if (seat) setSelectionEnd(seat);
  }, [isSelecting, startPosition, updateSelectionBox, getSeatAtPosition]);

  const handleMouseUp = useCallback(() => {
    if (!isSelecting) return;
    if (selectionStart && selectionEnd) {
      const newSelectedSeats: Record<string, true> = {};
      const minRow = Math.min(selectionStart.row, selectionEnd.row);
      const maxRow = Math.max(selectionStart.row, selectionEnd.row);
      const minSeat = Math.min(selectionStart.seat, selectionEnd.seat);
      const maxSeat = Math.max(selectionStart.seat, selectionEnd.seat);

      for (let row = minRow; row <= maxRow; row++) {
        for (let seat = minSeat; seat <= maxSeat; seat++) {
          newSelectedSeats[`${row}-${seat}`] = true;
        }
      }

      setSelectedSeats(newSelectedSeats);
      // после завершения выделения задаём якорь на конец выделения (удобнее для последующего shift)
      anchorRef.current = selectionEnd ?? selectionStart;
    }
    setIsSelecting(false);
    setSelectionBox(null);
    setStartPosition(null);
  }, [isSelecting, selectionStart, selectionEnd]);

  useEffect(() => {
    if (isSelecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelecting, handleMouseMove, handleMouseUp]);

  return {
    selectionBox,
    isSelecting,
    selectedSeats,
    setSelectedSeats,
    handleMouseDown,
    handleSeatClick,
    isSeatSelected,
    resetSelection,
  };
};
