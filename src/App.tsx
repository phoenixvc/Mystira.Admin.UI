import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import BadgesPage from "./pages/BadgesPage";
import BundlesPage from "./pages/BundlesPage";
import CharacterMapsPage from "./pages/CharacterMapsPage";
import CreateBadgePage from "./pages/CreateBadgePage";
import CreateCharacterMapPage from "./pages/CreateCharacterMapPage";
import CreateMasterDataPage from "./pages/CreateMasterDataPage";
import CreateScenarioPage from "./pages/CreateScenarioPage";
import DashboardPage from "./pages/DashboardPage";
import EditBadgePage from "./pages/EditBadgePage";
import EditCharacterMapPage from "./pages/EditCharacterMapPage";
import EditMasterDataPage from "./pages/EditMasterDataPage";
import EditScenarioPage from "./pages/EditScenarioPage";
import ImportBadgePage from "./pages/ImportBadgePage";
import ImportBundlePage from "./pages/ImportBundlePage";
import ImportCharacterMapPage from "./pages/ImportCharacterMapPage";
import ImportMediaPage from "./pages/ImportMediaPage";
import ImportScenarioPage from "./pages/ImportScenarioPage";
import LoginPage from "./pages/LoginPage";
import MasterDataPage from "./pages/MasterDataPage";
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
          <Route path="admin/scenarios/create" element={<CreateScenarioPage />} />
          <Route path="admin/scenarios/edit/:id" element={<EditScenarioPage />} />
          <Route path="admin/media" element={<MediaPage />} />
          <Route path="admin/media/import" element={<ImportMediaPage />} />
          <Route path="admin/badges" element={<BadgesPage />} />
          <Route path="admin/badges/import" element={<ImportBadgePage />} />
          <Route path="admin/badges/create" element={<CreateBadgePage />} />
          <Route path="admin/badges/edit/:id" element={<EditBadgePage />} />
          <Route path="admin/bundles" element={<BundlesPage />} />
          <Route path="admin/bundles/import" element={<ImportBundlePage />} />
          <Route path="admin/character-maps" element={<CharacterMapsPage />} />
          <Route path="admin/character-maps/import" element={<ImportCharacterMapPage />} />
          <Route path="admin/character-maps/create" element={<CreateCharacterMapPage />} />
          <Route path="admin/character-maps/edit/:id" element={<EditCharacterMapPage />} />
          <Route path="admin/master-data/:type" element={<MasterDataPage />} />
          <Route path="admin/master-data/:type/create" element={<CreateMasterDataPage />} />
          <Route path="admin/master-data/:type/edit/:id" element={<EditMasterDataPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
