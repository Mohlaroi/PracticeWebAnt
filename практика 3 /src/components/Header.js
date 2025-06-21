import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <header className="header">
        <div className="header__content">
          <div className="header__logo">
            <NavLink to="/characters">
              <img src="/assets/images/logo-black 1.svg" alt="Logo" />
            </NavLink>
          </div>
          <nav className="header__nav">
            <ul className="header__nav nav">
              <li className="nav__menu-item"><NavLink to="/characters">Characters</NavLink></li>
              <li className="nav__menu-item"><NavLink to="/locations">Locations</NavLink></li>
              <li className="nav__menu-item"><NavLink to="/episodes">Episodes</NavLink></li>
            </ul>
          </nav>
          <button className={`burger-btn ${menuOpen ? 'open' : ''}`} aria-label="Open" onClick={toggleMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
      <nav className={`header__nav mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="header__nav mobile-menu__items" onClick={() => setMenuOpen(false)}>
          <li><NavLink to="/characters">Characters</NavLink></li>
          <li><NavLink to="/locations">Locations</NavLink></li>
          <li><NavLink to="/episodes">Episodes</NavLink></li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
