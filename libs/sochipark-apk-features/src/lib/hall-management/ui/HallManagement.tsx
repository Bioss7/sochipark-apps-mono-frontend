import { FloatingMenu, ItemSeat } from '@sochipark-apps-mono-frontend/ui';
import { useRef } from 'react';
import './styles.scss';

import { useSeatSelection } from './hooks/useSeatSelection';
import { useSeatStatus } from './hooks/useSeatStatus';
import { useSectorManagement } from './hooks/useSectorManagement';
import { useGlobalEvents } from './hooks/useGlobalEvents';
import { useSeatRange } from './hooks/useSeatRange';

export const HallManagement = () => {
  const ROWS_COUNT = 30;
  const SEATS_PER_ROW = 53;

  const hallWrapperRef = useRef<HTMLDivElement>(null);
  const lastRowRef = useRef<HTMLDivElement>(null);

  const {
    selectionBox,
    isSelecting,
    selectedSeats,
    setSelectedSeats,
    handleMouseDown,
    handleSeatClick,
    isSeatSelected,
    resetSelection,
  } = useSeatSelection(ROWS_COUNT, SEATS_PER_ROW);

  const { seatsStatus, getSeatIcon, handleActionClick } = useSeatStatus();
  const { currentSector, seatsSectors, handleSectorChange } =
    useSectorManagement(ROWS_COUNT, SEATS_PER_ROW);

  const handleSeatRangeChange = useSeatRange(
    ROWS_COUNT,
    SEATS_PER_ROW,
    setSelectedSeats
  );

  useGlobalEvents(resetSelection, hallWrapperRef);

  return (
    <div className="hall-management-wrapper" ref={hallWrapperRef}>
      <div className="hall-management" onMouseDown={handleMouseDown}>
        {selectionBox && isSelecting && (
          <div
            className="selection-box"
            style={{
              position: 'fixed',
              left: `${selectionBox.x}px`,
              top: `${selectionBox.y}px`,
              width: `${selectionBox.width}px`,
              height: `${selectionBox.height}px`,
            }}
          />
        )}

        {Array.from({ length: ROWS_COUNT }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="hall-row"
            ref={rowIndex === ROWS_COUNT - 1 ? lastRowRef : null}
          >
            <div className="row-number left">{rowIndex + 1}</div>
            {Array.from({ length: SEATS_PER_ROW }).map((_, seatIndex) => {
              const seatNumber = rowIndex * SEATS_PER_ROW + seatIndex + 1;
              return (
                <ItemSeat
                  key={`seat-${rowIndex}-${seatIndex}`}
                  sector={seatsSectors[`${rowIndex}-${seatIndex}`]}
                  icon={getSeatIcon(rowIndex, seatIndex)}
                  isDisabled={
                    seatsStatus[`${rowIndex}-${seatIndex}`] === 'disabled'
                  }
                  isSelected={isSeatSelected(rowIndex, seatIndex)}
                  onClick={(e) => handleSeatClick(e, rowIndex, seatIndex)}
                  data-row={rowIndex}
                  data-seat={seatIndex}
                  seatNumber={seatNumber}
                />
              );
            })}
            <div className="row-number right">{rowIndex + 1}</div>
          </div>
        ))}
      </div>
      <FloatingMenu
        selectedSeats={new Set(Object.keys(selectedSeats))}
        onSeatRangeChange={handleSeatRangeChange}
        onActionClick={(action) => handleActionClick(action, selectedSeats)}
        onSectorChange={(sector) => handleSectorChange(sector, selectedSeats)}
        currentSector={currentSector}
      />
    </div>
  );
};
