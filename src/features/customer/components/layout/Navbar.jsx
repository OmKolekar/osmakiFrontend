import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SlBag } from "react-icons/sl";
import { useAuth } from "../../../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import ProfileDropdown from "./ProfileDropdown";
import "../../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {isMenuOpen && (
        <div className="nav-backdrop" onClick={() => setIsMenuOpen(false)}></div>
      )}
      <div className="navbar-inner">
        <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
          𝓞SMAKÌ
        </Link>

        {/* Hamburger Menu Trigger */}
        <button 
          className={`nav-hamburger ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? "mobile-open" : ""}`}>
          <NavLink to="/" end onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          <NavLink to="/men" onClick={() => setIsMenuOpen(false)}>Men</NavLink>
          <NavLink to="/women" onClick={() => setIsMenuOpen(false)}>Women</NavLink>
          <NavLink to="/trending" onClick={() => setIsMenuOpen(false)}>Trending</NavLink>
        </div>

        <div className="nav-actions">
          <NavLink to="/cart" className="nav-cart-btn" onClick={() => setIsMenuOpen(false)}>
            <SlBag className="nav-bag-icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
          {user ? (
            <ProfileDropdown user={user} onLogout={logout} />
          ) : (
            <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

