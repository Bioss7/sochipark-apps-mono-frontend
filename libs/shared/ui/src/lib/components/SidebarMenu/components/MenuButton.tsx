import { FC } from "react";
import { Icon } from "../../Icon";

interface MenuButtonProps {
  iconName: string;
  label: string;
  isActive: boolean;
  isHidden: boolean;
  onClick: () => void;
}

export const MenuButton: FC<MenuButtonProps> = ({
  iconName,
  label,
  isActive,
  isHidden,
  onClick,
}) => (
  <button
    className={isActive ? "active" : ""}
    onClick={onClick}
    aria-current={isActive ? "page" : undefined}
  >
    <Icon name={iconName} size={24} />
    {!isHidden && <span>{label}</span>}
  </button>
);
