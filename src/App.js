import React, { useState } from 'react';
import './App.css';
import Logo from './Images/logo.png'

// Material‑UI icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="main-container">
      {/* HEADER 1 */}
      <header className="header">
        <p>Welcome to our store</p>
        <p>Free shipping on all orders over R500</p>
      </header>

      {/* HEADER 2 */}
      <header className="header1">
        <button
          className="header__menu-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon fontSize="large" />
        </button>
        
        <div className='imgpos'>
          <img src={Logo} className='imgsize' />
        </div>
      </header>

      <div>
        <hr className='borderhr'/>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <button
          className="mobile-menu__close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <CloseIcon fontSize="large" />
        </button>
        <div className="mobile-menu__logo">
          {/* Replace with your real logo if you have one */}
          <h1 className="mobile-menu__logo-text">Menu</h1>
        </div>
        <nav className="mobile-menu__nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about-us">About us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/faqs">FAQs</a></li>
          </ul>
        </nav>
      </div>

      {/* MAIN BODY (empty placeholder) */}
      <main className="main">
        <p className='maintext'>Our best sellers</p>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__social">
          <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
            <FacebookIcon fontSize="large" />
          </a>
          <a href="https://instagram.com/yourpage" target="_blank" rel="noopener noreferrer">
            <InstagramIcon fontSize="large" />
          </a>
        </div>
        <p className="footer__copy">
          © 2025, Hope‑in‑Hearts Nursery Decor Powered by Hope-in-Hearts-Development
        </p>
      </footer>
    </div>
  );
}

export default App;
