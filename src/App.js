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
  const [activePage, setActivePage] = useState('home'); 

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
             <li><a href="#" onClick={() => { setActivePage('home'); setMenuOpen(false); }}>Home</a></li>
            <li><a href="#" onClick={() => { setActivePage('about'); setMenuOpen(false); }}>About us</a></li>
            <li><a href="#" onClick={() => { setActivePage('contact'); setMenuOpen(false); }}>Contact</a></li>
            <li><a href="#" onClick={() => { setActivePage('faqs'); setMenuOpen(false); }}>FAQs</a></li>
          </ul>
        </nav>
      </div>

      {/* MAIN BODY */}
      <main className="main">
         {activePage === 'home' && (
          <div>
            <p className='maintext'>Our best sellers</p>
          
          </div>
        )}

        {activePage === 'about' && (
            <div style={{width: '30%', justifySelf: 'center'}}>
              <section style={{textAlign: 'left'}}>
                <h2 className="text-3xl font-semibold mb-4">About us</h2>
                <p className="mb-4">
                  What started as a craft market stall more than 15 years ago has grown into in a much loved business and income to supplement my fulltime teachers salary.
                </p>
                <p className="mb-4">
                  All our items are handmade in Cape Town, South Africa and we have been successfully selling online since 2019.
                </p>
                <p>
                  Should you not find an item that is 100% to your liking or colour scheme, we are more
                </p>
              </section>
          </div>
        )}

        {activePage === 'contact' && (
            <div style={{width: '20%', justifySelf: 'center', marginLeft: '15%'}}>
              <section style={{textAlign: 'left'}}>
                <h2 className="text-3xl font-semibold mb-6">Contact</h2>

                <div className="mb-4">
                  <p style={{textDecoration: 'underline', fontWeight: 'bolder'}}>Email</p>
                  <p className="text-gray-700">hopeinheartsdecor@gmail.com</p>
                </div>

                <div>
                  <p style={{textDecoration: 'underline', fontWeight: 'bolder'}}>Phone or WhatsApp</p>
                  <p className="text-gray-700">084 655 4902</p>
                </div>
              </section>
          </div>
        )}

        {activePage === 'faqs' && (
            <div style={{width: '30%', justifySelf: 'center'}}>
              <section className="max-w-xl mx-auto p-6 text-gray-800 space-y-4">
                  <h2 className="text-3xl font-semibold mb-4">FAQs</h2>

                  <p>
                    <strong>Do we customise our products?</strong> Yes, we are more than willing to adjust our colours, fonts and themes to suit your specific needs. Just communicate this in the notes section on checkout.
                  </p>

                  <p>
                    <strong>Lead time?</strong> Lead time is normally 7 - 10 working days from order confirmation, given that most items are customised with names etc.{" "}
                    <a style={{textDecoration: 'underline'}}>This time could be shorter for regular stock items.</a> Allow a further few days for courier delivery in remote lying areas.
                  </p>

                  <p>
                    <strong>Collection of items possible?</strong> Yes, we are located in Durbanville, Cape Town, should you prefer to collect your items.
                  </p>

                  <p>
                    <strong>Do you have a physical shop?</strong> No, we are an online store only.
                  </p>

                  <p>
                    <strong>Tracking number provided?</strong> Yes, once an item has been collected by our various courier partner, we will provide you with it.
                  </p>
                </section>
          </div>
        )}

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
