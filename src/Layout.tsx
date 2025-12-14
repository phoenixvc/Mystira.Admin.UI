import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from './state/authStore';

function Layout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/admin">
              <i className="bi bi-dice-6-fill me-2"></i>
              Mystira Admin
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/scenarios">
                    Scenarios
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/media">
                    Media
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <button
                    id="logoutBtn"
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                    style={{ border: 'none', background: 'none', color: 'inherit' }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mt-4">
        <Outlet />
      </div>

      <footer className="border-top footer text-muted mt-auto">
        <div className="container">
          <div className="text-center py-3">
            <small>&copy; 2025 Mystira. All rights reserved.</small>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Layout;
