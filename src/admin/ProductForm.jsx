import { useState } from 'react';
import './ProductForm.css';

function ProductForm({ product, categories, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: product?.id || null,
    name: product?.name || '',
    price: product?.price || '',
    oldPrice: product?.oldPrice || '',
    category: product?.category || categories[0]?.id || '',
    image: product?.image || '📦',
    stock: product?.stock !== undefined ? product.stock : true,
    stockCount: product?.stockCount || 0,
    rating: product?.rating || 4.5
  });

  const emojis = ['📦', '🔧', '🧱', '🎨', '🪵', '⚡', '📺', '🧤', '⛑️', '🔨', '🛠️', '🧰', '🥛', '🍞', '🥩'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      stock: formData.stock === true,
      stockCount: formData.stock === true ? Number(formData.stockCount) : 0,
      rating: Number(formData.rating)
    });
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form-modal">
        <div className="form-header">
          <h2>{product?.id ? '✏️ Mahsulotni tahrirlash' : '➕ Yangi mahsulot qo\'shish'}</h2>
          <button className="close-form" onClick={onCancel}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mahsulot nomi *</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Masalan: Mineral vata" />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Narxi (so'm) *</label>
              <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="50000" />
            </div>
            <div className="form-group">
              <label>Eski narxi (chegirma)</label>
              <input type="number" value={formData.oldPrice} onChange={(e) => setFormData({...formData, oldPrice: e.target.value})} placeholder="60000" />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Kategoriya *</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
            </div>
            <div className="form-group">
              <label>Reyting (1-5)</label>
              <input type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Emoji/ikonka</label>
              <div className="emoji-selector">
                <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="📦" maxLength={2} />
                <div className="emoji-list">
                  {emojis.map(emoji => (<button key={emoji} type="button" className={`emoji-option ${formData.image === emoji ? 'active' : ''}`} onClick={() => setFormData({...formData, image: emoji})}>{emoji}</button>))}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Stok holati</label>
              <select value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value === 'true'})}>
                <option value="true">Bor</option>
                <option value="false">Yo'q (tugagan)</option>
              </select>
            </div>
          </div>
          
          {formData.stock === true && (
            <div className="form-group">
              <label>Stok soni</label>
              <input type="number" value={formData.stockCount} onChange={(e) => setFormData({...formData, stockCount: e.target.value})} placeholder="100" />
            </div>
          )}
          
          <div className="form-buttons">
            <button type="button" className="btn-cancel" onClick={onCancel}>Bekor qilish</button>
            <button type="submit" className="btn-submit">{product?.id ? 'Saqlash' : 'Qo\'shish'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;