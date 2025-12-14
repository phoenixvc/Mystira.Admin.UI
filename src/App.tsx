import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ScenariosPage from './pages/ScenariosPage';
import MediaPage from './pages/MediaPage';
import ProtectedRoute from './ProtectedRoute';

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
          <Route path="admin/media" element={<MediaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
