import { useCallback } from 'react';

export const useSeatRange = (
  ROWS_COUNT: number,
  SEATS_PER_ROW: number,
  setSelectedSeats: React.Dispatch<React.SetStateAction<Record<string, true>>>
) => {
  return useCallback(
    (from: string, to: string) => {
      if (!from && !to) {
        setSelectedSeats({});
        return;
      }

      const fromNum = parseInt(from);
      const toNum = parseInt(to);
      if (isNaN(fromNum)) return;

      const newSelectedSeats: Record<string, true> = {};
      const start = Math.min(fromNum, toNum || fromNum);
      const end = Math.max(fromNum, toNum || fromNum);

      for (let seatNum = start; seatNum <= end; seatNum++) {
        const row = Math.floor((seatNum - 1) / SEATS_PER_ROW);
        const seat = (seatNum - 1) % SEATS_PER_ROW;

        if (row >= 0 && row < ROWS_COUNT && seat >= 0 && seat < SEATS_PER_ROW) {
          newSelectedSeats[`${row}-${seat}`] = true;
        }
      }

      setSelectedSeats(newSelectedSeats);
    },
    [ROWS_COUNT, SEATS_PER_ROW, setSelectedSeats]
  );
};
