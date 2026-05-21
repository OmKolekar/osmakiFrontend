import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import "../../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-logo">
          OSMAKI
        </Link>

        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/products">New Arrivals</NavLink>
          <NavLink to="/product-details">Best Sellers</NavLink>
        </div>

        <div className="nav-actions">
          <span>Cart</span>
          {user ? (
            <ProfileDropdown user={user} onLogout={logout} />
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

