import { useState } from 'react';
import './AdminAuth.css';

function AdminAuth({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLogin();
      setError('');
    } else {
      setError('❌ Noto\'g\'ri parol!');
    }
  };

  return (
    <div className="admin-auth">
      <div className="auth-card">
        <div className="auth-logo">
          <span>🏗️</span>
          <h2>GAGARIN STROY MARKET</h2>
          <p>Admin Panel</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="auth-input">
            <label>🔐 Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parolni kiriting"
              autoFocus
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-btn">
            🚪 Kirish
          </button>
        </form>
        
        <div className="auth-hint">
          <p>Parol: <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
}

export default AdminAuth;