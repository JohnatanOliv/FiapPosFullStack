import { useState } from 'react';
import './MobileNav.css';

export default function MobileNav({ children, logo, title, actions = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="mobile-nav-wrapper">
      <header className="mobile-nav-header">
        <div className="mobile-nav-brand">
          <span className="mobile-nav-logo">{logo}</span>
          <span className="mobile-nav-title">{title}</span>
        </div>

        <div className="mobile-nav-actions">
          {actions.map((action, idx) => (
            <button
              key={idx}
              className="mobile-action-btn"
              onClick={action.onClick}
              title={action.label}
            >
              {action.icon}
            </button>
          ))}

          <button
            className={`mobile-hamburger ${isOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            {children}
          </nav>
        </div>
      )}
    </div>
  );
}
