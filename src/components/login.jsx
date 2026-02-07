import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://api.ximi.lol/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error('Credenziali non valide');
      }

      const data = await res.json();


      if (!data.user.isConfirmed) {
        setError("Account non verificato. Controlla la tua email.");
        return;
      }


      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('username', data.user.username);

      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Bentornato</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Inserisci la tua email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Mail size={20} />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Inserisci la tua password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Lock size={20} />
          </div>
          <button type="submit">Accedi al Portale</button>

          <div className="forgot-password-link">
            <a href="/reset-password">Hai dimenticato la password?</a>
          </div>
          <div className="login-links">
            <p>Sei nuovo qui?</p>
            <a href="/register">Crea un account ora</a>
          </div>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
