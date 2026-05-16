
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RegionDashboard } from './pages/RegionDashboard';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { RegionsPage } from './pages/RegionsPage';
import { VineyardsPage } from './pages/VineyardsPage';
import { VineyardWinesPage } from './pages/VineyardWinesPage';
import { VineyardDashboardPage } from './pages/VineyardDashboardPage';
import { WineDashboardPage } from './pages/WineDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/regions/:regionId" element={<RegionDashboard />} />
          <Route path="/vineyards" element={<VineyardsPage />} />
          <Route path="/regions" element={<RegionsPage />} /> 
          <Route path="/vineyards/:vineyardId/wines/:wineId" element={<WineDashboardPage />} />
          <Route path="/vineyards/:vineyardId/wines" element={<VineyardWinesPage />} />
          <Route path="/vineyards/:vineyardId" element={<VineyardDashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
