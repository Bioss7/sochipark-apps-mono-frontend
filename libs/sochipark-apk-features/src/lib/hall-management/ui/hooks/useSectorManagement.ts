import { useState, useCallback } from 'react';

export type Sector = 'A' | 'B' | 'C' | 'D' | 'E';

export const useSectorManagement = (
  ROWS_COUNT: number,
  SEATS_PER_ROW: number
) => {
  const [currentSector, setCurrentSector] = useState<Sector>('A');
  const [seatsSectors, setSeatsSectors] = useState<Record<string, Sector>>(
    () => {
      const initial: Record<string, Sector> = {};
      for (let row = 0; row < ROWS_COUNT; row++) {
        for (let seat = 0; seat < SEATS_PER_ROW; seat++) {
          initial[`${row}-${seat}`] = 'A';
        }
      }
      return initial;
    }
  );

  const handleSectorChange = useCallback(
    (sector: Sector, selectedSeats: Record<string, true>) => {
      setCurrentSector(sector);
      if (Object.keys(selectedSeats).length > 0) {
        setSeatsSectors((prev) => {
          const updated = { ...prev };
          Object.keys(selectedSeats).forEach((seat) => {
            updated[seat] = sector;
          });
          return updated;
        });
      }
    },
    []
  );

  return { currentSector, seatsSectors, handleSectorChange };
};
