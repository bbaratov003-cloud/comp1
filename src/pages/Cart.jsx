import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

// API manzili (App.jsx dagi bilan bir xil bo‘lishi kerak)
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function Cart({ cart, setCart, darkMode }) {
  const navigate = useNavigate();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================
  // SUMMA AVTOMATIK HISOBLANISHI
  // ============================================
  
  const totalPrice = useMemo(() => {
    let sum = 0;
    for (let item of cart) {
      const qty = Number(item.quantity) || 1;
      const price = Number(String(item.price).replace(/\s/g, '')) || Number(item.price) || 0;
      sum += price * qty;
    }
    return sum;
  }, [cart]);

  const totalItems = useMemo(() => {
    let count = 0;
    for (let item of cart) {
      count += Number(item.quantity) || 1;
    }
    return count;
  }, [cart]);

  const increaseQuantity = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.id === productId) {
          const currentQty = Number(item.quantity) || 1;
          return { ...item, quantity: currentQty + 1 };
        }
        return item;
      });
      return [...newCart];
    });
  };

  const decreaseQuantity = (productId) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === productId);
      const currentQty = Number(item?.quantity) || 1;
      if (currentQty <= 1) {
        return prevCart.filter(i => i.id !== productId);
      }
      const newCart = prevCart.map(i => {
        if (i.id === productId) {
          return { ...i, quantity: currentQty - 1 };
        }
        return i;
      });
      return [...newCart];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    if (window.confirm('Savatchani tozalasizmi?')) {
      setCart([]);
    }
  };

  const getItemTotal = (item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(String(item.price).replace(/\s/g, '')) || Number(item.price) || 0;
    return price * qty;
  };

  const formatPrice = (price) => {
    const num = Number(String(price).replace(/\s/g, '')) || Number(price) || 0;
    return num.toLocaleString();
  };

  // Telegram orqali yuborish (backendga)
  const sendToTelegram = async (phone, items, total) => {
    try {
      const res = await fetch(`${API_URL}/send-telegram/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, items, total })
      });
      return res.ok;
    } catch (error) {
      console.error('Telegram xatosi:', error);
      return false;
    }
  };

  const saveOrder = () => {
    const orderData = {
      id: Date.now(),
      phone: phoneNumber,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: Number(String(item.price).replace(/\s/g, '')) || Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        total: (Number(String(item.price).replace(/\s/g, '')) || Number(item.price) || 0) * (Number(item.quantity) || 1)
      })),
      total: totalPrice,
      itemsCount: totalItems,
      date: new Date().toISOString()
    };
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.unshift(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    return orderData;
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Savatcha bo\'sh!');
      return;
    }
    setShowPhoneModal(true);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+\(]?[0-9\(\)\-\s]{9,20}$/;
    return phoneRegex.test(phone);
  };

  const submitOrder = async () => {
    if (!phoneNumber || !validatePhone(phoneNumber)) {
      alert('Iltimos, to\'g\'ri telefon raqam kiriting!\nMasalan: +998 90 123 45 67');
      return;
    }
    setIsSubmitting(true);
    const telegramSent = await sendToTelegram(phoneNumber, cart, totalPrice);
    const savedOrder = saveOrder();
    if (telegramSent) {
      alert(`✅ Buyurtma qabul qilindi!\n\n📞 Sizning raqamingiz: ${phoneNumber}\n💰 Jami: ${totalPrice.toLocaleString()} so'm\n\nTez orada siz bilan bog'lanamiz!`);
    } else {
      alert(`✅ Buyurtma qabul qilindi!\n\n📞 Sizning raqamingiz: ${phoneNumber}\n💰 Jami: ${totalPrice.toLocaleString()} so'm\n\nBuyurtma raqami: ${savedOrder.id}\nTez orada siz bilan bog'lanamiz!`);
    }
    setCart([]);
    setShowPhoneModal(false);
    setPhoneNumber('');
    setIsSubmitting(false);
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className={`cart-empty ${darkMode ? 'dark' : ''}`}>
        <div className="cart-empty-content">
          <span className="empty-emoji">🛒</span>
          <h2>Savatcha bo'sh</h2>
          <p>Mahsulotlar qo'shing va buyurtma bering</p>
          <button className="back-shop-btn" onClick={() => navigate('/')}>
            🛍️ Mahsulotlar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`cart-page ${darkMode ? 'dark' : ''}`}>
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Bosh sahifaga qaytish
        </button>
        <h1>🛒 Savatcha</h1>
        <button className="clear-cart-btn" onClick={clearCart}>
          🗑️ Tozalash
        </button>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-items-header">
            <span className="col-product">Mahsulot</span>
            <span className="col-price">Narxi</span>
            <span className="col-quantity">Soni</span>
            <span className="col-total">Jami</span>
            <span className="col-action"></span>
          </div>

          {cart.map(item => {
            const qty = Number(item.quantity) || 1;
            const itemTotal = getItemTotal(item);
            return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-product">
                  <div className="cart-item-image">
                    {item.image ? <img src={item.image} alt={item.name} /> : <span className="product-emoji">📦</span>}
                  </div>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-category">{item.category_name || item.category?.name || '-'}</p>
                  </div>
                </div>
                <div className="cart-item-price">{formatPrice(item.price)} so'm</div>
                <div className="cart-item-quantity">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span className="quantity-number">{qty}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
                <div className="cart-item-total">{itemTotal.toLocaleString()} so'm</div>
                <div className="cart-item-action">
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h3>Buyurtma ma'lumoti</h3>
          <div className="summary-row">
            <span>Mahsulotlar soni:</span>
            <span className="summary-value">{totalItems} dona</span>
          </div>
          <div className="summary-row">
            <span>Umumiy summa:</span>
            <span className="summary-total">{totalPrice.toLocaleString()} so'm</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>To'lov summasi:</span>
            <span className="summary-grand-total">{totalPrice.toLocaleString()} so'm</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>💳 Buyurtma berish</button>
        </div>
      </div>

      {showPhoneModal && (
        <div className="phone-modal-overlay">
          <div className={`phone-modal ${darkMode ? 'dark' : ''}`}>
            <div className="phone-modal-header">
              <h3>📞 Telefon raqamingizni kiriting</h3>
              <button className="modal-close" onClick={() => setShowPhoneModal(false)}>✕</button>
            </div>
            <div className="phone-modal-body">
              <p className="modal-info">Buyurtmangizni tasdiqlash uchun telefon raqamingizni qoldiring. Biz sizga tez orada qo'ng'iroq qilamiz.</p>
              <input type="tel" className="phone-input" placeholder="+998 90 123 45 67" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} autoFocus />
              <div className="summary-preview">
                <div className="preview-row"><span>Mahsulotlar:</span><span>{totalItems} dona</span></div>
                <div className="preview-row total"><span>Jami summa:</span><span>{totalPrice.toLocaleString()} so'm</span></div>
              </div>
            </div>
            <div className="phone-modal-footer">
              <button className="cancel-btn" onClick={() => setShowPhoneModal(false)}>Bekor qilish</button>
              <button className={`submit-btn ${isSubmitting ? 'loading' : ''}`} onClick={submitOrder} disabled={isSubmitting}>
                {isSubmitting ? 'Yuborilmoqda...' : '✅ Buyurtma berish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;   // <--- MUHIM: eksport qilish