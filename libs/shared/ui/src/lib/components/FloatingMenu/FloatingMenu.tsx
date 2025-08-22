import { FC, memo, useState, useEffect, useRef } from "react";
import { MenuButton } from "./components/MenuButton";
import "./styles.scss";
import {
  BlockIcon,
  DisableIcon,
  ReserveIcon,
  TemporaryBlockIcon,
  ClearIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  SectorAIcon,
  SectorBIcon,
  SectorCIcon,
  SectorDIcon,
  SectorEIcon,
} from "../Icons";
import { Input } from "../Input";

interface FloatingMenuProps {
  selectedSeats?: Set<string>;
  onMenuToggle?: (isHidden: boolean) => void;
  initialIsHidden?: boolean;
  onSeatRangeChange?: (from: string, to: string) => void;
  onActionClick?: (
    action: "disable" | "block" | "temporaryBlock" | "reserve" | "clear"
  ) => void;
  onSectorChange?: (sector: "A" | "B" | "C" | "D" | "E") => void;
  currentSector?: "A" | "B" | "C" | "D" | "E";
  isFixed?: boolean;
}

type MenuAction = "disable" | "block" | "temporaryBlock" | "reserve" | "clear";
type SectorAction = "sectorA" | "sectorB" | "sectorC" | "sectorD" | "sectorE";

const actionIcons = {
  disable: <DisableIcon />,
  block: <BlockIcon />,
  temporaryBlock: <TemporaryBlockIcon />,
  reserve: <ReserveIcon />,
  clear: <ClearIcon />,
};

const PLACE_ACTIONS = [
  { id: "disable", icon: actionIcons.disable, label: "Отключить" },
  { id: "block", icon: actionIcons.block, label: "Блокировать" },
  { id: "temporaryBlock", icon: actionIcons.temporaryBlock, label: "Временная блокировка" },
  { id: "reserve", icon: actionIcons.reserve, label: "Бронировать" },
  { id: "clear", icon: actionIcons.clear, label: "Очистить" },
];

const SECTOR_ACTIONS = [
  { id: "sectorA", icon: <SectorAIcon /> },
  { id: "sectorB", icon: <SectorBIcon /> },
  { id: "sectorC", icon: <SectorCIcon /> },
  { id: "sectorD", icon: <SectorDIcon /> },
  { id: "sectorE", icon: <SectorEIcon /> },
];

// лучше передавать через проп
const SEATS_PER_ROW = 53;

const getSeatRanges = (selectedSeats: Set<string>) => {
  if (!selectedSeats || selectedSeats.size === 0) return { from: "", to: "" };

  const seatNumbers = Array.from(selectedSeats)
    .map((seat) => {
      const [row, seatIndex] = seat.split("-").map(Number);
      return row * SEATS_PER_ROW + seatIndex + 1;
    })
    .sort((a, b) => a - b);

  return {
    from: seatNumbers[0].toString(),
    to: seatNumbers[seatNumbers.length - 1].toString(),
  };
};

export const FloatingMenu: FC<FloatingMenuProps> = memo(
  ({
    selectedSeats = new Set<string>(),
    onMenuToggle,
    initialIsHidden = true,
    onSeatRangeChange,
    onActionClick,
    onSectorChange,
    currentSector = "A",
    isFixed = false,
  }) => {
    const [isHidden, setIsHidden] = useState(initialIsHidden);
    const [inputValues, setInputValues] = useState({ from: "", to: "" });
    const isEditing = useRef(false); // следим, редактирует ли пользователь

    // синхронизация из selectedSeats только если пользователь НЕ редактирует
    useEffect(() => {
      if (isEditing.current) return;
      if (selectedSeats.size === 0) {
        setInputValues({ from: "", to: "" });
        return;
      }
      setInputValues(getSeatRanges(selectedSeats));
    }, [selectedSeats]);

    const handleChange = (field: "from" | "to", value: string) => {
      isEditing.current = true; // блокируем внешние апдейты
      setInputValues((prev) => {
        const updated = { ...prev, [field]: value };
        onSeatRangeChange?.(updated.from, updated.to);
        return updated;
      });
    };

    const handleBlur = () => {
      isEditing.current = false; // после завершения ввода разрешаем внешние апдейты
    };

    const toggleMenu = () => {
      setIsHidden((prev) => {
        const newState = !prev;
        onMenuToggle?.(newState);
        return newState;
      });
    };

    return (
      <div className={`floating-menu ${isHidden ? "hidden" : ""} ${isFixed ? "" : "static"}`}>
        <div className="floating-menu__elements">
          <div className="floating-menu__title">Управление местами</div>
          {isHidden && (
            <div className="floating-menu__actions">
              {PLACE_ACTIONS.map((action) => (
                <MenuButton
                  key={action.id}
                  icon={action.icon}
                  label={action.label}
                  isActive={false}
                  isHidden={isHidden}
                  onClick={() => onActionClick?.(action.id as MenuAction)}
                  className="button-place"
                />
              ))}
            </div>
          )}
        </div>

        <div className="floating-menu__elements">
          <div className="floating-menu__title">Управление секторами</div>
          {isHidden && (
            <div className="floating-menu__actions">
              {SECTOR_ACTIONS.map((action) => (
                <MenuButton
                  key={action.id}
                  icon={action.icon}
                  isActive={currentSector === action.id.replace("sector", "")}
                  isHidden={isHidden}
                  onClick={() => onSectorChange?.(action.id.replace("sector", "") as any)}
                  className="button-sector"
                />
              ))}
            </div>
          )}
        </div>

        <div className="floating-menu__elements">
          <div className="floating-menu__title">Выбранные места</div>
          {isHidden && (
            <div className="floating-menu__actions floating-menu__actions--input">
              <Input
                type="number"
                placeholder="От"
                value={inputValues.from}
                onChange={(v) => handleChange("from", v)}
                onBlur={handleBlur}
              />
              <Input
                type="number"
                placeholder="До"
                value={inputValues.to}
                onChange={(v) => handleChange("to", v)}
                onBlur={handleBlur}
              />
            </div>
          )}
        </div>

        <button className="button-toggle" onClick={toggleMenu} aria-label={isHidden ? "Показать меню" : "Скрыть меню"}>
          {isHidden ? <ArrowDownIcon /> : <ArrowUpIcon />}
        </button>
      </div>
    );
  }
);
