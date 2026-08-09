import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Logo from './Images/logo.png';
import { PRODUCTS, ORDER_EMAIL, BUSINESS, formatPrice, getProductImageForColor, getProductImageIndex } from './data/products';
import { sendOrderEmail, isValidEmail } from './utils/orderEmail';
import { isOrderEmailConfigured } from './config/emailService';
import LifestyleFlow, { LifestyleStrip } from './components/LifestyleFlow';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';

const INFO_TABS = [
  { id: 'about', label: 'About us' },
  { id: 'contact', label: 'Contact' },
  { id: 'faqs', label: 'FAQs' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('shop');
  const [infoTab, setInfoTab] = useState('about');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const [selection, setSelection] = useState({
    colorId: null,
    options: {},
    quantity: 1,
    personalisation: '',
  });
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const cartCount = cart.reduce((n, i) => n + i.quantity, 0);

  const openProduct = (product) => {
    const defaultColor = product.colors[0];
    const defaultOptions = {};
    product.options.forEach((o) => {
      defaultOptions[o.id] = o.choices[0];
    });
    setSelection({
      colorId: defaultColor.id,
      options: defaultOptions,
      quantity: 1,
      personalisation: '',
    });
    setModalImageIndex(getProductImageIndex(product, defaultColor.id));
    setSelectedProduct(product);
    setModalVisible(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProduct = useCallback(() => {
    setModalVisible(false);
    document.body.style.overflow = '';
    setTimeout(() => setSelectedProduct(null), 300);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
        if (e.key === 'Escape') {
        if (orderSuccess) setOrderSuccess(null);
        else if (selectedProduct) closeProduct();
        else if (cartOpen) setCartOpen(false);
        else if (menuOpen) setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedProduct, cartOpen, menuOpen, orderSuccess, closeProduct]);

  const navigate = (page) => {
    setActivePage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedColor =
    selectedProduct?.colors.find((c) => c.id === selection.colorId) ??
    selectedProduct?.colors[0];

  const modalImages =
    selectedProduct?.images?.length > 0
      ? selectedProduct.images
      : selectedProduct
        ? [selectedProduct.image]
        : [];
  const activeModalImage =
    modalImages[modalImageIndex] ??
    getProductImageForColor(selectedProduct, selection.colorId) ??
    selectedProduct?.image;

  const selectColor = (colorId) => {
    setSelection((s) => ({ ...s, colorId }));
    if (selectedProduct) {
      setModalImageIndex(getProductImageIndex(selectedProduct, colorId));
    }
  };

  const addToCart = () => {
    if (!selectedProduct || !selectedColor) return;
    if (
      selectedProduct.personalisationRequired &&
      !selection.personalisation.trim()
    ) {
      return;
    }
    const cartItem = {
      id: `${selectedProduct.id}-${Date.now()}`,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      image: getProductImageForColor(selectedProduct, selectedColor.id),
      price: selectedProduct.priceOnRequest ? 0 : selectedProduct.price,
      priceOnRequest: !!selectedProduct.priceOnRequest,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      options: { ...selection.options },
      optionLines: selectedProduct.options.map((o) => ({
        label: o.label,
        value: selection.options[o.id],
      })),
      personalisation: selection.personalisation.trim(),
      quantity: selection.quantity,
    };
    setCart((prev) => [...prev, cartItem]);
    closeProduct();
    setCartOpen(true);
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce(
    (s, i) => s + (i.priceOnRequest ? 0 : i.price * i.quantity),
    0
  );
  const hasPriceOnRequest = cart.some((i) => i.priceOnRequest);

  const placeOrder = async () => {
    if (!cart.length || isPlacingOrder) return;

    const name = customerDetails.name.trim();
    const email = customerDetails.email.trim();
    const phone = customerDetails.phone.trim();

    if (!name) {
      setOrderError('Please enter your name so we know who to reply to.');
      return;
    }
    if (!email || !isValidEmail(email)) {
      setOrderError('Please enter a valid email address.');
      return;
    }

    setOrderError('');
    setIsPlacingOrder(true);

    const orderSnapshot = [...cart];
    const noteSnapshot = orderNote;
    const customerSnapshot = { name, email, phone };

    const result = await sendOrderEmail(
      orderSnapshot,
      noteSnapshot,
      customerSnapshot
    );

    if (!result.sent) {
      setIsPlacingOrder(false);
      if (result.error === 'not_configured') {
        setOrderError(
          `Online orders are not active yet. Please email ${ORDER_EMAIL} with your bag details.`
        );
      } else {
        setOrderError(
          result.message || `Could not send your order. Please try again or email ${ORDER_EMAIL}.`
        );
      }
      return;
    }

    setCart([]);
    setOrderNote('');
    setCustomerDetails({ name: '', email: '', phone: '' });
    setCartOpen(false);
    setIsPlacingOrder(false);

    setOrderSuccess({
      itemCount: result.itemCount,
      total: result.total,
      email: ORDER_EMAIL,
      orderRef: result.orderRef,
      sent: true,
    });
  };

  const dismissOrderSuccess = () => {
    setOrderSuccess(null);
    navigate('shop');
  };

  return (
    <div className="main-container">
      <div className="site-top">
      <div className="promo-bar">
        <p>Welcome to our store</p>
        <p className="promo-bar__highlight">Free shipping on orders over R500</p>
      </div>

      <header className="site-header">
        <button
          className="icon-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>

        <button
          className="site-header__logo"
          onClick={() => navigate('shop')}
          aria-label="Hope in Hearts home"
        >
          {!logoFailed ? (
            <img
              src={Logo}
              alt="Hope in Hearts"
              className="site-header__logo-img"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="site-header__logo-text">Hope in Hearts</span>
          )}
        </button>

        <button
          className="icon-btn cart-trigger"
          onClick={() => setCartOpen(true)}
          aria-label={`Open bag, ${cartCount} items`}
        >
          <ShoppingBagOutlinedIcon />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </header>

      <nav className="page-nav" aria-label="Main">
        <button
          className={activePage === 'shop' ? 'page-nav__link page-nav__link--active' : 'page-nav__link'}
          onClick={() => navigate('shop')}
        >
          Shop
        </button>
        <button
          className={activePage === 'info' ? 'page-nav__link page-nav__link--active' : 'page-nav__link'}
          onClick={() => navigate('info')}
        >
          Our story
        </button>
      </nav>

      <div className="header-divider" />
      </div>

      <div
        className={`menu-backdrop ${menuOpen ? 'menu-backdrop--visible' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside className={`side-menu ${menuOpen ? 'side-menu--open' : ''}`}>
        <button
          className="icon-btn side-menu__close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
        <p className="side-menu__title">Menu</p>
        <nav>
          <button onClick={() => navigate('shop')}>Shop</button>
          <button onClick={() => navigate('info')}>Our story</button>
          <button
            onClick={() => {
              setCartOpen(true);
              setMenuOpen(false);
            }}
          >
            My bag ({cartCount})
          </button>
        </nav>
      </aside>

      <main className="main">
        {activePage === 'shop' && (
          <>
            <LifestyleFlow />
            <section className="shop-section fade-in">
            <div className="shop-hero">
              <h1 className="shop-hero__title">Handmade with love</h1>
              <p className="shop-hero__subtitle">
                Soft nursery décor & gifts, crafted in Cape Town — personalised just for your
                little one.
              </p>
            </div>

            <LifestyleStrip />

            <h2 className="section-title">Our favourites</h2>

            <div className="product-grid">
              {PRODUCTS.map((product, index) => (
                <article
                  key={product.id}
                  className="product-card"
                  style={{ animationDelay: `${index * 0.08}s` }}
                  onClick={() => openProduct(product)}
                  onKeyDown={(e) => e.key === 'Enter' && openProduct(product)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="product-card__visual">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-card__img"
                      loading="lazy"
                    />
                  </div>
                  <div className="product-card__body">
                    <h3>{product.name}</h3>
                    <p className="product-card__tagline">{product.tagline}</p>
                    <div className="product-card__footer">
                      <span className="product-card__price">
                        {product.priceOnRequest
                          ? 'Price on request'
                          : `R${product.price}`}
                      </span>
                      <span className="product-card__cta">View details</span>
                    </div>
                    <div className="color-dots" aria-hidden="true">
                      {product.colors.map((c) => (
                        <span
                          key={c.id}
                          className="color-dot"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <p className="checkout-note">
              <EmailOutlinedIcon fontSize="small" />
              Place your order in one tap — we&apos;ll email you to confirm payment and delivery.
              No online card payment required.
            </p>
          </section>
          </>
        )}

        {activePage === 'info' && (
          <section className="info-section fade-in">
            <h1 className="section-title">Our story</h1>

            <div className="info-tabs" role="tablist">
              {INFO_TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={infoTab === tab.id}
                  className={`info-tab ${infoTab === tab.id ? 'info-tab--active' : ''}`}
                  onClick={() => setInfoTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="info-panel" role="tabpanel">
              {infoTab === 'about' && (
                <div className="info-content slide-up">
                  <h2>About us</h2>
                  <p>
                    What started as a craft market stall more than 15 years ago has grown into a
                    much loved business and income to supplement my full-time teacher&apos;s
                    salary.
                  </p>
                  <p>
                    All our items are handmade in Cape Town, South Africa and we have been
                    successfully selling online since 2019.
                  </p>
                  <p>
                    Should you not find an item that is 100% to your liking or colour scheme, we
                    are more than willing to adjust our colours, fonts and themes to suit your
                    specific needs. Just communicate this in the notes when you order.
                  </p>
                </div>
              )}

              {infoTab === 'contact' && (
                <div className="info-content slide-up">
                  <h2>Contact</h2>
                  <div className="contact-block">
                    <h3>Website</h3>
                    <a href={BUSINESS.website} target="_blank" rel="noopener noreferrer">
                      hopeinhearts.co.za
                    </a>
                  </div>
                  <div className="contact-block">
                    <h3>Email & orders</h3>
                    <a href={`mailto:${ORDER_EMAIL}`}>{ORDER_EMAIL}</a>
                  </div>
                  <div className="contact-block">
                    <h3>Phone or WhatsApp</h3>
                    <a href={`tel:+27${BUSINESS.phone.replace(/\s/g, '').replace(/^0/, '')}`}>
                      {BUSINESS.phone}
                    </a>
                  </div>
                  <p className="contact-note">
                    We&apos;re based in Durbanville, Cape Town — collection is welcome.
                  </p>
                </div>
              )}

              {infoTab === 'faqs' && (
                <div className="info-content slide-up">
                  <h2>FAQs</h2>
                  <details className="faq-item" open>
                    <summary>Do you customise products?</summary>
                    <p>
                      Yes! We adjust colours, fonts and themes to suit your needs. Mention your
                      wishes in the order notes or personalisation field.
                    </p>
                  </details>
                  <details className="faq-item">
                    <summary>What is the lead time?</summary>
                    <p>
                      Normally 7–10 working days from order confirmation, as most items are
                      personalised. Regular stock items may be quicker. Allow a few extra days for
                      courier delivery in remote areas.
                    </p>
                  </details>
                  <details className="faq-item">
                    <summary>Can I collect my order?</summary>
                    <p>
                      Yes — we are in Durbanville, Cape Town, if you prefer to collect instead of
                      delivery.
                    </p>
                  </details>
                  <details className="faq-item">
                    <summary>Do you have a physical shop?</summary>
                    <p>No — we are an online store only, with optional collection.</p>
                  </details>
                  <details className="faq-item">
                    <summary>Will I get a tracking number?</summary>
                    <p>
                      Yes. Once your parcel is collected by our courier partner, we will send you
                      the tracking details.
                    </p>
                  </details>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Product detail modal */}
      {selectedProduct && (
        <div
          className={`modal-root ${modalVisible ? 'modal-root--visible' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <button className="modal-backdrop" onClick={closeProduct} aria-label="Close" />
          <div className={`product-modal ${modalVisible ? 'product-modal--visible' : ''}`}>
            <button className="modal-close icon-btn" onClick={closeProduct} aria-label="Close">
              <CloseIcon />
            </button>

            <div className="product-modal__media">
              <div className="product-modal__hero">
                <img
                  src={activeModalImage}
                  alt={selectedProduct.name}
                  className="product-modal__img"
                />
              </div>

              {modalImages.length > 1 && (
                <div className="product-modal__gallery" aria-label="Product photos">
                  {modalImages.map((img, index) => (
                    <button
                      key={`${selectedProduct.id}-img-${index}`}
                      type="button"
                      className={`product-modal__thumb ${
                        modalImageIndex === index ? 'product-modal__thumb--active' : ''
                      }`}
                      onClick={() => setModalImageIndex(index)}
                      aria-label={`View photo ${index + 1}`}
                      aria-current={modalImageIndex === index}
                    >
                      <img src={img} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="product-modal__content">
              <h2 id="product-modal-title">{selectedProduct.name}</h2>
              <p
                className={
                  selectedProduct.priceOnRequest
                    ? 'product-modal__price product-modal__price--request'
                    : 'product-modal__price'
                }
              >
                {formatPrice(selectedProduct, selection.quantity)}
              </p>
              <p className="product-modal__desc">{selectedProduct.description}</p>

              {selectedProduct.colors.length > 1 && (
                <div className="option-group">
                  <span className="option-label">Colour</span>
                  <div className="color-picker">
                    {selectedProduct.colors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={`color-swatch ${
                          selection.colorId === c.id ? 'color-swatch--active' : ''
                        } ${c.id === 'white' ? 'color-swatch--white' : ''}`}
                        style={{ backgroundColor: c.hex }}
                        onClick={() => selectColor(c.id)}
                        aria-label={c.name}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <span className="color-name">{selectedColor?.name}</span>
                </div>
              )}

              {selectedProduct.options.map((opt) => (
                <div className="option-group" key={opt.id}>
                  <label className="option-label" htmlFor={`opt-${opt.id}`}>
                    {opt.label}
                  </label>
                  <select
                    id={`opt-${opt.id}`}
                    className="option-select"
                    value={selection.options[opt.id]}
                    onChange={(e) =>
                      setSelection((s) => ({
                        ...s,
                        options: { ...s.options, [opt.id]: e.target.value },
                      }))
                    }
                  >
                    {opt.choices.map((ch) => (
                      <option key={ch} value={ch}>
                        {ch}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="option-group">
                <label className="option-label" htmlFor="personalisation">
                  {selectedProduct.personalisationLabel || 'Personalisation (name / text)'}
                </label>
                <input
                  id="personalisation"
                  type="text"
                  className="option-input"
                  placeholder={
                    selectedProduct.personalisationPlaceholder || 'e.g. Emma Rose'
                  }
                  value={selection.personalisation}
                  onChange={(e) =>
                    setSelection((s) => ({ ...s, personalisation: e.target.value }))
                  }
                  required={selectedProduct.personalisationRequired}
                />
              </div>

              <div className="option-group quantity-row">
                <span className="option-label">Quantity</span>
                <div className="quantity-control">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() =>
                      setSelection((s) => ({
                        ...s,
                        quantity: Math.max(1, s.quantity - 1),
                      }))
                    }
                    aria-label="Decrease quantity"
                  >
                    <RemoveIcon fontSize="small" />
                  </button>
                  <span className="qty-value">{selection.quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() =>
                      setSelection((s) => ({ ...s, quantity: s.quantity + 1 }))
                    }
                    aria-label="Increase quantity"
                  >
                    <AddIcon fontSize="small" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={addToCart}
                disabled={
                  selectedProduct.personalisationRequired &&
                  !selection.personalisation.trim()
                }
              >
                Add to bag
                {!selectedProduct.priceOnRequest &&
                  ` — R${selectedProduct.price * selection.quantity}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      <div
        className={`cart-drawer-root ${cartOpen ? 'cart-drawer-root--visible' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <button
          className="modal-backdrop"
          onClick={() => setCartOpen(false)}
          aria-label="Close bag"
        />
        <aside className={`cart-drawer ${cartOpen ? 'cart-drawer--open' : ''}`}>
          <div className="cart-drawer__header">
            <h2>Your bag</h2>
            <button
              className="icon-btn"
              onClick={() => setCartOpen(false)}
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="cart-empty">Your bag is empty — tap a product to start.</p>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="cart-item__thumb"
                      />
                    ) : (
                      <div
                        className="cart-item__swatch"
                        style={{ background: item.colorHex }}
                      />
                    )}
                    <div className="cart-item__info">
                      <strong>{item.name}</strong>
                      <span className="cart-item__meta">{item.colorName}</span>
                      {(item.optionLines ||
                        Object.entries(item.options).map(([k, v]) => ({
                          label: k,
                          value: v,
                        }))
                      ).map(({ label, value }) => (
                        <span key={`${label}-${value}`} className="cart-item__meta">
                          {label}: {value}
                        </span>
                      ))}
                      {item.personalisation && (
                        <span className="cart-item__meta">
                          &ldquo;{item.personalisation}&rdquo;
                        </span>
                      )}
                      <div className="cart-item__actions">
                        <div className="quantity-control quantity-control--small">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateCartQty(item.id, -1)}
                            aria-label="Decrease"
                          >
                            <RemoveIcon fontSize="small" />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateCartQty(item.id, 1)}
                            aria-label="Increase"
                          >
                            <AddIcon fontSize="small" />
                          </button>
                        </div>
                        <span className="cart-item__price">
                          {item.priceOnRequest
                            ? 'Price on request'
                            : `R${item.price * item.quantity}`}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>{hasPriceOnRequest ? 'Estimated total' : 'Total'}</span>
                  <strong>
                    {hasPriceOnRequest && cartTotal === 0
                      ? 'Price on request'
                      : `R${cartTotal}${hasPriceOnRequest ? '+' : ''}`}
                  </strong>
                </div>
                {hasPriceOnRequest && (
                  <p className="cart-footer__note" style={{ marginTop: 0 }}>
                    Custom items are priced per order — we&apos;ll confirm the final
                    amount when we reply to you.
                  </p>
                )}

                <p className="cart-footer__heading">Your details</p>
                <div className="cart-customer-fields">
                  <div className="cart-field">
                    <label className="cart-note-label" htmlFor="customer-name">
                      Full name *
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      className="option-input"
                      placeholder="Your name"
                      value={customerDetails.name}
                      onChange={(e) =>
                        setCustomerDetails((d) => ({ ...d, name: e.target.value }))
                      }
                      autoComplete="name"
                    />
                  </div>
                  <div className="cart-field">
                    <label className="cart-note-label" htmlFor="customer-email">
                      Email *
                    </label>
                    <input
                      id="customer-email"
                      type="email"
                      className="option-input"
                      placeholder="you@email.com"
                      value={customerDetails.email}
                      onChange={(e) =>
                        setCustomerDetails((d) => ({ ...d, email: e.target.value }))
                      }
                      autoComplete="email"
                    />
                  </div>
                  <div className="cart-field">
                    <label className="cart-note-label" htmlFor="customer-phone">
                      Phone / WhatsApp
                    </label>
                    <input
                      id="customer-phone"
                      type="tel"
                      className="option-input"
                      placeholder="084 000 0000"
                      value={customerDetails.phone}
                      onChange={(e) =>
                        setCustomerDetails((d) => ({ ...d, phone: e.target.value }))
                      }
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <label className="cart-note-label" htmlFor="order-note">
                  Extra notes (optional)
                </label>
                <textarea
                  id="order-note"
                  className="cart-note-input"
                  placeholder="Delivery address, gift message, colour tweaks…"
                  rows={3}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                />
                {orderError && <p className="cart-error">{orderError}</p>}
                <p className="cart-footer__note">
                  Your order is sent instantly to Hope in Hearts — no email app needed. We&apos;ll
                  reply to you to confirm payment and delivery.
                </p>
                <button
                  type="button"
                  className="btn-primary btn-primary--full"
                  onClick={placeOrder}
                  disabled={isPlacingOrder || !isOrderEmailConfigured()}
                >
                  <EmailOutlinedIcon fontSize="small" />
                  {isPlacingOrder ? 'Sending your order…' : 'Place order'}
                </button>
                {!isOrderEmailConfigured() && (
                  <p className="cart-footer__setup">
                    {process.env.NODE_ENV === 'development' ? (
                      <>
                        Dev: add <code>REACT_APP_WEB3FORMS_ACCESS_KEY</code> to{' '}
                        <code>.env.local</code> (see .env.example), then restart{' '}
                        <code>npm start</code>.
                      </>
                    ) : (
                      <>
                        Online ordering is being set up. Please email{' '}
                        <a href={`mailto:${ORDER_EMAIL}`}>{ORDER_EMAIL}</a> to place your order.
                      </>
                    )}
                  </p>
                )}
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Order success popup */}
      {orderSuccess && (
        <div
          className="order-success-root order-success-root--visible"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-success-title"
        >
          <button
            className="modal-backdrop"
            onClick={dismissOrderSuccess}
            aria-label="Close"
          />
          <div className="order-success-card">
            <div className="order-success-card__icon-wrap">
              <CheckCircleOutlineIcon className="order-success-card__icon" />
              <span className="order-success-card__heart" aria-hidden="true">
                <FavoriteIcon fontSize="small" />
              </span>
            </div>
            <h2 id="order-success-title">Thank you!</h2>
            <p className="order-success-card__ref">Order {orderSuccess.orderRef}</p>
            <p className="order-success-card__lead">Your order has been sent!</p>
            <p className="order-success-card__detail">
              We&apos;ve received your order for{' '}
              <strong>
                {orderSuccess.itemCount} item{orderSuccess.itemCount !== 1 ? 's' : ''}
              </strong>{' '}
              {orderSuccess.total > 0 ? `(R${orderSuccess.total})` : '(custom pricing)'}. A confirmation was sent to{' '}
              <a href={BUSINESS.website} target="_blank" rel="noopener noreferrer">
                Hope in Hearts
              </a>
              — we&apos;ll reply to your email soon with payment and delivery details.
            </p>
            <p className="order-success-card__cleared">
              Your bag is empty — happy shopping!
            </p>
            <button type="button" className="btn-primary" onClick={dismissOrderSuccess}>
              Continue shopping
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer__social">
          <a
            href="https://facebook.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FacebookIcon />
          </a>
          <a
            href="https://instagram.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
        </div>
        <p className="footer__copy">
          © 2026, Hope‑in‑Hearts Nursery Decor · Powered by Hope-in-Hearts-Development
        </p>
      </footer>
    </div>
  );
}

export default App;
