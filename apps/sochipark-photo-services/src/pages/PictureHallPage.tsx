import { HallManagement } from '@sochipark-apps-mono-frontend/sochipark-apk-features';
import { HeaderPage } from "@sochipark-apps-mono-frontend/ui";

export const PictureHallPage = () => {
  return (
    <div>
      <HeaderPage
        title="Управление залом №7 на мероприятие №4 по состоянию на 17.03.2025"
        onClick={() => {}}
        showSelect={true}
        showCalendarInput={true}
        showButton={false}
      />
      <HallManagement />
    </div>
  );
};
