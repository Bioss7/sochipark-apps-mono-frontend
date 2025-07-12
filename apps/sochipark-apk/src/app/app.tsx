import '@styles/global.scss';
import { Layout } from '@sochipark-apps-mono-frontend/ui';
import { Route, Routes } from 'react-router-dom';
import { UIKit } from '../pages/UIKit';
import { EventsPage } from '../pages/EventsPage';
import { HallsPage } from '../pages/HallsPage';
import { PeriodsPage } from '../pages/PeriodsPage';
import { SchedulerPage } from '../pages/SchedulerPage';
import { PictureHallPage } from '../pages/PictureHallPage';
import { DevicesPage } from '../pages/DevicesPage';
import { TicketsPage } from '../pages/TicketsPage';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/ui" element={<UIKit />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/halls" element={<HallsPage />} />
        <Route path="/periods" element={<PeriodsPage />} />
        <Route path="/scheduler" element={<SchedulerPage />} />
        <Route path="/picture-hall" element={<PictureHallPage />} />
        <Route path="/devices" element={<DevicesPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
