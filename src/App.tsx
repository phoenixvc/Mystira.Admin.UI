import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import BadgesPage from "./pages/BadgesPage";
import BundlesPage from "./pages/BundlesPage";
import CharacterMapsPage from "./pages/CharacterMapsPage";
import DashboardPage from "./pages/DashboardPage";
import ImportBundlePage from "./pages/ImportBundlePage";
import MasterDataPage from "./pages/MasterDataPage";
import ImportCharacterMapPage from "./pages/ImportCharacterMapPage";
import ImportMediaPage from "./pages/ImportMediaPage";
import ImportScenarioPage from "./pages/ImportScenarioPage";
import LoginPage from "./pages/LoginPage";
import MediaPage from "./pages/MediaPage";
import ScenariosPage from "./pages/ScenariosPage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin" replace />} />
          <Route path="admin" element={<DashboardPage />} />
          <Route path="admin/scenarios" element={<ScenariosPage />} />
          <Route path="admin/scenarios/import" element={<ImportScenarioPage />} />
          <Route path="admin/media" element={<MediaPage />} />
          <Route path="admin/media/import" element={<ImportMediaPage />} />
          <Route path="admin/badges" element={<BadgesPage />} />
          <Route path="admin/bundles" element={<BundlesPage />} />
          <Route path="admin/bundles/import" element={<ImportBundlePage />} />
          <Route path="admin/character-maps" element={<CharacterMapsPage />} />
          <Route
            path="admin/character-maps/import"
            element={<ImportCharacterMapPage />}
          />
          <Route
            path="admin/master-data/:type"
            element={<MasterDataPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
