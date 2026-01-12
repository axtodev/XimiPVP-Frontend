import React, { useState, useEffect } from 'react';
import '../style/nav.css';
import { LayoutDashboard, MessageCircle, ShoppingCart, Users, ShieldBan, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {isMobile && (
        <button 
          className="burger-menu"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      )}
      
      {isMobile && isOpen && (
        <div 
          className="nav-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      
      <nav className={`${isOpen ? 'nav-open' : ''} ${isMobile ? 'nav-mobile' : ''}`}>
        <ul>
          <li 
            onClick={() => handleNavClick('/')}
            className={isActive('/') ? 'active' : ''}
          >
            <LayoutDashboard /> Home
          </li>
          <li 
            onClick={() => handleNavClick('/staff')}
            className={isActive('/staff') ? 'active' : ''}
          >
            <Users /> Staff
          </li>
          <li 
            onClick={() => handleNavClick('/forum')}
            className={isActive('/forum') ? 'active' : ''}
          >
            <MessageCircle /> Forum
          </li>
          <li 
            onClick={() => handleNavClick('store.ximipvp.eu')}
            className={isActive('store.ximipvp.eu') ? 'active' : ''}
          >
            <ShoppingCart /> Store
          </li>
          <li 
            onClick={() => handleNavClick('/bans')}
            className={isActive('/bans') ? 'active' : ''}
          >
            <ShieldBan/> Bans
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Nav;
