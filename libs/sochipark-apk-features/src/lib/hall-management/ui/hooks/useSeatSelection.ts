import { useState, useCallback } from "react";

type SeatPosition = {
  row: number;
  seat: number;
};

export const useSeatSelection = () => {
  const [selectionStart, setSelectionStart] = useState<SeatPosition | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<SeatPosition | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  const resetSelection = useCallback(() => {
    setSelectedSeats(new Set());
    setSelectionStart(null);
    setSelectionEnd(null);
    setIsSelecting(false);
  }, []);

  const getSeatAtPosition = useCallback((clientX: number, clientY: number) => {
    const element = document.elementFromPoint(clientX, clientY);
    const seatElement = element?.closest('.item-seat[data-row][data-seat]');
    if (!seatElement) return null;
  
    return {
      row: parseInt(seatElement.getAttribute('data-row')!),
      seat: parseInt(seatElement.getAttribute('data-seat')!)
    };
  }, []);

  const handleSeatClick = useCallback(
    (
      e: React.MouseEvent,
      rowIndex: number,
      seatIndex: number,
      selectedSeats: Set<string>
    ) => {
      e.stopPropagation();
      const seatKey = `${rowIndex}-${seatIndex}`;
      const newSelectedSeats = new Set(selectedSeats);

      if (e.ctrlKey || e.metaKey) {
        if (newSelectedSeats.has(seatKey)) {
          newSelectedSeats.delete(seatKey);
        } else {
          newSelectedSeats.add(seatKey);
        }
      } else if (e.shiftKey && selectedSeats.size > 0) {
        const firstSelected = Array.from(selectedSeats)[0];
        const [firstRow, firstSeat] = firstSelected.split("-").map(Number);

        const minRow = Math.min(firstRow, rowIndex);
        const maxRow = Math.max(firstRow, rowIndex);
        const minSeat = Math.min(firstSeat, seatIndex);
        const maxSeat = Math.max(firstSeat, seatIndex);

        for (let r = minRow; r <= maxRow; r++) {
          for (let s = minSeat; s <= maxSeat; s++) {
            newSelectedSeats.add(`${r}-${s}`);
          }
        }
      } else {
        newSelectedSeats.clear();
        newSelectedSeats.add(seatKey);
      }

      return newSelectedSeats;
    },
    []
  );

  const isSeatSelected = useCallback(
    (rowIndex: number, seatIndex: number) => {
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
      return selectedSeats.has(`${rowIndex}-${seatIndex}`);
    },
    [isSelecting, selectionStart, selectionEnd, selectedSeats]
  );

  return {
    selectionStart,
    selectionEnd,
    isSelecting,
    selectedSeats,
    setSelectionStart,
    setSelectionEnd,
    setIsSelecting,
    setSelectedSeats,
    resetSelection,
    getSeatAtPosition,
    handleSeatClick,
    isSeatSelected,
  };
};