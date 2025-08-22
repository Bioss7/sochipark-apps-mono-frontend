import { FC, useRef, memo } from 'react';
import './styles.scss';
import { Icon } from '../Icon';

interface IItemSeatProps {
  sector: 'A' | 'B' | 'C' | 'D' | 'E';
  icon?: 'OFF' | 'BLOCK' | 'TEMP_BLOCK' | 'BOOK' | 'CLEAR' | null;
  isDisabled?: boolean;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  'data-row'?: number;
  'data-seat'?: number;
  seatNumber?: number;
}

const arePropsEqual = (prevProps: IItemSeatProps, nextProps: IItemSeatProps) => {
  return (
    prevProps.sector === nextProps.sector &&
    prevProps.icon === nextProps.icon &&
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps["data-row"] === nextProps["data-row"] &&
    prevProps["data-seat"] === nextProps["data-seat"] &&
    prevProps.seatNumber === nextProps.seatNumber
    // onClick не включаем в сравнение, так как он обычно меняется
  );
};

const SECTOR_COLORS = {
  A: '#264653',
  B: '#2A9D8F',
  C: '#7FA12F',
  D: '#CC66CC',
  E: '#8338EC',
} as const;

const ICON_MAP = {
  OFF: 'off',
  BLOCK: 'block',
  TEMP_BLOCK: 'temp-block',
  BOOK: 'book',
  CLEAR: 'clear',
} as const;

const ItemSeatComponent: FC<IItemSeatProps> = ({
  sector,
  icon = null,
  isDisabled = false,
  isSelected = false,
  onClick,
  seatNumber,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const iconColor =
    isDisabled || isSelected ? '#8E8E8E' : SECTOR_COLORS[sector];
  const sectorClass = `sector-${sector.toLowerCase()}`;

  const getIconComponent = () => {
    if (!icon) return null;
    const iconName = ICON_MAP[icon];
    return <Icon name={iconName} color={iconColor} />;
  };

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
  };

  return (
    <button
      ref={buttonRef}
      className={`item-seat ${sectorClass} ${isDisabled ? 'disabled' : ''} ${
        isSelected ? 'selected' : ''
      } ${icon ? 'icon' : ''}`}
      onClick={handleClick}
      aria-pressed={isSelected}
      disabled={isDisabled}
      data-row={props['data-row']}
      data-seat={props['data-seat']}
      title={`${seatNumber}`}
    >
      {icon && getIconComponent()}
    </button>
  );
};

export const ItemSeat = memo(ItemSeatComponent, arePropsEqual);
