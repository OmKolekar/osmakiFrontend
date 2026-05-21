import { useState, useEffect, useRef } from "react";

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
