import { useState, useEffect } from 'react';
import './AdminPanel.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function AdminPanel({ onBack, onUpdate }) {
  // Yangi login va parol uchun holatlar (state)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    old_price: '',
    category: '',
    image: null,
    stock_count: 0,
    rating: 4.5,
    description: ''
  });

  const [categoryData, setCategoryData] = useState({
    name: '',
    image: null
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch(`${API_URL}/categories/`),
        fetch(`${API_URL}/products/`)
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addCategory = async () => {
    const categoryName = String(categoryData.name).trim();

    if (!categoryName) {
      alert('Kategoriya nomini kiriting!');
      return;
    }

    const data = new FormData();
    data.append('name', categoryName);

    if (categoryData.image && typeof categoryData.image !== 'string') {
      data.append('image', categoryData.image);
    }

    try {
      const res = await fetch(`${API_URL}/categories/`, {
        method: 'POST',
        body: data
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend xatosi: ${res.status} - ${errorText}`);
      }
      
      await fetchData();
      if (onUpdate) onUpdate();
      
      setCategoryData({ name: '', image: null });
      setCategoryImagePreview(null);
      setShowCategoryForm(false);
      alert('Kategoriya muvaffaqiyatli qo‘shildi!');
    } catch (err) {
      console.error('Kategoriya qo\'shishda xato:', err);
      alert('Xatolik yuz berdi! Qayta urinib ko\'ring.');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Kategoriyani o‘chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`${API_URL}/categories/${id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Kategoriya o‘chirilmadi');
      
      await fetchData();
      if (onUpdate) onUpdate();
      alert('Kategoriya o‘chirildi!');
    } catch (err) {
      alert('Xatolik: ' + err.message);
    }
  };

  const editProduct = (product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      old_price: product.old_price || '',
      category: product.category,
      image: product.image,
      stock_count: product.stock_count || 0,
      rating: product.rating || 4.5,
      description: product.description || ''
    });
    if (product.image) setImagePreview(product.image);
    setShowForm(true);
  };

  const saveProduct = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert('Barcha maydonlarni to‘ldiring!');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', Number(formData.price));
    data.append('category', Number(formData.category));
    data.append('stock_count', Number(formData.stock_count));
    data.append('rating', Number(formData.rating));
    data.append('description', formData.description);
    
    if (formData.old_price) {
      data.append('old_price', Number(formData.old_price));
    }

    if (formData.image && typeof formData.image !== 'string') {
      data.append('image', formData.image);
    }

    const url = isEditing ? `${API_URL}/products/${editingId}/` : `${API_URL}/products/`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: data
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend xatosi: ${res.status} - ${errorText}`);
      }

      await fetchData();
      if (onUpdate) onUpdate();
      
      setShowForm(false);
      resetForm();
      alert(isEditing ? 'Mahsulot tahrirlandi!' : 'Mahsulot qo‘shildi!');
    } catch (err) {
      alert('Xatolik: ' + err.message);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Mahsulotni o‘chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Mahsulot o‘chirilmadi');
      
      await fetchData();
      if (onUpdate) onUpdate();
      alert('Mahsulot o‘chirildi!');
    } catch (err) {
      alert('Xatolik: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      old_price: '',
      category: '',
      image: null,
      stock_count: 0,
      rating: 4.5,
      description: ''
    });
    setImagePreview(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleImageChange = (e, setPreview, setData, field) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setData(prev => ({ ...prev, [field]: file }));
    }
  };

  // Yangilangan Login tekshiruvi
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'gagarin_admin' && password === 'qarshi_stroy') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Login yoki parol noto‘g‘ri!');
    }
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => String(c.id) === String(categoryId));
    return cat ? cat.name : '-';
  };

  // Kirish oynasining yangi xavfsiz ko'rinishi
  if (!isAuthenticated) {
    return (
      <div className="admin-auth">
        <div className="auth-card">
          <div className="auth-logo">
            <span>🏗️</span>
            <h2>GAGARIN STROY MARKET</h2>
            <p>Admin Panel</p>
          </div>
          <form onSubmit={handleLogin}>
            {authError && <p style={{ color: '#ff4d4d', textAlign: 'center', fontSize: '14px', marginBottom: '10px', fontWeight: 'bold' }}>{authError}</p>}
            
            <div className="auth-input">
              <label>👤 Login</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                placeholder="Loginni kiriting" 
                required 
              />
            </div>
            
            <div className="auth-input">
              <label>🔐 Parol</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Parolni kiriting" 
                required 
              />
            </div>
            
            <button type="submit" className="auth-btn">🚪 Kirish</button>
          </form>
          {/* Pastdagi eski eslatma yozuvi butunlay olib tashlandi */}
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="admin-logo" onClick={onBack}>
          <div className="admin-logo-content"><span className="admin-rocket">🚀</span><div><h2>GAGARIN</h2><p className="admin-sub">STROY MARKET</p></div></div>
          <p className="back-hint">← Saytga qaytish</p>
        </div>
        <nav className="admin-nav">
          <button className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>📦 Mahsulotlar ({products.length})</button>
          <button className={`nav-btn ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>📂 Kategoriyalar ({categories.length})</button>
          <button className="nav-btn logout" onClick={() => { setIsAuthenticated(false); setUsername(''); setPassword(''); }}>🚪 Chiqish</button>
        </nav>
        <div className="admin-stats">
          <div className="stat-card"><span className="stat-icon">📦</span><div><div className="stat-value">{products.length}</div><div className="stat-label">Mahsulot</div></div></div>
          <div className="stat-card"><span className="stat-icon">📂</span><div><div className="stat-value">{categories.length}</div><div className="stat-label">Kategoriya</div></div></div>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-header">
          <h1>{activeTab === 'products' ? '📦 Mahsulotlarni boshqarish' : '📂 Kategoriyalarni boshqarish'}</h1>
          <div className="admin-actions">
            {activeTab === 'products' && (
              <>
                <input type="text" className="admin-search" placeholder="🔍 Mahsulot qidirish..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <button className="btn-add" onClick={() => { resetForm(); setShowForm(true); }}>➕ Yangi mahsulot</button>
              </>
            )}
            {activeTab === 'categories' && <button className="btn-add" onClick={() => setShowCategoryForm(true)}>➕ Yangi kategoriya</button>}
          </div>
        </div>

        {activeTab === 'categories' && showCategoryForm && (
          <div className="product-form-modal">
            <div className="form-header"><h2>➕ Yangi kategoriya qo'shish</h2><button className="close-form" onClick={() => setShowCategoryForm(false)}>✕</button></div>
            <form onSubmit={e => { e.preventDefault(); addCategory(); }}>
              <div className="form-group"><label>Kategoriya nomi *</label><input type="text" value={categoryData.name} onChange={e => setCategoryData({...categoryData, name: e.target.value})} required /></div>
              <div className="form-group"><label>Kategoriya rasmi</label><input type="file" accept="image/*" onChange={e => handleImageChange(e, setCategoryImagePreview, setCategoryData, 'image')} />{categoryImagePreview && <div className="image-preview"><img src={categoryImagePreview} alt="Preview" /><button type="button" onClick={() => { setCategoryImagePreview(null); setCategoryData({...categoryData, image: null}); }}>✕</button></div>}</div>
              <div className="form-buttons"><button type="button" className="btn-cancel" onClick={() => setShowCategoryForm(false)}>Bekor qilish</button><button type="submit" className="btn-submit">Qo'shish</button></div>
            </form>
          </div>
        )}

        {activeTab === 'products' && showForm && (
          <div className="product-form-modal">
            <div className="form-header"><h2>{isEditing ? '✏️ Mahsulotni tahrirlash' : '➕ Yangi mahsulot qo\'shish'}</h2><button className="close-form" onClick={() => { setShowForm(false); resetForm(); }}>✕</button></div>
            <form onSubmit={e => { e.preventDefault(); saveProduct(); }}>
              <div className="form-group"><label>Mahsulot nomi *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
              <div className="form-row"><div className="form-group"><label>Narxi (so'm) *</label><input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required /></div><div className="form-group"><label>Eski narxi (chegirma)</label><input type="number" value={formData.old_price} onChange={e => setFormData({...formData, old_price: e.target.value})} /></div></div>
              <div className="form-group"><label>Kategoriya *</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required><option value="">Tanlang</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div className="form-group"><label>Mahsulot rasmi</label><input type="file" accept="image/*" onChange={e => handleImageChange(e, setImagePreview, setFormData, 'image')} />{imagePreview && <div className="image-preview"><img src={imagePreview} alt="Preview" /><button type="button" onClick={() => { setImagePreview(null); setFormData({...formData, image: null}); }}>✕</button></div>}</div>
              <div className="form-group"><label>Tavsif</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" /></div>
              <div className="form-row"><div className="form-group"><label>Reyting (1-5)</label><input type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} /></div><div className="form-group"><label>Stok soni</label><input type="number" value={formData.stock_count} onChange={e => setFormData({...formData, stock_count: e.target.value})} /></div></div>
              <div className="form-buttons"><button type="button" className="btn-cancel" onClick={() => { setShowForm(false); resetForm(); }}>Bekor qilish</button><button type="submit" className="btn-submit">{isEditing ? 'Saqlash' : 'Qo\'shish'}</button></div>
            </form>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-product-table">
            <table><thead><tr><th>Rasm</th><th>Nomi</th><th>Kategoriya</th><th>Narxi</th><th>Stok</th><th>Reyting</th><th>Amallar</th></tr></thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:'center',padding:'40px'}}>📭 Mahsulotlar yo'q. Yangi mahsulot qo'shing!</td></tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td className="product-emoji-cell">{product.image ? <img src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`} alt={product.name} style={{width:'50px',height:'50px',objectFit:'cover',borderRadius:'8px'}} /> : '📦'}</td>
                    <td className="product-name-cell">{product.name}</td>
                    <td>{getCategoryName(product.category)}</td>
                    <td className="price-cell">{product.price.toLocaleString()} so'm</td>
                    <td><span className={`stock-badge ${product.stock_count > 0 ? 'in-stock' : 'out-stock'}`}>{product.stock_count > 0 ? `📦 ${product.stock_count}` : '❌ Tugagan'}</span></td>
                    <td className="rating-cell">⭐ {product.rating || 4.5}</td>
                    <td className="actions-cell"><button className="edit-btn" onClick={() => editProduct(product)}>✏️</button><button className="delete-btn" onClick={() => deleteProduct(product.id)}>🗑️</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        )}

        {activeTab === 'categories' && (
          <div className="categories-list">
            {categories.length === 0 ? (
              <div className="empty-state">📭 Kategoriyalar yo'q. Yangi kategoriya qo'shing!</div>
            ) : (
              categories.map(category => (
                <div key={category.id} className="category-card">
                  {category.image ? <img src={category.image.startsWith('http') ? category.image : `http://127.0.0.1:8000${category.image}`} alt={category.name} className="category-icon-image" /> : <span className="category-icon">📂</span>}
                  <div className="category-info"><h4>{category.name}</h4><p className="category-id">ID: {category.id}</p></div>
                  <button className="delete-category" onClick={() => deleteCategory(category.id)}>🗑️</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;