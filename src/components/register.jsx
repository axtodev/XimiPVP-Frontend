import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import '../style/login.css'; // Use login.css since we're using those classes

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
      const res = await fetch('https://api.ximi.lol/auth/register', {
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
      <div className="login-container">
        <div className="login-form" style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            color: 'var(--primary)',
            animation: 'slide-up 0.5s ease forwards'
          }}>✓</div>
          <h2>Registrazione Completata!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Ti abbiamo inviato un'email di conferma all'indirizzo <strong>{form.email}</strong>.
            Controlla la tua posta per attivare l'account.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Vai al Login
          </button>
          <div className="login-links">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Torna alla Home</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Crea Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Scegli un username"
              required
            />
            <User size={20} />
          </div>
          <div className="input-group">
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="La tua email"
              type="email"
              required
            />
            <Mail size={20} />
          </div>
          <div className="input-group">
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Scegli una password"
              type="password"
              required
            />
            <Lock size={20} />
          </div>
          <button type="submit">Inizia l'Avventura</button>
          {error && <div className="login-error">{error}</div>}
        </form>

        <div className="login-links">
          <p>Hai già un account?</p>
          <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Accedi ora</a>
        </div>
      </div>
    </div>
  );
}

export default Register;
