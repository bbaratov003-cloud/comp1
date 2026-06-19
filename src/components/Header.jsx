import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ cartCount, onSearch, onClear, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    onSearch(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchInput('');
    onClear();
  };

  return (
    <header className={`header ${darkMode ? 'dark' : ''}`}>
      <div className="top-bar">
        <div className="contacts">
          <span>📞 +998 90 915 85 15</span>
          <span className="separator">|</span>
          <span>✉️ info@gagarinmarket.uz</span>
        </div>
        <div className="header-right">
          <button className="dark-mode-btn" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      
      <div className="main-header">
        <div className="logo" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <span className="rocket-icon">🚀</span>
            <span className="star-icon">⭐</span>
          </div>
          <div className="logo-text">
            <span className="logo-main">GAGARIN</span>
            <span className="logo-sub">STROY MARKET</span>
          </div>
        </div>
        
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Mahsulot qidirish..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-btn" onClick={handleSearch}>🔍</button>
          {searchInput && (
            <button className="search-clear" onClick={handleClear}>✕</button>
          )}
        </div>
        
        <div className="header-actions">
          <button className="cart-btn" onClick={() => navigate('/cart')}>
            🛒 <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;