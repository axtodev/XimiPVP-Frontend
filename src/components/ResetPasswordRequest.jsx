import React, { useState } from 'react';

function ResetPasswordRequest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('https://api.ximi.lol/auth/reset-password-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error('Errore durante la richiesta di reset password');
      }

      const data = await res.json();
      setMessage('Se l\'email è registrata, riceverai un link per reimpostare la password.');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Reset Password</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Inserisci il tuo indirizzo email e ti invieremo un link per reimpostare la password.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Invio in corso...' : 'Invia link di reset'}
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

export default ResetPasswordRequest;
