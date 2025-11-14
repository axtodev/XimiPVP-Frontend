import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Se l'utente è già loggato, reindirizza alla home
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
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <br />
          <div className="forgot-password-link">
            <a href="/reset-password">Password dimenticata?</a>
          </div>
          <div className="login-links">
            <p>Non hai un account?</p>
            <a href="/register">Registrati</a>
          </div>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
