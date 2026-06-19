import { useNavigate } from 'react-router-dom';
import './Contact.css';

function Contact({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  return (
    <div className={`contact-page ${darkMode ? 'dark' : ''}`}>
      {/* Header qismi */}
      <div className="contact-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Bosh sahifaga qaytish
        </button>
        <button 
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Asosiy kontent */}
      <div className="contact-container">
        <div className="contact-info-card">
          <h1 className="contact-title">
            📞 Biz bilan bog'lanish
          </h1>
          
          <div className="info-section">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <h3>Manzil</h3>
                <p>Toshkent, Bektermir tumani</p>
                <p>Qo'yliq qurilish bozori</p>
                <p className="info-detail">Pavilion №17, 2-qavat</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <h3>Telefon raqamlari</h3>
                <p>+998 90 915 85 15</p>
                <p>+998 71 123 45 67</p>
                <p className="info-detail">24/7 ishlaymiz</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">✉️</span>
              <div>
                <h3>Email</h3>
                <p>info@gagarinmarket.uz</p>
                <p>sales@gagarinmarket.uz</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">⏰</span>
              <div>
                <h3>Ish vaqti</h3>
                <p>Dushanba - Shanba: 09:00 - 21:00</p>
                <p>Yakshanba: 10:00 - 18:00</p>
              </div>
            </div>
          </div>

          {/* Call to action tugmalari */}
          <div className="action-buttons">
            <a href="tel:+998909158515" className="call-btn">
              📞 Hoziroq qo'ng'iroq qiling
            </a>
            <a href="https://t.me/gagarinmarket" target="_blank" rel="noopener noreferrer" className="telegram-btn">
              💬 Telegram
            </a>
          </div>
        </div>

        {/* Rasm va xarita qismi */}
        <div className="contact-media-card">
          <div className="shop-image">
            <h3>🏪 Magazinimiz</h3>
            <div className="image-placeholder">
              <img 
                src="/shop-image.jpg" 
                alt="GAGARIN STROY MARKET" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400?text=GAGARIN+STROY+MARKET';
                }}
              />
            </div>
          </div>

          <div className="map-container">
            <h3>🗺️ Bizni xaritada toping</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2998.123456789!2d69.279837!3d41.264176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8a9b0b7a5b9d%3A0x2b5c8c5e5a5a5a5a!2sQo%27yliq%20Construction%20Market!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: '16px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GAGARIN STROY MARKET location"
            ></iframe>
            <p className="map-note">
              📍 Aniq manzil: Toshkent, Bektermir tumani, Qo'yliq qurilish bozori
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;