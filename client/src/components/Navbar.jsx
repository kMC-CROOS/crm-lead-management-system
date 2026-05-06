import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="brand">CRM Lead Manager</div>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/leads">Leads</Link>
        <button type="button" onClick={logout} className="btn btn-danger">
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
