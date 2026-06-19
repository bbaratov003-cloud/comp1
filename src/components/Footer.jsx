import './Footer.css';

function Footer({ darkMode }) {
  return (
    <footer className={`footer ${darkMode ? 'dark' : ''}`}>
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              <span className="footer-rocket">🚀</span>
              <div>
                <h3>GAGARIN</h3>
                <p>STROY MARKET</p>
              </div>
            </div>
            <p className="footer-desc">
              Qurilish materiallari olamiga xush kelibsiz!
            </p>
          </div>
          <div className="footer-col">
            <h4>Kontakt</h4>
            <p>📞 +998 90 915 85 15</p>
            <p>✉️ info@gagarinmarket.uz</p>
            <p>📍 Toshkent, Bektermir tumani, Qo'yliq qurilish bozori</p>
          </div>
          <div className="footer-col">
            <h4>Ish vaqti</h4>
            <p>Dushanba - Shanba: 09:00 - 21:00</p>
            <p>Yakshanba: 10:00 - 18:00</p>
          </div>
          <div className="footer-col">
            <h4>Ijtimoiy tarmoqlar</h4>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">💬</a>
              <a href="#" className="social-link">🎵</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 GAGARIN STROY MARKET. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;