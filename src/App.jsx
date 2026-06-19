import { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import ViewedProducts from './components/ViewedProducts'; 
import Recommended from './components/Recommended';
import CategoryList from './components/CategoryList';
import Footer from './components/Footer';
import AdminPanel from './admin/AdminPanel';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function App() {
  const navigate = useNavigate();
  const [showAdmin, setShowAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [viewed, setViewed] = useState(() => {
    const saved = localStorage.getItem('viewedProducts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('viewedProducts', JSON.stringify(viewed));
  }, [viewed]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories/`);
      if (!res.ok) throw new Error('Kategoriyalarni yuklashda xatolik');
      setCategories(await res.json());
    } catch (err) {
      setError(err.message);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products/`);
      if (!res.ok) throw new Error('Mahsulotlarni yuklashda xatolik');
      setProducts(await res.json());
    } catch (err) {
      setError(err.message);
      setProducts([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchProducts()]);
      setLoading(false);
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSearch = (text) => setSearchQuery(text);
  const clearSearch = () => setSearchQuery('');

  const addToCart = (product) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === product.id);
      if (exist) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const cartCount = useMemo(() => cart.reduce((s, i) => s + (i.quantity || 0), 0), [cart]);
  const addToViewed = (id) => {
    if (!viewed.includes(id)) setViewed([id, ...viewed].slice(0, 12));
  };

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];
    let filtered = [...products];
    if (activeCategory !== 'all') filtered = filtered.filter(p => p.category == activeCategory);
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name?.toLowerCase().includes(term));
    }
    return filtered;
  }, [products, activeCategory, searchQuery]);

  const getImageUrl = (product) => {
    if (!product) return null;
    if (product.image) {
      if (product.image.startsWith('http')) return product.image;
      return `http://127.0.0.1:8000${product.image}`;
    }
    return null;
  };

  const handleAdminUpdate = () => {
    fetchCategories();
    fetchProducts();
  };

  const handleBackFromAdmin = () => {
    setShowAdmin(false);
    handleAdminUpdate();
  };

  const MainPage = () => (
    <div className={`app-wrapper ${darkMode ? 'dark' : ''}`}>
      <Header 
        cartCount={cartCount}
        onSearch={handleSearch}
        onClear={clearSearch}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />
      <main className="main-content container">
        <CategoryList categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        {viewed.length > 0 && (
          <ViewedProducts viewedProducts={viewed} products={products} addToCart={addToCart} addToViewed={addToViewed} getImageUrl={getImageUrl} />
        )}
        <div className="results-info">
          <h2>📦 Mahsulotlar <span className="result-count">{filteredProducts.length}</span></h2>
          {searchQuery && (
            <div className="search-info">
              "{searchQuery}" bo‘yicha <button onClick={clearSearch}>✕</button>
            </div>
          )}
        </div>
        {loading ? (
          <div className="loading-spinner">Yuklanmoqda...</div>
        ) : filteredProducts.length > 0 ? (
          <Recommended products={filteredProducts} addToCart={addToCart} addToViewed={addToViewed} getImageUrl={getImageUrl} />
        ) : (
          <div className="no-results"><span>🔍</span><h3>Mahsulot topilmadi</h3><p>Boshqa kategoriya yoki qidiruv so‘zini tanlang</p></div>
        )}
        <div className="call-to-action-section">
          <button className="callback-btn" onClick={() => navigate('/contact')}>📞 Qo‘ng‘iroq buyurtma qilish</button>
        </div>
      </main>
      <Footer darkMode={darkMode} />

     
      <button className="admin-trigger-btn" onClick={() => setShowAdmin(true)}>🔧</button>
      {showScrollTop && <button className="scroll-top-btn" onClick={scrollToTop}>↑</button>}
    </div>
  );

  if (showAdmin) return <AdminPanel onBack={handleBackFromAdmin} onUpdate={handleAdminUpdate} />;
  if (isLoading || loading) return <div className="loader-container"><div className="loader-rocket">🚀</div><p>GAGARIN STROY MARKET</p><p className="loader-sub">Sifatga yo‘naltirilgan!</p></div>;
  if (error) return <div className="error-container"><h2>⚠️ Xatolik</h2><p>{error}</p><button onClick={() => window.location.reload()}>Qayta yuklash</button></div>;

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/contact" element={<Contact darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/cart" element={<Cart cart={cart} setCart={setCart} darkMode={darkMode} />} />
    </Routes>
  );
}

export default App;