import { useState, useCallback } from "react";

export const useSeatStatus = () => {
  const [disabledSeats, setDisabledSeats] = useState<Set<string>>(new Set());
  const [blockedSeats, setBlockedSeats] = useState<Set<string>>(new Set());
  const [tempBlockedSeats, setTempBlockedSeats] = useState<Set<string>>(new Set());
  const [reservedSeats, setReservedSeats] = useState<Set<string>>(new Set());

  const updateSeatStatus = useCallback(
    (selectedSeats: Set<string>, statusType: "disable" | "block" | "temporaryBlock" | "reserve" | "clear") => {
      const updateStatus = (prev: Set<string>, shouldAdd: boolean) => {
        const newSet = new Set(prev);
        selectedSeats.forEach((seat) => {
          if (shouldAdd) newSet.add(seat);
          else newSet.delete(seat);
        });
        return newSet;
      };

      switch (statusType) {
        case "disable":
          setDisabledSeats(prev => updateStatus(prev, true));
          break;
        case "block":
          setBlockedSeats(prev => updateStatus(prev, true));
          break;
        case "temporaryBlock":
          setTempBlockedSeats(prev => updateStatus(prev, true));
          break;
        case "reserve":
          setReservedSeats(prev => updateStatus(prev, true));
          break;
        case "clear":
          setDisabledSeats(prev => updateStatus(prev, false));
          setBlockedSeats(prev => updateStatus(prev, false));
          setTempBlockedSeats(prev => updateStatus(prev, false));
          setReservedSeats(prev => updateStatus(prev, false));
          break;
      }
    },
    []
  );

  const getSeatIcon = useCallback(
    (rowIndex: number, seatIndex: number) => {
      const seatKey = `${rowIndex}-${seatIndex}`;

      if (disabledSeats.has(seatKey)) return "OFF";
      if (blockedSeats.has(seatKey)) return "BLOCK";
      if (tempBlockedSeats.has(seatKey)) return "TEMP_BLOCK";
      if (reservedSeats.has(seatKey)) return "BOOK";

      return null;
    },
    [disabledSeats, blockedSeats, tempBlockedSeats, reservedSeats]
  );

  return {
    disabledSeats,
    blockedSeats,
    tempBlockedSeats,
    reservedSeats,
    updateSeatStatus,
    getSeatIcon,
  };
};