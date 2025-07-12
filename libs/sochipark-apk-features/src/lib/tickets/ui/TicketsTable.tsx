import { FC } from "react";
import { Table } from "@sochipark-apps-mono-frontend/ui";
import { Tickets } from "../model/types";

interface TicketsTableProps {
  data: {
    columns: { key: string; title: string }[];
    rows: Tickets[];
  };
}

export const TicketsTable: FC<TicketsTableProps> = ({ data }) => {
  return (
    <Table
      data={data}
      showActions={false}
      showFooter={true}
      footerData={{
        booked: 600,
        totalSeats: 800,
      }}
    />
  );
};
