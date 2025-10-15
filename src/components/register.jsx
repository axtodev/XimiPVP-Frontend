import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import '../style/register.css';

function Register() {
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Se l'utente è già loggato, reindirizza alla home
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);

    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className="register-container">
        <div className="register-success-box">
          <div className="success-icon">✓</div>
          <h2>Registrazione Avvenuta con Successo!</h2>
          <p className="success-message">
            Ti abbiamo inviato un'email di conferma all'indirizzo <strong>{form.email}</strong>.
            <br />
            Controlla la tua casella di posta e clicca sul link per attivare il tuo account.
          </p>
          <div className="success-actions">
            <button onClick={() => navigate('/login')} className="btn-primary">
              Vai al Login
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Torna alla Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            required
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            required
          />
          <button type="submit">Register</button>
          {error && <div className="register-error">{error}</div>}
        </form>

        <div className="register-links">
          <p>Hai già un account?</p>
          <a href="/login">Accedi</a>
        </div>
      </div>
    </div>
  );
}

export default Register;
