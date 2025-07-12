import { FC } from "react";
import { Table } from "@sochipark-apps-mono-frontend/ui";
import { Devices } from "../model/types";

interface DevicesTableProps {
  data: {
    columns: { key: string; title: string }[];
    rows: Devices[];
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  showPlayButton?: boolean;
}

export const DevicesTable: FC<DevicesTableProps> = ({
  data,
  onEdit,
  onDelete,
  showPlayButton = true,
}) => {
  return (
    <Table
      data={data}
      showPlayButton={showPlayButton}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};
