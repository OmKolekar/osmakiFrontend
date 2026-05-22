import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { useCart } from "../../../../context/CartContext";
import ProfileDropdown from "./ProfileDropdown";
import "../../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-logo">
          OSMAKI
        </Link>

        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/men">Men</NavLink>
          <NavLink to="/women">Women</NavLink>
          <NavLink to="/trending">Trending</NavLink>
        </div>

        <div className="nav-actions">
          <NavLink to="/cart" className="nav-cart-btn">
            Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
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

