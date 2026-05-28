import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function ProfileDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  // Extract initials from user name
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <button
        className="avatar-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="View profile"
      >
        <span className="avatar-initials">{initials}</span>
      </button>

      {isOpen && (
        <div className="profile-dropdown-menu">
          <div className="profile-menu-header">
            <div className="menu-avatar-large">
              <span>{initials}</span>
            </div>
            <div className="menu-user-meta">
              <span className="menu-user-name">{user.name}</span>
            </div>
          </div>

          <div className="profile-menu-details">
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value" title={user.email}>
                {user.email}
              </span>
            </div>
            {user.phone && (
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{user.phone}</span>
              </div>
            )}
          </div>

          <div className="profile-menu-divider"></div>

          <Link
            to="/orders"
            onClick={() => setIsOpen(false)}
            className="menu-admin-btn"
            style={{ marginBottom: "8px" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>My Orders</span>
          </Link>

          {user.role === "admin" && (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="menu-admin-btn"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
              <span>Admin Panel</span>
            </Link>
          )}

          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="menu-logout-btn"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
