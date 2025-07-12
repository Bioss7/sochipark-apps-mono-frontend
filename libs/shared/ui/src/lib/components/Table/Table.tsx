import { FC, useState } from "react";
import { IconButton } from "../IconButton";
import "./styles.scss";

interface TableColumn {
  key: string;
  title: string;
  className?: string;
}

interface TableDataItem {
  id: string;
  [key: string]: any;
}

interface TableData {
  columns: TableColumn[];
  rows: TableDataItem[];
}

interface TableFooterData {
  booked?: number;
  totalSeats?: number;
}

interface TableProps {
  data: TableData;
  showPlayButton?: boolean;
  showActions?: boolean;
  showFooter?: boolean;
  footerData?: TableFooterData;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const Table: FC<TableProps> = ({
  data,
  showPlayButton = false,
  showActions = true,
  showFooter = false,
  footerData = {},
  onEdit,
  onDelete,
}) => {
  const [activeItems, setActiveItems] = useState<Record<string, boolean>>({});

  const formatTime = (timeString: string) => {
    if (timeString.length === 6) {
      return `${timeString.slice(0, 2)}:${timeString.slice(
        2,
        4
      )}:${timeString.slice(4)}`;
    }
    return timeString;
  };

  const toggleItem = (id: string) => {
    setActiveItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr className={showFooter ? "table-total" : undefined}>
            {showPlayButton && <th className="table-play"></th>}
            <th className="table-number">№</th>
            {data.columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.title}
              </th>
            ))}
            {showActions && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((item) => (
            <tr key={item.id}>
              {showPlayButton && (
                <td className="table-play">
                  <IconButton
                    iconName={activeItems[item.id] ? "pause" : "start"}
                    onClick={() => toggleItem(item.id)}
                  />
                </td>
              )}
              <td className="table-number">{item.id}</td>
              {data.columns.map((column) => (
                <td key={`${item.id}-${column.key}`}>
                  {column.key === "startTime"
                    ? formatTime(item[column.key])
                    : item[column.key]}
                </td>
              ))}
              {showActions && (
                <td>
                  <div className="table-actions">
                    <IconButton
                      iconName="edit"
                      onClick={() => onEdit?.(item.id)}
                    />
                    <IconButton
                      iconName="delete"
                      onClick={() => onDelete?.(item.id)}
                    />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        {showFooter && (
          <tfoot>
            {footerData.booked && (
              <tr className="table-total">
                <td colSpan={2}>Забронировано:</td>
                <td>{footerData.booked}</td>
              </tr>
            )}
            {footerData.totalSeats && (
              <tr className="table-total">
                <td colSpan={2}>Всего посадочных мест в зале:</td>
                <td>{footerData.totalSeats}</td>
              </tr>
            )}
          </tfoot>
        )}
      </table>
    </div>
  );
};
