import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function ResetPasswordConfirm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token mancante o non valido');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }

    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      return;
    }

    if (!token) {
      setError('Token mancante');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('https://api.ximi.lol/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) {
        throw new Error('Errore durante il reset della password. Il token potrebbe essere scaduto.');
      }

      const data = await res.json();
      setMessage('Password reimpostata con successo! Verrai reindirizzato al login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Nuova Password</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Inserisci la tua nuova password.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nuova Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={isLoading || !token}
            minLength={6}
          />
          <input
            type="password"
            placeholder="Conferma Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading || !token}
            minLength={6}
          />
          <button type="submit" disabled={isLoading || !token}>
            {isLoading ? 'Salvataggio...' : 'Reimposta Password'}
          </button>
          <div className="login-links">
            <a href="/login">Torna al login</a>
          </div>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordConfirm;
