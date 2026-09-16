import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Eye,
  Gamepad2,
  Heart,
  Headphones,
  Laptop,
  Menu,
  Minus,
  Monitor,
  Mouse,
  Package,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  Truck,
  UserRound,
  X,
  Zap,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  image: string;
  color: string;
  specs: string;
};

type CartItem = Product & { quantity: number };

const products: Product[] = [
  {
    id: 1,
    name: "Nebula X9 Pro",
    category: "أجهزة مكتبية",
    price: 8499,
    oldPrice: 9799,
    rating: 4.9,
    reviews: 126,
    badge: "الأكثر مبيعاً",
    image: "/assets/techzone-build.jpg",
    color: "cyan",
    specs: "Ryzen 9 · RTX 4080 · 32GB RAM",
  },
  {
    id: 2,
    name: "Apex Ultra 32\"",
    category: "شاشات",
    price: 2199,
    oldPrice: 2599,
    rating: 4.8,
    reviews: 84,
    badge: "خصم 15%",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=88",
    color: "violet",
    specs: "4K UHD · 165Hz · HDR 400",
  },
  {
    id: 3,
    name: "Phantom K70",
    category: "إكسسوارات",
    price: 489,
    rating: 4.7,
    reviews: 211,
    badge: "جديد",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=88",
    color: "pink",
    specs: "ميكانيكي · RGB · مفاتيح خطية",
  },
  {
    id: 4,
    name: "Pulse Air Max",
    category: "صوتيات",
    price: 699,
    oldPrice: 799,
    rating: 4.8,
    reviews: 93,
    badge: "عرض اليوم",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=88",
    color: "blue",
    specs: "صوت محيطي · ANC · 40 ساعة",
  },
  {
    id: 5,
    name: "Stealth M5 Wireless",
    category: "إكسسوارات",
    price: 259,
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1000&q=88",
    color: "cyan",
    specs: "26K DPI · لاسلكي · 68g",
  },
  {
    id: 6,
    name: "Vector 15 Studio",
    category: "لابتوبات",
    price: 5799,
    oldPrice: 6299,
    rating: 4.9,
    reviews: 61,
    badge: "اختيار المحترفين",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=88",
    color: "violet",
    specs: "Core Ultra 9 · RTX 4070 · OLED",
  },
];

const categories = [
  { label: "الكل", icon: Sparkles },
  { label: "أجهزة مكتبية", icon: Cpu },
  { label: "لابتوبات", icon: Laptop },
  { label: "شاشات", icon: Monitor },
  { label: "إكسسوارات", icon: Mouse },
  { label: "صوتيات", icon: Headphones },
];

const formatPrice = (value: number) => new Intl.NumberFormat("ar-SA").format(value);

export default function Home() {
  const [category, setCategory] = useState("الكل");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [newsletter, setNewsletter] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [category]);

  useEffect(() => {
    if (!toastMsg) return;
    const timeout = window.setTimeout(() => setToastMsg(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toastMsg]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "الكل" || product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, searchTerm]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      if (found) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setToastMsg(`تمت إضافة ${product.name} إلى السلة`);
  };

  const updateQuantity = (id: number, amount: number) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + amount } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const toggleFavorite = (id: number) => {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const scrollToProducts = () => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="techzone-app" dir="rtl">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grain" />

      <header className={`site-header ${scrolled ? "header-scrolled" : ""}`}>
        <div className="container nav-wrap">
          <a className="brand" href="#top" aria-label="TechZone الرئيسية">
            <span className="brand-mark"><Cpu size={19} strokeWidth={2.5} /></span>
            <span className="brand-name">TECH<span>ZONE</span></span>
          </a>
          <nav className={`desktop-nav ${mobileMenu ? "mobile-open" : ""}`}>
            <a className="nav-link active" href="#top" onClick={() => setMobileMenu(false)}>الرئيسية</a>
            <a className="nav-link" href="#products" onClick={() => setMobileMenu(false)}>المتجر</a>
            <a className="nav-link" href="#categories" onClick={() => setMobileMenu(false)}>الفئات</a>
            <a className="nav-link" href="#why" onClick={() => setMobileMenu(false)}>لماذا نحن؟</a>
          </nav>
          <div className="nav-actions">
            <div className={`search-box ${searchOpen ? "search-expanded" : ""}`}>
              {searchOpen && <input autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="ابحث عن منتج..." aria-label="البحث" />}
              <button className="icon-button" onClick={() => setSearchOpen((current) => !current)} aria-label="بحث"><Search size={19} /></button>
            </div>
            <button className="icon-button account-button" aria-label="حسابي"><UserRound size={19} /></button>
            <button className="cart-button" onClick={() => setIsCartOpen(true)} aria-label="سلة التسوق">
              <ShoppingBag size={19} />
              <span>السلة</span>
              {cartCount > 0 && <b>{cartCount}</b>}
            </button>
            <button className="menu-button" onClick={() => setMobileMenu((current) => !current)} aria-label="القائمة">{mobileMenu ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-image" />
          <div className="hero-overlay" />
          <div className="hero-grid" />
          <div className="container hero-content">
            <div className="hero-copy reveal is-visible">
              <div className="eyebrow"><span className="pulse-dot" /> تقنية بلا حدود</div>
              <h1>ابنِ عالمك<br /><em>بلا حدود</em></h1>
              <p>كل ما تحتاجه لتأخذ أداءك إلى المستوى التالي. أجهزة ومعدات مختارة بعناية، لتصنع تجربة لا تُنسى.</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={scrollToProducts}>اكتشف المنتجات <ArrowLeft size={17} /></button>
                <button className="ghost-button" onClick={() => document.getElementById("why")?.scrollIntoView({ behavior: "smooth" })}>لماذا TechZone؟ <ArrowUpLeft size={16} /></button>
              </div>
              <div className="hero-proof">
                <div className="avatar-stack"><span>ع</span><span>م</span><span>ر</span><span>+</span></div>
                <div><strong>+12,000</strong><small>عميل سعيد يثق بنا</small></div>
              </div>
            </div>
            <div className="hero-side reveal reveal-delay-2 is-visible">
              <span className="vertical-label">TECHNOLOGY / REDEFINED</span>
              <div className="hero-float-card">
                <Sparkles size={17} />
                <div><strong>تجربة مختلفة</strong><small>أداء. دقة. سرعة.</small></div>
              </div>
            </div>
          </div>
          <div className="hero-scroll"><span>مرر لاستكشاف المزيد</span><div className="scroll-line" /></div>
        </section>

        <section className="ticker-section" aria-label="مميزات المتجر">
          <div className="ticker-track">
            <span><Zap size={15} /> شحن مجاني فوق 500 ريال</span><i />
            <span><ShieldCheck size={15} /> ضمان سنتين على كل جهاز</span><i />
            <span><Truck size={15} /> توصيل سريع خلال 24 ساعة</span><i />
            <span><Headphones size={15} /> دعم تقني متاح دائماً</span><i />
            <span><Zap size={15} /> شحن مجاني فوق 500 ريال</span><i />
            <span><ShieldCheck size={15} /> ضمان سنتين على كل جهاز</span><i />
          </div>
        </section>

        <section className="categories-section section-space" id="categories">
          <div className="container">
            <div className="section-heading reveal">
              <div><span className="section-kicker">استكشف مجموعتنا</span><h2>كل شيء تحتاجه.<br /><span>في مكان واحد.</span></h2></div>
              <p>من أول نقرة إلى آخر إطار. اختر قطعك بعناية وابنِ إعدادك المثالي.</p>
            </div>
            <div className="category-grid">
              {categories.slice(1).map((item, index) => {
                const Icon = item.icon;
                return <button key={item.label} className={`category-card reveal reveal-delay-${index + 1}`} onClick={() => { setCategory(item.label); scrollToProducts(); }}><span className="category-number">0{index + 1}</span><span className="category-icon"><Icon size={28} strokeWidth={1.5} /></span><strong>{item.label}</strong><span className="category-arrow"><ArrowUpLeft size={16} /></span></button>;
              })}
            </div>
          </div>
        </section>

        <section className="products-section section-space" id="products">
          <div className="container">
            <div className="products-top reveal">
              <div><span className="section-kicker">مختاراتنا لك</span><h2>الأكثر <span>طلباً</span></h2></div>
              <div className="product-controls">
                <div className="filter-pills">{categories.map((item) => <button key={item.label} className={category === item.label ? "selected" : ""} onClick={() => setCategory(item.label)}>{item.label}</button>)}</div>
                <button className="filter-button"><SlidersHorizontal size={16} /> تصفية</button>
              </div>
            </div>
            <div className="products-grid">
              {filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} favorite={favorites.includes(product.id)} onFavorite={() => toggleFavorite(product.id)} onAdd={() => addToCart(product)} onQuickView={() => setQuickProduct(product)} />)}
            </div>
            {filteredProducts.length === 0 && <div className="empty-state"><Search size={26} /><strong>لم نجد منتجات مطابقة</strong><span>جرّب كلمة بحث أخرى أو اختر فئة مختلفة.</span></div>}
            <div className="center-action"><button className="outline-button" onClick={() => { setCategory("الكل"); setSearchTerm(""); }}>عرض كل المنتجات <ArrowLeft size={16} /></button></div>
          </div>
        </section>

        <section className="featured-section section-space reveal" id="why">
          <div className="container">
            <div className="featured-panel">
              <div className="featured-glow" />
              <div className="featured-copy"><span className="section-kicker">صُمم للأداء</span><h2>إعدادك القادم<br /><span>يبدأ من هنا.</span></h2><p>لا نبيع مجرد قطع. نحن نساعدك على بناء تجربة كاملة تشبهك — من أول تشغيل إلى آخر انتصار.</p><div className="feature-list"><span><Check size={15} /> مكونات أصلية 100%</span><span><Check size={15} /> تجميع احترافي مجاني</span><span><Check size={15} /> دعم بعد البيع</span></div><button className="primary-button" onClick={() => setQuickProduct(products[0])}>صمّم جهازك <ArrowLeft size={17} /></button></div>
              <div className="featured-product"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><img src="/assets/techzone-build.jpg" alt="جهاز ألعاب Nebula X9 Pro" /><div className="featured-tag"><span>NEBULA X9 PRO</span><strong>قوة. بلا تنازل.</strong></div></div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="container stats-grid">
            <div className="stat-item reveal"><strong>12K<span>+</span></strong><small>عميل يثق بنا</small></div>
            <div className="stat-item reveal reveal-delay-1"><strong>98<span>%</span></strong><small>تقييمات إيجابية</small></div>
            <div className="stat-item reveal reveal-delay-2"><strong>24<span>h</span></strong><small>توصيل داخل المدينة</small></div>
            <div className="stat-item reveal reveal-delay-3"><strong>2<span>yr</span></strong><small>ضمان ممتد</small></div>
          </div>
        </section>

        <section className="newsletter-section section-space reveal">
          <div className="container"><div className="newsletter-card"><div className="newsletter-orb" /><div><span className="section-kicker">ابقَ في الصورة</span><h2>لا تفوّت <span>الترقية القادمة.</span></h2><p>عروض حصرية، إطلاقات جديدة، وإلهام لإعدادك — مباشرة إلى بريدك.</p></div><form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); if (newsletter) setSubscribed(true); }}><div className="email-input"><input type="email" required value={newsletter} onChange={(event) => setNewsletter(event.target.value)} placeholder="بريدك الإلكتروني" aria-label="البريد الإلكتروني" /><button type="submit" aria-label="اشتراك"><ArrowLeft size={18} /></button></div>{subscribed ? <span className="success-note"><Check size={14} /> تم الاشتراك بنجاح</span> : <small>باشتراكك، أنت توافق على سياسة الخصوصية.</small>}</form></div></div>
        </section>
      </main>

      <footer className="site-footer"><div className="container footer-main"><div className="footer-brand"><a className="brand" href="#top"><span className="brand-mark"><Cpu size={19} strokeWidth={2.5} /></span><span className="brand-name">TECH<span>ZONE</span></span></a><p>التقنية، كما يجب أن تكون.</p></div><div className="footer-links"><div><strong>استكشف</strong><a href="#products">المتجر</a><a href="#categories">الفئات</a><a href="#why">عن TechZone</a></div><div><strong>مساعدة</strong><a href="#top">تواصل معنا</a><a href="#top">الشحن والتوصيل</a><a href="#top">الضمان</a></div></div><div className="footer-social"><strong>تابع الرحلة</strong><div><a href="#top">ig</a><a href="#top">X</a><a href="#top">in</a></div></div></div><div className="container footer-bottom"><span>© 2025 TechZone. صُنع بشغف للتقنية.</span><span>صنع في السعودية <span className="saudi-dot" /></span></div></footer>

      {isCartOpen && <div className="modal-layer" onClick={() => setIsCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="section-kicker">مراجعة الطلب</span><h3>سلة التسوق <span>({cartCount})</span></h3></div><button className="close-button" onClick={() => setIsCartOpen(false)} aria-label="إغلاق"><X size={20} /></button></div>{cart.length === 0 ? <div className="cart-empty"><ShoppingCart size={38} /><strong>سلتك فارغة حالياً</strong><span>ابدأ بإضافة ما يعجبك من المنتجات.</span><button className="primary-button" onClick={() => { setIsCartOpen(false); scrollToProducts(); }}>اكتشف المنتجات</button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt={item.name} /><div className="cart-item-info"><strong>{item.name}</strong><small>{item.specs}</small><b>{formatPrice(item.price)} <small>ر.س</small></b><div className="quantity"><button onClick={() => updateQuantity(item.id, -1)}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)}><Plus size={13} /></button></div></div><button className="remove-item" onClick={() => setCart((current) => current.filter((cartItem) => cartItem.id !== item.id))}><Trash2 size={15} /></button></div>)}</div><div className="drawer-summary"><div><span>المجموع الفرعي</span><strong>{formatPrice(cartTotal)} <small>ر.س</small></strong></div><div><span>الشحن</span><strong className="free-shipping">مجاني</strong></div><div className="total-line"><span>الإجمالي</span><strong>{formatPrice(cartTotal)} <small>ر.س</small></strong></div><button className="primary-button full-button" onClick={() => setToastMsg("نموذج الدفع التجريبي جاهز — شكراً لاختيارك TechZone")}>إتمام الطلب <ArrowLeft size={17} /></button></div></>}</aside></div>}

      {quickProduct && <div className="modal-layer" onClick={() => setQuickProduct(null)}><div className="quick-modal" onClick={(event) => event.stopPropagation()}><button className="close-button modal-close" onClick={() => setQuickProduct(null)} aria-label="إغلاق"><X size={20} /></button><div className="quick-image"><img src={quickProduct.image} alt={quickProduct.name} /></div><div className="quick-details"><span className="section-kicker">تفاصيل المنتج</span><h3>{quickProduct.name}</h3><div className="rating"><Star size={15} fill="currentColor" /><strong>{quickProduct.rating}</strong><span>({quickProduct.reviews} تقييم)</span></div><p>{quickProduct.specs}. صُمم ليقدم لك أداءً ثابتاً وتجربة استخدام استثنائية في كل مرة.</p><div className="quick-price">{formatPrice(quickProduct.price)} <small>ر.س</small>{quickProduct.oldPrice && <del>{formatPrice(quickProduct.oldPrice)} ر.س</del>}</div><button className="primary-button full-button" onClick={() => { addToCart(quickProduct); setQuickProduct(null); }}>أضف إلى السلة <ShoppingBag size={17} /></button></div></div></div>}
      {toastMsg && <div className="toast"><span><Check size={15} /></span>{toastMsg}<button onClick={() => setToastMsg("")}><X size={14} /></button></div>}
    </div>
  );
}

function ProductCard({ product, index, favorite, onFavorite, onAdd, onQuickView }: { product: Product; index: number; favorite: boolean; onFavorite: () => void; onAdd: () => void; onQuickView: () => void }) {
  return <article className={`product-card reveal reveal-delay-${(index % 4) + 1}`}><div className={`product-visual ${product.color}`}><img src={product.image} alt={product.name} /><div className="visual-shade" /><div className="product-actions"><button className={favorite ? "fav active" : "fav"} onClick={onFavorite} aria-label="إضافة للمفضلة"><Heart size={17} fill={favorite ? "currentColor" : "none"} /></button><button className="quick" onClick={onQuickView}><Eye size={16} /> نظرة سريعة</button></div>{product.badge && <span className="product-badge">{product.badge}</span>}</div><div className="product-info"><div className="product-meta"><span>{product.category}</span><div className="rating"><Star size={13} fill="currentColor" /><strong>{product.rating}</strong><small>({product.reviews})</small></div></div><h3>{product.name}</h3><p>{product.specs}</p><div className="product-bottom"><div className="price"><strong>{formatPrice(product.price)}</strong><small>ر.س</small>{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div><button className="add-button" onClick={onAdd} aria-label={`إضافة ${product.name}`}><Plus size={19} /></button></div></div></article>;
}
