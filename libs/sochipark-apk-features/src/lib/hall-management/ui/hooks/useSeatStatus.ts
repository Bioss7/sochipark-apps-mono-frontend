import { useState, useCallback } from 'react';

export type SeatStatus = 'disabled' | 'blocked' | 'tempBlocked' | 'reserved';

export const useSeatStatus = () => {
  const [seatsStatus, setSeatsStatus] = useState<Record<string, SeatStatus>>(
    {}
  );

  const getSeatIcon = useCallback(
    (rowIndex: number, seatIndex: number) => {
      const seatKey = `${rowIndex}-${seatIndex}`;
      const status = seatsStatus[seatKey];

      switch (status) {
        case 'disabled':
          return 'OFF';
        case 'blocked':
          return 'BLOCK';
        case 'tempBlocked':
          return 'TEMP_BLOCK';
        case 'reserved':
          return 'BOOK';
        default:
          return null;
      }
    },
    [seatsStatus]
  );

  const handleActionClick = useCallback(
    (
      action: 'disable' | 'block' | 'temporaryBlock' | 'reserve' | 'clear',
      selectedSeats: Record<string, true>
    ) => {
      const selectedSeatKeys = Object.keys(selectedSeats);
      if (selectedSeatKeys.length === 0) return;

      setSeatsStatus((prev) => {
        const newStatus = { ...prev };
        if (action === 'clear') {
          selectedSeatKeys.forEach((key) => delete newStatus[key]);
        } else {
          const statusMap = {
            disable: 'disabled',
            block: 'blocked',
            temporaryBlock: 'tempBlocked',
            reserve: 'reserved',
          } as const;
          selectedSeatKeys.forEach((key) => {
            newStatus[key] = statusMap[action];
          });
        }
        return newStatus;
      });
    },
    []
  );

  return { seatsStatus, getSeatIcon, handleActionClick };
};
