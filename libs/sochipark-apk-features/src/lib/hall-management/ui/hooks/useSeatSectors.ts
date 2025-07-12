import { useState, useCallback } from "react";

type Sector = "A" | "B" | "C" | "D" | "E";

export const useSeatSectors = (rowsCount: number, seatsPerRow: number) => {
  const [currentSector, setCurrentSector] = useState<Sector>("A");
  const [seatsSectors, setSeatsSectors] = useState<Record<string, Sector>>(() => {
    const initialSectors: Record<string, Sector> = {};
    for (let row = 0; row < rowsCount; row++) {
      for (let seat = 0; seat < seatsPerRow; seat++) {
        initialSectors[`${row}-${seat}`] = "A";
      }
    }
    return initialSectors;
  });

  const handleSectorChange = useCallback(
    (sector: Sector, selectedSeats: Set<string>) => {
      setCurrentSector(sector);
      if (selectedSeats.size > 0) {
        setSeatsSectors((prev) => {
          const newSeatsSectors = { ...prev };
          selectedSeats.forEach((seat) => {
            newSeatsSectors[seat] = sector;
          });
          return newSeatsSectors;
        });
      }
    },
    []
  );

  return {
    currentSector,
    seatsSectors,
    handleSectorChange,
  };
};