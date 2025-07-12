import { TicketsTable } from "@sochipark-apps-mono-frontend/sochipark-apk-features";
import { HeaderPage } from "@sochipark-apps-mono-frontend/ui";
import { FC } from "react";

const tableData = {
  columns: [
    { key: "title", title: "Название устройства" },
    { key: "tickets", title: "Количество билетов" },
  ],
  rows: [
    {
      id: "1",
      title: "Терминал 1",
      tickets: 100,
    },
    {
      id: "2",
      title: "Терминал 2",
      tickets: 200,
    },
    {
      id: "3",
      title: "Сайт",
      tickets: 300,
    },
  ],
};

export const TicketsPage: FC = () => {
  return (
    <div>
      <HeaderPage
        title="Билеты"
        showSelect={true}
        showCalendarInput={true}
        showButton={false}
      />
      <TicketsTable data={tableData} />
    </div>
  );
};
