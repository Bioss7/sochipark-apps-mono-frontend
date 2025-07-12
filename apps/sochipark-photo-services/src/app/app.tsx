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
      </Routes>
    </Layout>
  );
}

export default App;
