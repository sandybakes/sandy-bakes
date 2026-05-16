import { useState, useEffect, useRef } from "react";

// ============================================================
// DESIGN TOKENS
// ============================================================
const COLORS = {
  primary: "#B91C1C",       // deep crimson red
  primaryLight: "#EF4444",
  primaryDark: "#7F1D1D",
  accent: "#F59E0B",        // warm amber
  accentLight: "#FCD34D",
  cream: "#FFF8F0",
  creamDark: "#FEF0DC",
  brown: "#78350F",
  brownLight: "#92400E",
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray600: "#4B5563",
  gray800: "#1F2937",
  text: "#1A0A00",
  success: "#16A34A",
  warning: "#D97706",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: ${COLORS.cream};
    color: ${COLORS.text};
    overflow-x: hidden;
  }

  :root {
    --primary: ${COLORS.primary};
    --accent: ${COLORS.accent};
    --cream: ${COLORS.cream};
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.creamDark}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.primary}; border-radius: 3px; }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  @keyframes heartBeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .animate-fadeUp { animation: fadeUp 0.6s ease forwards; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-heartbeat { animation: heartBeat 1.5s ease-in-out infinite; }
  .animate-spin { animation: spin 1s linear infinite; }

  /* NAV */
  .nav-glass {
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(20px);
    box-shadow: 0 2px 30px rgba(185,28,28,0.08);
    border-bottom: 1px solid rgba(185,28,28,0.1);
  }

  /* BUTTONS */
  .btn-primary {
    background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 12px 28px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(185,28,28,0.3);
    letter-spacing: 0.5px;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(185,28,28,0.4);
  }
  .btn-primary:active { transform: translateY(0); }

  .btn-outline {
    background: transparent;
    color: ${COLORS.primary};
    border: 2px solid ${COLORS.primary};
    border-radius: 50px;
    padding: 10px 26px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .btn-outline:hover {
    background: ${COLORS.primary};
    color: white;
    transform: translateY(-2px);
  }

  .btn-accent {
    background: linear-gradient(135deg, ${COLORS.accent} 0%, #D97706 100%);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 12px 28px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(245,158,11,0.3);
  }
  .btn-accent:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245,158,11,0.4);
  }

  /* CARDS */
  .product-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    transition: all 0.35s ease;
    border: 1px solid rgba(185,28,28,0.06);
  }
  .product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(185,28,28,0.15);
  }

  /* HERO */
  .hero-gradient {
    background: linear-gradient(135deg, #FFF8F0 0%, #FEF0DC 40%, #FEE2E2 100%);
    position: relative;
    overflow: hidden;
  }
  .hero-gradient::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(185,28,28,0.06) 0%, transparent 70%);
    border-radius: 50%;
  }

  /* SECTION TITLES */
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 42px);
    color: ${COLORS.primaryDark};
    line-height: 1.2;
  }
  .script-title {
    font-family: 'Dancing Script', cursive;
    color: ${COLORS.primary};
  }

  /* FORM INPUTS */
  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid ${COLORS.gray200};
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
    background: white;
    color: ${COLORS.text};
    outline: none;
  }
  .form-input:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 3px rgba(185,28,28,0.1);
  }
  .form-input::placeholder { color: ${COLORS.gray400}; }

  /* STATUS BADGES */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }
  .badge-pending { background: #FEF3C7; color: #92400E; }
  .badge-confirmed { background: #DBEAFE; color: #1E40AF; }
  .badge-baking { background: #FEE2E2; color: #991B1B; }
  .badge-ready { background: #D1FAE5; color: #065F46; }
  .badge-delivered { background: #E9D5FF; color: #5B21B6; }

  /* MODAL */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }
  .modal-box {
    background: white;
    border-radius: 24px;
    padding: 32px;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    animation: fadeUp 0.3s ease;
    box-shadow: 0 24px 60px rgba(0,0,0,0.2);
  }

  /* TOAST */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: white;
    border-radius: 16px;
    padding: 16px 20px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    border-left: 4px solid ${COLORS.success};
    z-index: 9999;
    animation: slideIn 0.4s ease;
    max-width: 320px;
  }
  .toast-error { border-left-color: ${COLORS.primary}; }

  /* SIDEBAR */
  .sidebar {
    width: 240px;
    background: linear-gradient(180deg, ${COLORS.primaryDark} 0%, #5C0A0A 100%);
    min-height: 100vh;
    padding: 24px 0;
    flex-shrink: 0;
  }
  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    font-weight: 500;
    border-left: 3px solid transparent;
  }
  .sidebar-item:hover, .sidebar-item.active {
    background: rgba(255,255,255,0.1);
    color: white;
    border-left-color: ${COLORS.accent};
  }

  /* TABLE */
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th {
    background: ${COLORS.gray50};
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${COLORS.gray600};
    border-bottom: 2px solid ${COLORS.gray200};
  }
  .data-table td {
    padding: 14px 16px;
    border-bottom: 1px solid ${COLORS.gray100};
    font-size: 14px;
    vertical-align: middle;
  }
  .data-table tr:hover td { background: ${COLORS.gray50}; }

  /* STATS CARD */
  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    border: 1px solid ${COLORS.gray100};
    transition: transform 0.2s;
  }
  .stat-card:hover { transform: translateY(-4px); }

  /* CART BADGE */
  .cart-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: ${COLORS.primary};
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* WATERMARK PROTECTION */
  .watermark-protected {
    position: relative;
    user-select: none;
    -webkit-user-select: none;
  }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .sidebar { width: 200px; }
    .hide-mobile { display: none !important; }
  }
`;

// ============================================================
// MOCK DATA
// ============================================================
const CATEGORIES = ["All", "Cakes", "Cupcakes", "Brownies", "Cookies", "Breads", "Pastries"];

const PRODUCTS = [
  { id: 1, name: "Classic Chocolate Cake", category: "Cakes", price: 650, weight: "500g", tag: "Bestseller", desc: "Rich moist chocolate layers with ganache frosting.", image: "🎂", nameOnCake: true, sizes: ["500g", "1kg", "2kg"], prices: { "500g": 650, "1kg": 1100, "2kg": 2000 }, available: true },
  { id: 2, name: "Vanilla Dream Cake", category: "Cakes", price: 600, weight: "500g", tag: "Classic", desc: "Soft vanilla sponge with buttercream, perfect for any occasion.", image: "🎂", nameOnCake: true, sizes: ["500g", "1kg", "2kg"], prices: { "500g": 600, "1kg": 1000, "2kg": 1800 }, available: true },
  { id: 3, name: "Red Velvet Cake", category: "Cakes", price: 750, weight: "500g", tag: "Premium", desc: "Velvety red cake with cream cheese frosting.", image: "🎂", nameOnCake: true, sizes: ["500g", "1kg", "2kg"], prices: { "500g": 750, "1kg": 1300, "2kg": 2400 }, available: true },
  { id: 4, name: "Fudge Brownies", category: "Brownies", price: 180, weight: "200g", tag: "Bestseller", desc: "Dense, fudgy brownies made with premium cocoa.", image: "🟫", nameOnCake: false, sizes: ["200g", "400g"], prices: { "200g": 180, "400g": 340 }, available: true },
  { id: 5, name: "Nutella Brownies", category: "Brownies", price: 220, weight: "200g", tag: "New", desc: "Brownies swirled with rich Nutella in every bite.", image: "🟫", nameOnCake: false, sizes: ["200g", "400g"], prices: { "200g": 220, "400g": 420 }, available: true },
  { id: 6, name: "Choco Cupcakes (6 pcs)", category: "Cupcakes", price: 300, weight: "6 pcs", tag: "Party Pack", desc: "Moist chocolate cupcakes with swirled buttercream.", image: "🧁", nameOnCake: false, sizes: ["6 pcs", "12 pcs"], prices: { "6 pcs": 300, "12 pcs": 550 }, available: true },
  { id: 7, name: "Vanilla Cupcakes (6 pcs)", category: "Cupcakes", price: 280, weight: "6 pcs", tag: "Classic", desc: "Fluffy vanilla cupcakes with pastel frosting.", image: "🧁", nameOnCake: false, sizes: ["6 pcs", "12 pcs"], prices: { "6 pcs": 280, "12 pcs": 520 }, available: true },
  { id: 8, name: "Choco Chip Cookies (12 pcs)", category: "Cookies", price: 200, weight: "12 pcs", tag: "Crunchy", desc: "Crispy-edged, chewy-centre choco chip cookies.", image: "🍪", nameOnCake: false, sizes: ["12 pcs", "24 pcs"], prices: { "12 pcs": 200, "24 pcs": 380 }, available: true },
  { id: 9, name: "Butter Cookies Tin", category: "Cookies", price: 350, weight: "400g", tag: "Gift Ready", desc: "Classic Danish-style butter cookies, gift-tin packed.", image: "🍪", nameOnCake: false, sizes: ["400g"], prices: { "400g": 350 }, available: true },
  { id: 10, name: "Garlic Herb Bread", category: "Breads", price: 160, weight: "300g", tag: "Fresh Daily", desc: "Soft bread infused with garlic and herbs.", image: "🍞", nameOnCake: false, sizes: ["300g"], prices: { "300g": 160 }, available: true },
  { id: 11, name: "Whole Wheat Loaf", category: "Breads", price: 120, weight: "400g", tag: "Healthy", desc: "Wholesome whole wheat bread, baked fresh daily.", image: "🍞", nameOnCake: false, sizes: ["400g"], prices: { "400g": 120 }, available: true },
  { id: 12, name: "Croissant (4 pcs)", category: "Pastries", price: 240, weight: "4 pcs", tag: "Flaky", desc: "Buttery, flaky croissants baked to golden perfection.", image: "🥐", nameOnCake: false, sizes: ["4 pcs"], prices: { "4 pcs": 240 }, available: true },
  { id: 13, name: "Strawberry Tart", category: "Pastries", price: 280, weight: "2 pcs", tag: "Seasonal", desc: "Crisp pastry shells filled with custard and fresh strawberries.", image: "🥧", nameOnCake: false, sizes: ["2 pcs", "4 pcs"], prices: { "2 pcs": 280, "4 pcs": 520 }, available: true },
];

const OFFERS = [
  { id: 1, type: "combo", trigger_product: 1, gift_product: 4, desc: "Buy Classic Chocolate Cake → Get Mini Brownies FREE!" },
  { id: 2, type: "amount", min_amount: 800, gift: "Mini Brownie Pack (₹180 value)", desc: "Spend ₹800+ → Get Mini Brownies FREE!" },
  { id: 3, type: "discount", min_amount: 1500, percent: 10, desc: "Spend ₹1500+ → Get 10% OFF!" },
];

const INITIAL_ORDERS = [
  { id: "SB-001", customer: "Priya Kumar", email: "priya@email.com", phone: "9876543210", items: [{ product: "Classic Chocolate Cake", qty: 1, size: "1kg", price: 1100 }], total: 1100, status: "Baking", date: "2025-12-20", deliveryDate: "2025-12-22", payment: "UPI", txnId: "TXN123456", address: "12, Anna Nagar, Chennai", nameOnCake: "Happy Birthday Priya!" },
  { id: "SB-002", customer: "Rahul Singh", email: "rahul@email.com", phone: "9876543211", items: [{ product: "Fudge Brownies", qty: 2, size: "200g", price: 360 }], total: 360, status: "Pending", date: "2025-12-21", deliveryDate: "2025-12-23", payment: "COD", txnId: "", address: "45, T Nagar, Chennai", nameOnCake: "" },
  { id: "SB-003", customer: "Meena Raj", email: "meena@email.com", phone: "9876543212", items: [{ product: "Red Velvet Cake", qty: 1, size: "2kg", price: 2400 }], total: 2400, status: "Ready", date: "2025-12-19", deliveryDate: "2025-12-21", payment: "UPI", txnId: "TXN789012", address: "78, Velachery, Chennai", nameOnCake: "Happy Anniversary!" },
];

// ============================================================
// UTILITY HELPERS
// ============================================================
const formatPrice = (p) => `₹${p.toLocaleString("en-IN")}`;
const generateOrderId = () => `SB-${String(Date.now()).slice(-4)}`;

// ============================================================
// TOAST COMPONENT
// ============================================================
function Toast({ msg, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div className={`toast ${type === "error" ? "toast-error" : ""}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{type === "success" ? "✅" : "❌"}</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.gray800 }}>{msg}</div>
        </div>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: COLORS.gray400 }}>×</button>
      </div>
    </div>
  );
}

// ============================================================
// LOGO COMPONENT
// ============================================================
function Logo({ size = 40 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: size, height: size, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, boxShadow: `0 4px 12px rgba(185,28,28,0.3)` }}>🎂</div>
      <div>
        <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: size * 0.55, color: COLORS.primary, lineHeight: 1, fontWeight: 700 }}>Sandy Bakes</div>
        <div style={{ fontSize: 9, color: COLORS.gray400, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 500 }}>Homemade & Fresh</div>
      </div>
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ page, setPage, cart, user, setUser, setShowLogin }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const navLinks = [
    { key: "home", label: "Home" },
    { key: "products", label: "Menu" },
    { key: "about", label: "About" },
    { key: "contact", label: "Contact" },
  ];
  return (
    <nav className="nav-glass" style={{ position: "sticky", top: 0, zIndex: 100, padding: "0 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
        <div style={{ cursor: "pointer" }} onClick={() => setPage("home")}><Logo size={38} /></div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="hide-mobile">
          {navLinks.map(l => (
            <button key={l.key} onClick={() => setPage(l.key)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: 8, fontFamily: "'DM Sans'", fontWeight: page === l.key ? 600 : 400, color: page === l.key ? COLORS.primary : COLORS.gray600, fontSize: 14, transition: "all 0.2s", borderBottom: page === l.key ? `2px solid ${COLORS.primary}` : "2px solid transparent" }}>{l.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }} onClick={() => setPage("dashboard")}>{user.name[0].toUpperCase()}</div>
              <button className="btn-outline" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => setUser(null)}>Logout</button>
            </div>
          ) : (
            <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }} onClick={() => setShowLogin(true)}>Login / Sign Up</button>
          )}
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setPage("cart")}>
            <div style={{ fontSize: 24, padding: "4px 8px" }}>🛒</div>
            {cartCount > 0 && <div className="cart-badge">{cartCount}</div>}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ setPage, products }) {
  const featured = products.filter(p => p.tag === "Bestseller").slice(0, 3);
  return (
    <div>
      <style>{CSS}</style>
      {/* HERO */}
      <section className="hero-gradient" style={{ padding: "80px 24px 60px", minHeight: "88vh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%" }}>
          <div style={{ animation: "fadeUp 0.7s ease forwards" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(185,28,28,0.08)", border: `1px solid rgba(185,28,28,0.15)`, borderRadius: 50, padding: "6px 16px", marginBottom: 20 }}>
              <span style={{ fontSize: 16 }}>🏠</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.primary, letterSpacing: "0.5px" }}>HOMEMADE & FRESH — CHENNAI</span>
            </div>
            <h1 className="section-title" style={{ fontSize: "clamp(36px, 5vw, 58px)", marginBottom: 16, lineHeight: 1.15 }}>
              Baked with Love,<br />
              <span style={{ fontFamily: "'Dancing Script', cursive", color: COLORS.primary, fontSize: "1.1em" }}>Delivered Fresh</span>
            </h1>
            <p style={{ color: COLORS.gray600, fontSize: 17, lineHeight: 1.8, marginBottom: 32, maxWidth: 440 }}>
              Custom cakes, brownies, cookies & more — crafted fresh for every occasion. Order your perfect treat today!
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }} onClick={() => setPage("products")}>🛍️ Order Now</button>
              <button className="btn-outline" style={{ fontSize: 16, padding: "14px 32px" }} onClick={() => setPage("about")}>Our Story</button>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
              {[["500+", "Happy Customers"], ["100%", "Homemade"], ["Same Day", "Delivery*"]].map(([val, lab]) => (
                <div key={lab}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: COLORS.primary }}>{val}</div>
                  <div style={{ fontSize: 12, color: COLORS.gray400, fontWeight: 500 }}>{lab}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center", animation: "float 4s ease-in-out infinite" }}>
            <div style={{ fontSize: "clamp(120px, 18vw, 200px)", filter: "drop-shadow(0 20px 40px rgba(185,28,28,0.2))" }}>🎂</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
              {["❤️", "🧁", "🍪", "🍞", "🥐"].map((e, i) => (
                <span key={i} style={{ fontSize: 28, animation: `float ${2.5 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}>{e}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS STRIP */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, color: "white", padding: "14px 24px", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 48, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          {OFFERS.map(o => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500 }}>
              <span style={{ fontSize: 18 }}>🎁</span>
              <span>{o.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section style={{ padding: "70px 24px", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="script-title" style={{ fontSize: 22, marginBottom: 8 }}>What we bake</div>
            <h2 className="section-title">Our Specialties</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
            {[
              { cat: "Cakes", icon: "🎂", count: products.filter(p => p.category === "Cakes").length },
              { cat: "Cupcakes", icon: "🧁", count: products.filter(p => p.category === "Cupcakes").length },
              { cat: "Brownies", icon: "🟫", count: products.filter(p => p.category === "Brownies").length },
              { cat: "Cookies", icon: "🍪", count: products.filter(p => p.category === "Cookies").length },
              { cat: "Breads", icon: "🍞", count: products.filter(p => p.category === "Breads").length },
              { cat: "Pastries", icon: "🥐", count: products.filter(p => p.category === "Pastries").length },
            ].map(({ cat, icon, count }) => (
              <div key={cat} onClick={() => setPage("products")} style={{ background: COLORS.cream, border: `2px solid ${COLORS.creamDark}`, borderRadius: 20, padding: "24px 16px", textAlign: "center", cursor: "pointer", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.transform = "translateY(-6px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.creamDark; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: 42, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 15, color: COLORS.text }}>{cat}</div>
                <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 4 }}>{count} items</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section style={{ padding: "70px 24px", background: COLORS.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="script-title" style={{ fontSize: 22, marginBottom: 8 }}>Most Loved</div>
              <h2 className="section-title">Bestsellers</h2>
            </div>
            <button className="btn-outline" onClick={() => setPage("products")}>View All Menu →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {featured.map(p => <ProductCard key={p.id} product={p} setPage={setPage} />)}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ padding: "70px 24px", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="script-title" style={{ fontSize: 22, marginBottom: 8 }}>Why choose us</div>
            <h2 className="section-title">The Sandy Bakes Promise</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {[
              { icon: "🏡", title: "100% Homemade", desc: "Every item baked fresh in our home kitchen with love and premium ingredients." },
              { icon: "🚫", title: "No Preservatives", desc: "Clean, natural ingredients only. No artificial colours or preservatives." },
              { icon: "📅", title: "Made to Order", desc: "We bake after you order — ensuring maximum freshness every time." },
              { icon: "🎨", title: "Fully Customizable", desc: "Custom messages, sizes, flavors — make it truly yours." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: COLORS.cream, borderRadius: 20, padding: 28, border: `1px solid ${COLORS.creamDark}` }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, marginBottom: 10, color: COLORS.text }}>{title}</h3>
                <p style={{ color: COLORS.gray600, fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "70px 24px", background: `linear-gradient(135deg, ${COLORS.primaryDark} 0%, #5C0A0A 100%)`, color: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: 22, color: COLORS.accent, marginBottom: 8 }}>Happy customers</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 3vw, 36px)", color: "white" }}>What Chennai is saying 💬</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { name: "Priya K.", text: "The red velvet cake was absolutely divine! Got it for my daughter's birthday and everyone loved it. Will definitely order again!", stars: 5 },
              { name: "Ramesh V.", text: "Best brownies in Chennai! Dense, fudgy, and not too sweet. Delivered on time and well packed.", stars: 5 },
              { name: "Anitha S.", text: "Ordered custom cake with a message on top. Sandy Bakes nailed it perfectly! Great packaging too.", stars: 5 },
            ].map(({ name, text, stars }) => (
              <div key={name} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                <div style={{ marginBottom: 12 }}>{Array.from({ length: stars }).map((_, i) => <span key={i} style={{ color: COLORS.accent, fontSize: 18 }}>★</span>)}</div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.85)", marginBottom: 16, fontStyle: "italic" }}>"{text}"</p>
                <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.accent }}>— {name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#1A0A00", color: "rgba(255,255,255,0.7)", padding: "48px 24px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 40 }}>
            <div>
              <Logo size={36} />
              <p style={{ marginTop: 16, fontSize: 13, lineHeight: 1.8 }}>Homemade baked goods with love, serving Chennai & surrounding areas.</p>
            </div>
            <div>
              <h4 style={{ color: "white", fontWeight: 600, marginBottom: 16 }}>Quick Links</h4>
              {["Home", "Menu", "About", "Contact"].map(l => <div key={l} style={{ fontSize: 13, marginBottom: 8, cursor: "pointer" }}>{l}</div>)}
            </div>
            <div>
              <h4 style={{ color: "white", fontWeight: 600, marginBottom: 16 }}>Contact Us</h4>
              <div style={{ fontSize: 13, marginBottom: 8 }}>📧 sandybakes2026@gmail.com</div>
              <div style={{ fontSize: 13, marginBottom: 8 }}>📍 Chennai, Tamil Nadu</div>
              <div style={{ fontSize: 13 }}>🕒 Mon–Sat: 9 AM – 8 PM</div>
            </div>
            <div>
              <h4 style={{ color: "white", fontWeight: 600, marginBottom: 16 }}>Follow Us</h4>
              <div style={{ display: "flex", gap: 12 }}>
                {["📘", "📸", "💬"].map((e, i) => (
                  <div key={i} style={{ width: 40, height: 40, background: "rgba(255,255,255,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}>{e}</div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            © 2025 Sandy Bakes. All rights reserved. | Made with ❤️ in Chennai
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================
// PRODUCT CARD
// ============================================================
function ProductCard({ product: p, addToCart, setPage }) {
  const [selectedSize, setSelectedSize] = useState(p.sizes[0]);
  const price = p.prices[selectedSize];
  return (
    <div className="product-card watermark-protected">
      <div style={{ background: `linear-gradient(135deg, ${COLORS.cream}, ${COLORS.creamDark})`, height: 180, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, position: "relative" }}>
        {p.image}
        <span className="badge" style={{ position: "absolute", top: 12, right: 12, background: COLORS.primary, color: "white", fontSize: 10 }}>{p.tag}</span>
        {!p.available && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, borderRadius: "inherit" }}>Sold Out</div>}
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 11, color: COLORS.primary, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{p.category}</div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{p.name}</h3>
        <p style={{ fontSize: 12, color: COLORS.gray600, lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</p>
        {p.sizes.length > 1 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {p.sizes.map(s => (
              <button key={s} onClick={() => setSelectedSize(s)} style={{ padding: "4px 10px", borderRadius: 6, border: `1.5px solid ${selectedSize === s ? COLORS.primary : COLORS.gray200}`, background: selectedSize === s ? `rgba(185,28,28,0.08)` : "white", color: selectedSize === s ? COLORS.primary : COLORS.gray600, fontSize: 11, fontWeight: selectedSize === s ? 600 : 400, cursor: "pointer", transition: "all 0.2s" }}>{s}</button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: COLORS.primary }}>{formatPrice(price)}</div>
          {addToCart && p.available && (
            <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 12 }} onClick={() => addToCart(p, selectedSize, price)}>Add to Cart</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCTS PAGE
// ============================================================
function ProductsPage({ products, addToCart }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = products.filter(p => (activeCategory === "All" || p.category === activeCategory) && p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream }}>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primary})`, padding: "50px 24px", color: "white", textAlign: "center" }}>
        <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: 22, color: COLORS.accentLight, marginBottom: 8 }}>Fresh Baked Daily</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800 }}>Our Menu</h1>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)} className={activeCategory === c ? "btn-primary" : "btn-outline"} style={{ padding: "8px 18px", fontSize: 13 }}>{c}</button>
            ))}
          </div>
          <input className="form-input" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220, padding: "10px 14px" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} />)}
        </div>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.gray400 }}><div style={{ fontSize: 60 }}>🔍</div><p>No products found</p></div>}
      </div>
    </div>
  );
}

// ============================================================
// CART PAGE
// ============================================================
function CartPage({ cart, setCart, user, setShowLogin, setPage, showToast }) {
  const [nameOnCake, setNameOnCake] = useState({});
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryCharge = subtotal > 0 ? 60 : 0;
  const appliedOffer = OFFERS.find(o => o.type === "amount" && subtotal >= o.min_amount);
  const discountOffer = OFFERS.find(o => o.type === "discount" && subtotal >= o.min_amount);
  const discount = discountOffer ? Math.round(subtotal * discountOffer.percent / 100) : 0;
  const total = subtotal + deliveryCharge - discount;

  const updateQty = (id, size, delta) => {
    setCart(prev => prev.map(i => i.id === id && i.size === size ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };
  const removeItem = (id, size) => setCart(prev => prev.filter(i => !(i.id === id && i.size === size)));

  if (cart.length === 0) return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ fontSize: 80 }}>🛒</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>Your cart is empty</h2>
      <p style={{ color: COLORS.gray400 }}>Add some delicious treats!</p>
      <button className="btn-primary" onClick={() => setPage("products")}>Browse Menu</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, padding: "40px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 className="section-title" style={{ marginBottom: 32 }}>🛒 Your Cart</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
          <div>
            {cart.map(item => (
              <div key={`${item.id}-${item.size}`} style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 12, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 44 }}>{item.image}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: 4 }}>{item.name}</h3>
                  <div style={{ fontSize: 13, color: COLORS.gray400, marginBottom: 4 }}>Size: {item.size}</div>
                  {item.nameOnCake && (
                    <input className="form-input" placeholder="✍️ Name/message on cake (optional)" value={nameOnCake[`${item.id}-${item.size}`] || ""} onChange={e => setNameOnCake(prev => ({ ...prev, [`${item.id}-${item.size}`]: e.target.value }))} style={{ fontSize: 12, padding: "6px 10px", marginBottom: 4 }} />
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.gray200}`, borderRadius: 8, overflow: "hidden" }}>
                      <button onClick={() => updateQty(item.id, item.size, -1)} style={{ padding: "4px 12px", border: "none", background: COLORS.gray100, cursor: "pointer", fontWeight: 700 }}>−</button>
                      <span style={{ padding: "4px 12px", fontSize: 14, fontWeight: 600 }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.size, 1)} style={{ padding: "4px 12px", border: "none", background: COLORS.gray100, cursor: "pointer", fontWeight: 700 }}>+</button>
                    </div>
                    <div style={{ fontWeight: 700, color: COLORS.primary, fontSize: 16 }}>{formatPrice(item.price * item.qty)}</div>
                    <button onClick={() => removeItem(item.id, item.size)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: COLORS.gray400, fontSize: 18 }}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "white", borderRadius: 20, padding: 24, height: "fit-content", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", position: "sticky", top: 90 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: 20, fontSize: 20 }}>Order Summary</h3>
            {[["Subtotal", formatPrice(subtotal)], ["Delivery", formatPrice(deliveryCharge)], discount > 0 ? [`Discount (${discountOffer.percent}%)`, `-${formatPrice(discount)}`] : null].filter(Boolean).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14, color: COLORS.gray600 }}>
                <span>{k}</span><span style={{ color: k.startsWith("Discount") ? COLORS.success : COLORS.text, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            {appliedOffer && !discountOffer && (
              <div style={{ background: `rgba(22,163,74,0.08)`, border: `1px solid rgba(22,163,74,0.2)`, borderRadius: 10, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: COLORS.success, fontWeight: 600 }}>🎁 {appliedOffer.gift} applied!</div>
            )}
            <div style={{ borderTop: `2px solid ${COLORS.gray100}`, paddingTop: 12, marginTop: 12, display: "flex", justifyContent: "space-between", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20 }}>
              <span>Total</span><span style={{ color: COLORS.primary }}>{formatPrice(total)}</span>
            </div>
            <button className="btn-primary" style={{ width: "100%", marginTop: 20, padding: "14px", fontSize: 15 }} onClick={() => { if (!user) { setShowLogin(true); showToast("Please login to place your order", "error"); } else setPage("checkout"); }}>
              Proceed to Checkout →
            </button>
            <p style={{ fontSize: 11, color: COLORS.gray400, textAlign: "center", marginTop: 10 }}>💳 COD & UPI accepted</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CHECKOUT PAGE
// ============================================================
function CheckoutPage({ cart, setCart, user, setPage, showToast, setOrders }) {
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", address: "", city: "Chennai", pincode: "", deliveryDate: "", deliveryType: "delivery", payment: "COD", txnId: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryCharge = form.deliveryType === "delivery" ? 60 : 0;
  const discount = OFFERS.find(o => o.type === "discount" && subtotal >= o.min_amount);
  const discountAmt = discount ? Math.round(subtotal * discount.percent / 100) : 0;
  const total = subtotal + deliveryCharge - discountAmt;

  const placeOrder = () => {
    if (!form.name || !form.phone || !form.address || !form.deliveryDate) { showToast("Please fill all required fields", "error"); return; }
    if (form.payment === "UPI" && !form.txnId) { showToast("Please enter UPI Transaction ID", "error"); return; }
    setLoading(true);
    setTimeout(() => {
      const orderId = generateOrderId();
      const newOrder = {
        id: orderId, customer: form.name, email: user.email, phone: form.phone,
        items: cart.map(i => ({ product: i.name, qty: i.qty, size: i.size, price: i.price * i.qty })),
        total, status: "Pending", date: new Date().toISOString().split("T")[0],
        deliveryDate: form.deliveryDate, payment: form.payment, txnId: form.txnId,
        address: `${form.address}, ${form.city} - ${form.pincode}`, notes: form.notes,
      };
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setLoading(false);
      showToast(`🎉 Order ${orderId} placed! Confirmation sent to ${user.email}`);
      setPage("dashboard");
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, padding: "40px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 className="section-title" style={{ marginBottom: 8 }}>Checkout</h1>
        <p style={{ color: COLORS.gray400, marginBottom: 32, fontSize: 14 }}>Complete your order details below</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Delivery Details */}
            <div style={{ background: "white", borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: 20, fontSize: 18 }}>📦 Delivery Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray600, display: "block", marginBottom: 6 }}>Full Name *</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray600, display: "block", marginBottom: 6 }}>Phone *</label><input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  {["delivery", "pickup"].map(t => (
                    <button key={t} onClick={() => setForm({ ...form, deliveryType: t })} style={{ flex: 1, padding: 12, borderRadius: 12, border: `2px solid ${form.deliveryType === t ? COLORS.primary : COLORS.gray200}`, background: form.deliveryType === t ? `rgba(185,28,28,0.06)` : "white", color: form.deliveryType === t ? COLORS.primary : COLORS.gray600, fontWeight: form.deliveryType === t ? 600 : 400, cursor: "pointer", fontSize: 13, transition: "all 0.2s" }}>
                      {t === "delivery" ? "🚚 Home Delivery" : "🏪 Self Pickup"}
                    </button>
                  ))}
                </div>
                {form.deliveryType === "delivery" && (
                  <>
                    <textarea className="form-input" placeholder="Full Address *" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ marginBottom: 12, minHeight: 80, resize: "vertical" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <input className="form-input" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                      <input className="form-input" placeholder="Pincode" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} />
                    </div>
                  </>
                )}
                <div style={{ marginTop: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray600, display: "block", marginBottom: 6 }}>Delivery / Pickup Date *</label>
                  <input className="form-input" type="date" value={form.deliveryDate} onChange={e => setForm({ ...form, deliveryDate: e.target.value })} min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} />
                </div>
              </div>
            </div>
            {/* Payment */}
            <div style={{ background: "white", borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: 20, fontSize: 18 }}>💳 Payment Method</h3>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                {["COD", "UPI"].map(m => (
                  <button key={m} onClick={() => setForm({ ...form, payment: m })} style={{ flex: 1, padding: 14, borderRadius: 12, border: `2px solid ${form.payment === m ? COLORS.primary : COLORS.gray200}`, background: form.payment === m ? `rgba(185,28,28,0.06)` : "white", color: form.payment === m ? COLORS.primary : COLORS.gray600, fontWeight: form.payment === m ? 700 : 400, cursor: "pointer", fontSize: 13, transition: "all 0.2s" }}>
                    {m === "COD" ? "💵 Cash on Delivery" : "📱 UPI / Screenshot"}
                  </button>
                ))}
              </div>
              {form.payment === "UPI" && (
                <div style={{ background: COLORS.cream, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.creamDark}` }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: COLORS.brown }}>📲 Pay to UPI ID: <span style={{ color: COLORS.primary }}>sandybakes@upi</span></p>
                  <p style={{ fontSize: 12, color: COLORS.gray600, marginBottom: 12 }}>Take a screenshot of payment & note the transaction ID.</p>
                  <input className="form-input" placeholder="Enter UPI Transaction ID *" value={form.txnId} onChange={e => setForm({ ...form, txnId: e.target.value })} />
                  <p style={{ fontSize: 11, color: COLORS.gray400, marginTop: 8 }}>⚠️ Order confirmed after admin verifies payment</p>
                </div>
              )}
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray600, display: "block", marginBottom: 6 }}>Special Instructions (optional)</label>
                <textarea className="form-input" placeholder="Any special notes for your order..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ minHeight: 70, resize: "vertical" }} />
              </div>
            </div>
          </div>
          {/* Summary */}
          <div style={{ background: "white", borderRadius: 20, padding: 24, height: "fit-content", position: "sticky", top: 90 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
            {cart.map(i => (
              <div key={`${i.id}-${i.size}`} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: COLORS.gray600 }}>{i.name} ({i.size}) x{i.qty}</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(i.price * i.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${COLORS.gray100}`, marginTop: 12, paddingTop: 12 }}>
              {[["Subtotal", formatPrice(subtotal)], form.deliveryType === "delivery" ? ["Delivery", formatPrice(deliveryCharge)] : null, discountAmt > 0 ? [`Discount`, `-${formatPrice(discountAmt)}`] : null].filter(Boolean).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: COLORS.gray600 }}>
                  <span>{k}</span><span>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: `2px solid ${COLORS.gray100}`, paddingTop: 12, display: "flex", justifyContent: "space-between", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20 }}>
                <span>Total</span><span style={{ color: COLORS.primary }}>{formatPrice(total)}</span>
              </div>
            </div>
            <button className="btn-primary" style={{ width: "100%", marginTop: 20, padding: 14, fontSize: 15, position: "relative" }} onClick={placeOrder} disabled={loading}>
              {loading ? <span className="animate-spin" style={{ display: "inline-block" }}>⏳</span> : "🎉 Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CUSTOMER DASHBOARD
// ============================================================
function CustomerDashboard({ user, orders }) {
  const myOrders = orders.filter(o => o.email === user?.email);
  const statusSteps = ["Pending", "Confirmed", "Baking", "Ready", "Delivered"];
  const statusColors = { Pending: "badge-pending", Confirmed: "badge-confirmed", Baking: "badge-baking", Ready: "badge-ready", Delivered: "badge-delivered" };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, padding: "40px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, borderRadius: 24, padding: "28px 32px", color: "white", marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700 }}>{user?.name[0]?.toUpperCase()}</div>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 4 }}>Hi, {user?.name}! 👋</h2>
            <p style={{ opacity: 0.8, fontSize: 14 }}>{user?.email} • Customer since 2025</p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{myOrders.length}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Total Orders</div>
          </div>
        </div>

        <h2 className="section-title" style={{ marginBottom: 24, fontSize: 24 }}>My Orders</h2>
        {myOrders.length === 0 ? (
          <div style={{ background: "white", borderRadius: 20, padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 60 }}>📦</div>
            <p style={{ color: COLORS.gray400, marginTop: 12 }}>No orders yet. Start ordering!</p>
          </div>
        ) : myOrders.map(order => (
          <div key={order.id} style={{ background: "white", borderRadius: 20, padding: 24, marginBottom: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.primary, marginBottom: 4 }}>#{order.id}</div>
                <div style={{ fontSize: 13, color: COLORS.gray400 }}>Ordered: {order.date} | Delivery: {order.deliveryDate}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: COLORS.primary, fontSize: 18 }}>{formatPrice(order.total)}</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16, overflowX: "auto" }}>
              {statusSteps.map((s, i) => {
                const idx = statusSteps.indexOf(order.status);
                return (
                  <div key={s} style={{ display: "flex", alignItems: "center", flex: i < statusSteps.length - 1 ? 1 : "unset" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 60 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: i <= idx ? COLORS.primary : COLORS.gray200, color: i <= idx ? "white" : COLORS.gray400, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, transition: "all 0.3s" }}>{i <= idx ? "✓" : i + 1}</div>
                      <div style={{ fontSize: 10, fontWeight: i === idx ? 700 : 400, color: i <= idx ? COLORS.primary : COLORS.gray400, whiteSpace: "nowrap" }}>{s}</div>
                    </div>
                    {i < statusSteps.length - 1 && <div style={{ flex: 1, height: 2, background: i < idx ? COLORS.primary : COLORS.gray200, transition: "all 0.3s", minWidth: 20 }} />}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 13, color: COLORS.gray600 }}>
              {order.items.map((it, i) => <span key={i}>{it.product} ({it.size}) x{it.qty}{i < order.items.length - 1 ? ", " : ""}</span>)}
            </div>
            {order.payment === "UPI" && <div style={{ marginTop: 8, fontSize: 12, color: COLORS.gray400 }}>UPI Txn ID: {order.txnId}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function AdminDashboard({ orders, setOrders, products, setProducts }) {
  const [tab, setTab] = useState("orders");
  const [editProduct, setEditProduct] = useState(null);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: "📦", color: COLORS.primary },
    { label: "Pending", value: orders.filter(o => o.status === "Pending").length, icon: "⏳", color: COLORS.warning },
    { label: "Baking", value: orders.filter(o => o.status === "Baking").length, icon: "👨‍🍳", color: COLORS.primaryLight },
    { label: "Delivered", value: orders.filter(o => o.status === "Delivered").length, icon: "✅", color: COLORS.success },
  ];

  const updateStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  const toggleProduct = (id) => setProducts(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p));

  const sidebarItems = [
    { key: "orders", icon: "📦", label: "Orders" },
    { key: "products", icon: "🎂", label: "Products" },
    { key: "payments", icon: "💳", label: "Payments" },
    { key: "customers", icon: "👥", label: "Customers" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="sidebar">
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Logo size={32} />
        </div>
        <div style={{ padding: "8px 0", marginTop: 8 }}>
          <div style={{ padding: "8px 24px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>Admin Panel</div>
          {sidebarItems.map(item => (
            <div key={item.key} className={`sidebar-item ${tab === item.key ? "active" : ""}`} onClick={() => setTab(item.key)}>
              <span>{item.icon}</span><span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, background: COLORS.gray50, overflow: "auto" }}>
        {/* Header */}
        <div style={{ background: "white", padding: "16px 28px", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: COLORS.text }}>Admin Dashboard</h1>
            <p style={{ fontSize: 12, color: COLORS.gray400 }}>Sandy Bakes Order Management</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: `rgba(185,28,28,0.08)`, color: COLORS.primary, padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>⚡ Admin</div>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
            {stats.map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                  <div style={{ background: `${s.color}15`, color: s.color, padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700 }}>Live</div>
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 13, color: COLORS.gray400, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ORDERS TAB */}
          {tab === "orders" && (
            <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20 }}>All Orders</h2>
                <div style={{ fontSize: 13, color: COLORS.gray400 }}>{orders.length} total orders</div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Delivery Date</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td><span style={{ fontWeight: 700, color: COLORS.primary }}>{o.id}</span></td>
                        <td><div style={{ fontWeight: 600 }}>{o.customer}</div><div style={{ fontSize: 12, color: COLORS.gray400 }}>{o.phone}</div></td>
                        <td style={{ maxWidth: 200 }}><div style={{ fontSize: 12 }}>{o.items.map(i => `${i.product} x${i.qty}`).join(", ")}</div></td>
                        <td><span style={{ fontWeight: 700, color: COLORS.primary }}>{formatPrice(o.total)}</span></td>
                        <td style={{ fontSize: 13 }}>{o.deliveryDate}</td>
                        <td>
                          <div style={{ fontSize: 12 }}>{o.payment}</div>
                          {o.txnId && <div style={{ fontSize: 11, color: COLORS.gray400 }}>{o.txnId}</div>}
                        </td>
                        <td><span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
                        <td>
                          <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${COLORS.gray200}`, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'" }}>
                            {["Pending", "Confirmed", "Baking", "Ready", "Delivered", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {tab === "products" && (
            <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20 }}>Products</h2>
                <button className="btn-primary" style={{ fontSize: 13, padding: "8px 18px" }}>+ Add Product</button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead><tr><th>Product</th><th>Category</th><th>Base Price</th><th>Tag</th><th>Status</th><th>Toggle</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 24 }}>{p.image}</span><div><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 12, color: COLORS.gray400 }}>{p.weight}</div></div></div></td>
                        <td><span className="badge" style={{ background: `rgba(185,28,28,0.08)`, color: COLORS.primary }}>{p.category}</span></td>
                        <td style={{ fontWeight: 600, color: COLORS.primary }}>{formatPrice(p.price)}</td>
                        <td><span className="badge" style={{ background: "#FEF3C7", color: "#92400E" }}>{p.tag}</span></td>
                        <td><span className={`badge ${p.available ? "badge-ready" : "badge-baking"}`}>{p.available ? "Available" : "Sold Out"}</span></td>
                        <td>
                          <button onClick={() => toggleProduct(p.id)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${p.available ? COLORS.primary : COLORS.gray200}`, background: p.available ? `rgba(185,28,28,0.08)` : "white", color: p.available ? COLORS.primary : COLORS.gray400, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                            {p.available ? "Disable" : "Enable"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {tab === "payments" && (
            <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.gray100}` }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20 }}>Payment Verification</h2>
                <p style={{ fontSize: 13, color: COLORS.gray400, marginTop: 4 }}>Verify UPI payments submitted by customers</p>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Payment Type</th><th>Txn ID</th><th>Order Status</th><th>Verify</th></tr></thead>
                  <tbody>
                    {orders.filter(o => o.payment === "UPI").map(o => (
                      <tr key={o.id}>
                        <td><span style={{ fontWeight: 700, color: COLORS.primary }}>{o.id}</span></td>
                        <td><div style={{ fontWeight: 600 }}>{o.customer}</div><div style={{ fontSize: 12, color: COLORS.gray400 }}>{o.email}</div></td>
                        <td style={{ fontWeight: 700, color: COLORS.primary }}>{formatPrice(o.total)}</td>
                        <td><span className="badge badge-confirmed">UPI</span></td>
                        <td style={{ fontFamily: "monospace", fontSize: 13, color: COLORS.brown }}>{o.txnId || "—"}</td>
                        <td><span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
                        <td>
                          {o.status === "Pending" ? (
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => updateStatus(o.id, "Confirmed")} style={{ padding: "5px 12px", borderRadius: 8, background: `rgba(22,163,74,0.1)`, color: COLORS.success, border: `1px solid rgba(22,163,74,0.3)`, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✅ Verify</button>
                              <button onClick={() => updateStatus(o.id, "Cancelled")} style={{ padding: "5px 12px", borderRadius: 8, background: `rgba(185,28,28,0.1)`, color: COLORS.primary, border: `1px solid rgba(185,28,28,0.3)`, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✗ Reject</button>
                            </div>
                          ) : <span style={{ fontSize: 12, color: COLORS.gray400 }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CUSTOMERS TAB */}
          {tab === "customers" && (
            <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.gray100}` }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20 }}>Customers</h2>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead><tr><th>Customer</th><th>Contact</th><th>Orders</th><th>Total Spent</th><th>Last Order</th></tr></thead>
                  <tbody>
                    {[...new Map(orders.map(o => [o.email, o])).values()].map(o => {
                      const customerOrders = orders.filter(x => x.email === o.email);
                      const totalSpent = customerOrders.reduce((s, x) => s + x.total, 0);
                      return (
                        <tr key={o.email}>
                          <td><div style={{ fontWeight: 600 }}>{o.customer}</div></td>
                          <td><div style={{ fontSize: 13 }}>{o.email}</div><div style={{ fontSize: 12, color: COLORS.gray400 }}>{o.phone}</div></td>
                          <td><span style={{ background: `rgba(185,28,28,0.08)`, color: COLORS.primary, padding: "3px 10px", borderRadius: 6, fontWeight: 700, fontSize: 13 }}>{customerOrders.length}</span></td>
                          <td style={{ fontWeight: 700, color: COLORS.primary }}>{formatPrice(totalSpent)}</td>
                          <td style={{ fontSize: 13, color: COLORS.gray400 }}>{customerOrders[customerOrders.length - 1]?.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// OWNER DASHBOARD
// ============================================================
function OwnerDashboard({ orders, products }) {
  const [tab, setTab] = useState("overview");
  const totalRevenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === "Delivered").length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;

  const categorySales = CATEGORIES.slice(1).map(cat => {
    const catProducts = products.filter(p => p.category === cat).map(p => p.name);
    const revenue = orders.flatMap(o => o.items).filter(i => catProducts.some(n => i.product.includes(n.split(" ")[0]))).reduce((s, i) => s + i.price, 0);
    return { cat, revenue };
  });

  const sidebarItems = [
    { key: "overview", icon: "📊", label: "Overview" },
    { key: "revenue", icon: "💰", label: "Revenue" },
    { key: "products", icon: "🎂", label: "Products" },
    { key: "reports", icon: "📋", label: "Reports" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="sidebar" style={{ background: `linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)` }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Logo size={32} />
        </div>
        <div style={{ padding: "8px 0", marginTop: 8 }}>
          <div style={{ padding: "8px 24px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>Owner Panel</div>
          {sidebarItems.map(item => (
            <div key={item.key} className={`sidebar-item ${tab === item.key ? "active" : ""}`} onClick={() => setTab(item.key)}>
              <span>{item.icon}</span><span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, background: COLORS.gray50, overflow: "auto" }}>
        <div style={{ background: "white", padding: "16px 28px", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>Owner Dashboard</h1>
            <p style={{ fontSize: 12, color: COLORS.gray400 }}>Sandy Bakes — Full Business Overview</p>
          </div>
          <div style={{ background: "linear-gradient(135deg, #0F172A, #1E1B4B)", color: "white", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>👑 Owner</div>
        </div>

        <div style={{ padding: 28 }}>
          {tab === "overview" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Total Revenue", value: formatPrice(totalRevenue), icon: "💰", color: "#0F172A", sub: "All time" },
                  { label: "Total Orders", value: totalOrders, icon: "📦", color: COLORS.primary, sub: "All time" },
                  { label: "Delivered", value: deliveredOrders, icon: "✅", color: COLORS.success, sub: "Completed" },
                  { label: "Pending", value: pendingOrders, icon: "⏳", color: COLORS.warning, sub: "Awaiting action" },
                ].map(s => (
                  <div key={s.label} className="stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: COLORS.gray400 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div style={{ background: "white", borderRadius: 20, padding: 24 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Sales by Category</h3>
                  {categorySales.map(({ cat, revenue }) => (
                    <div key={cat} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                        <span style={{ fontWeight: 500 }}>{cat}</span>
                        <span style={{ fontWeight: 700, color: COLORS.primary }}>{formatPrice(revenue)}</span>
                      </div>
                      <div style={{ height: 8, background: COLORS.gray100, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min(100, (revenue / totalRevenue) * 100 || 10)}%`, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`, borderRadius: 4, transition: "width 1s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "white", borderRadius: 20, padding: 24 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Recent Orders</h3>
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: `1px solid ${COLORS.gray100}`, marginBottom: 12, fontSize: 13 }}>
                      <div><div style={{ fontWeight: 600 }}>{o.customer}</div><div style={{ color: COLORS.gray400, fontSize: 11 }}>{o.id} • {o.date}</div></div>
                      <div style={{ textAlign: "right" }}><div style={{ fontWeight: 700, color: COLORS.primary }}>{formatPrice(o.total)}</div><span className={`badge badge-${o.status.toLowerCase()}`} style={{ fontSize: 10 }}>{o.status}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "reports" && (
            <div style={{ background: "white", borderRadius: 20, padding: 28 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, marginBottom: 24 }}>📋 Business Report</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                {[
                  { title: "Avg. Order Value", value: totalOrders ? formatPrice(Math.round(totalRevenue / totalOrders)) : "₹0", icon: "📈" },
                  { title: "Completion Rate", value: totalOrders ? `${Math.round((deliveredOrders / totalOrders) * 100)}%` : "0%", icon: "🎯" },
                  { title: "UPI Orders", value: orders.filter(o => o.payment === "UPI").length, icon: "📱" },
                  { title: "COD Orders", value: orders.filter(o => o.payment === "COD").length, icon: "💵" },
                  { title: "Unique Customers", value: new Set(orders.map(o => o.email)).size, icon: "👥" },
                  { title: "Active Products", value: products.filter(p => p.available).length, icon: "🎂" },
                ].map(({ title, value, icon }) => (
                  <div key={title} style={{ background: COLORS.cream, borderRadius: 16, padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 36 }}>{icon}</div>
                    <div><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: COLORS.primaryDark }}>{value}</div><div style={{ fontSize: 13, color: COLORS.gray600 }}>{title}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(tab === "revenue" || tab === "products") && (
            <div style={{ background: "white", borderRadius: 20, padding: 28, textAlign: "center" }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>📊</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 8 }}>Coming Soon</h3>
              <p style={{ color: COLORS.gray400 }}>Detailed {tab} analytics will be connected to your live Supabase database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AUTH MODAL
// ============================================================
function AuthModal({ onClose, onLogin, showToast }) {
  const [mode, setMode] = useState("login"); // login | register | otp | admin | owner
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const sendOTP = (email) => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setOtpEmail(email);
    showToast(`📧 OTP sent to ${email} (Demo: ${code})`);
    return code;
  };

  const handleRegister = () => {
    if (!form.name || !form.email || !form.phone || !form.password) { showToast("Fill all fields", "error"); return; }
    setLoading(true);
    setTimeout(() => {
      sendOTP(form.email);
      setMode("otp");
      setLoading(false);
    }, 800);
  };

  const handleLogin = () => {
    if (!form.email || !form.password) { showToast("Fill all fields", "error"); return; }
    if (form.email === "admin@sandybakes.com" && form.password === "admin123") { onLogin({ name: "Admin", email: form.email, role: "admin" }); onClose(); return; }
    if (form.email === "owner@sandybakes.com" && form.password === "owner123") { onLogin({ name: "Sandy", email: form.email, role: "owner" }); onClose(); return; }
    setLoading(true);
    setTimeout(() => {
      sendOTP(form.email);
      setMode("otp");
      setLoading(false);
    }, 800);
  };

  const verifyOTP = () => {
    if (otp === generatedOtp) {
      onLogin({ name: form.name || form.email.split("@")[0], email: form.email, phone: form.phone, role: "customer" });
      showToast("✅ Login successful! Welcome to Sandy Bakes 🎂");
      onClose();
    } else { showToast("Invalid OTP. Please try again.", "error"); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Logo size={40} />
          <div style={{ marginTop: 16, display: "flex", gap: 0, background: COLORS.gray100, borderRadius: 12, padding: 4 }}>
            {mode !== "otp" && ["login", "register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: mode === m ? "white" : "transparent", color: mode === m ? COLORS.primary : COLORS.gray400, fontFamily: "'DM Sans'", fontWeight: mode === m ? 700 : 400, fontSize: 13, cursor: "pointer", boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}>
                {m === "login" ? "Login" : "Register"}
              </button>
            ))}
            {mode === "otp" && <div style={{ flex: 1, padding: "8px 0", textAlign: "center", fontWeight: 700, color: COLORS.primary, fontSize: 13 }}>OTP Verification</div>}
          </div>
        </div>

        {mode === "otp" ? (
          <div>
            <div style={{ background: `rgba(185,28,28,0.06)`, borderRadius: 12, padding: 16, marginBottom: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📧</div>
              <p style={{ fontSize: 13, color: COLORS.gray600 }}>OTP sent to <strong>{otpEmail}</strong></p>
              <p style={{ fontSize: 12, color: COLORS.gray400, marginTop: 4 }}>(Check toast for demo OTP)</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <input className="form-input" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} style={{ textAlign: "center", fontSize: 24, fontWeight: 700, letterSpacing: "8px" }} maxLength={6} />
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: 14 }} onClick={verifyOTP}>Verify OTP ✓</button>
            <button onClick={() => sendOTP(otpEmail)} style={{ width: "100%", marginTop: 8, background: "none", border: "none", color: COLORS.primary, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Resend OTP</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "register" && <input className="form-input" placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />}
            <input className="form-input" placeholder="Email Address *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            {mode === "register" && <input className="form-input" placeholder="Phone Number *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />}
            <input className="form-input" placeholder="Password *" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <button className="btn-primary" style={{ padding: 14, fontSize: 15 }} onClick={mode === "login" ? handleLogin : handleRegister} disabled={loading}>
              {loading ? "⏳ Sending OTP..." : mode === "login" ? "Login →" : "Register & Verify Email →"}
            </button>
            {mode === "login" && (
              <div style={{ textAlign: "center", fontSize: 12, color: COLORS.gray400, marginTop: -4 }}>
                <div style={{ marginBottom: 4 }}>Demo: admin@sandybakes.com / admin123</div>
                <div>Or: owner@sandybakes.com / owner123</div>
              </div>
            )}
          </div>
        )}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: COLORS.gray400 }}>×</button>
      </div>
    </div>
  );
}

// ============================================================
// ABOUT PAGE
// ============================================================
function AboutPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primary})`, padding: "70px 24px", color: "white", textAlign: "center" }}>
        <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: 24, color: COLORS.accentLight, marginBottom: 8 }}>Our Story</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, maxWidth: 600, margin: "0 auto" }}>Made with Heart, Baked with Love</h1>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginBottom: 60 }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: 20 }}>Hello, I'm Sandy 👋</h2>
            <p style={{ color: COLORS.gray600, lineHeight: 1.9, marginBottom: 16 }}>Sandy Bakes started as a passion project — baking for friends and family turned into Chennai's favourite home bakery. Every item on our menu is crafted fresh, baked to order, and packed with love.</p>
            <p style={{ color: COLORS.gray600, lineHeight: 1.9 }}>We believe in clean ingredients, no preservatives, and personalised service. Your celebration deserves the best.</p>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.cream}, ${COLORS.creamDark})`, borderRadius: 24, height: 280, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 100 }}>🎂</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 60 }}>
          {[["2022", "Founded in Chennai"], ["500+", "Happy Customers"], ["50+", "Menu Items"], ["100%", "Made to Order"]].map(([v, l]) => (
            <div key={l} style={{ background: COLORS.cream, borderRadius: 20, padding: 28, textAlign: "center", border: `1px solid ${COLORS.creamDark}` }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, color: COLORS.primary, marginBottom: 8 }}>{v}</div>
              <div style={{ fontSize: 14, color: COLORS.gray600 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONTACT PAGE
// ============================================================
function ContactPage({ showToast }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, padding: "60px 24px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="script-title" style={{ fontSize: 22, marginBottom: 8 }}>Get in touch</div>
          <h1 className="section-title">Contact Us</h1>
        </div>
        <div style={{ background: "white", borderRadius: 24, padding: 32, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
          {[["name", "Your Name", "text"], ["email", "Email Address", "email"]].map(([k, p, t]) => (
            <div key={k} style={{ marginBottom: 16 }}><input className="form-input" placeholder={p} type={t} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} /></div>
          ))}
          <div style={{ marginBottom: 20 }}><textarea className="form-input" placeholder="Your message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ minHeight: 120, resize: "vertical" }} /></div>
          <button className="btn-primary" style={{ width: "100%", padding: 14 }} onClick={() => { showToast("Message sent! We'll reply within 24 hours. 🎂"); setForm({ name: "", email: "", message: "" }); }}>Send Message 📩</button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
            {[["📧", "Email", "sandybakes2026@gmail.com"], ["📍", "Location", "Chennai, Tamil Nadu"]].map(([icon, label, val]) => (
              <div key={label} style={{ background: COLORS.cream, borderRadius: 12, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function SandyBakesApp() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [products, setProducts] = useState(PRODUCTS);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const addToCart = (product, size, price) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size);
      if (existing) return prev.map(i => i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, size, price, qty: 1, image: product.image, nameOnCake: product.nameOnCake, category: product.category }];
    });
    showToast(`🎉 ${product.name} added to cart!`);

    // Auto-apply combo offer
    const comboOffer = OFFERS.find(o => o.type === "combo" && o.trigger_product === product.id);
    if (comboOffer) {
      const giftProduct = PRODUCTS.find(p => p.id === comboOffer.gift_product);
      if (giftProduct) setTimeout(() => showToast(`🎁 Free ${giftProduct.name} added!`), 800);
    }
  };

  // Route based on user role for admin/owner
  if (user?.role === "admin") return <AdminDashboard orders={orders} setOrders={setOrders} products={products} setProducts={setProducts} />;
  if (user?.role === "owner") return <OwnerDashboard orders={orders} products={products} />;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: COLORS.cream, minHeight: "100vh" }}>
      <style>{CSS}</style>
      <Navbar page={page} setPage={setPage} cart={cart} user={user} setUser={setUser} setShowLogin={setShowLogin} />

      {page === "home" && <HomePage setPage={setPage} products={products} />}
      {page === "products" && <ProductsPage products={products} addToCart={addToCart} />}
      {page === "about" && <AboutPage />}
      {page === "contact" && <ContactPage showToast={showToast} />}
      {page === "cart" && <CartPage cart={cart} setCart={setCart} user={user} setShowLogin={setShowLogin} setPage={setPage} showToast={showToast} />}
      {page === "checkout" && user && <CheckoutPage cart={cart} setCart={setCart} user={user} setPage={setPage} showToast={showToast} setOrders={setOrders} />}
      {page === "dashboard" && user && <CustomerDashboard user={user} orders={orders} />}

      {showLogin && <AuthModal onClose={() => setShowLogin(false)} onLogin={u => { setUser(u); setShowLogin(false); }} showToast={showToast} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
