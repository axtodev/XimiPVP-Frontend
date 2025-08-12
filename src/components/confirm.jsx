import React, { useEffect, useState } from 'react';
import '../style/confirm.css';

function ConfirmEmail() {
  const [message, setMessage] = useState({ text: 'Conferma in corso...', type: 'loading' });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setMessage({ text: 'Token mancante o non valido.', type: 'error' });
      return;
    }

    fetch('http://localhost:3000/auth/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Errore nella conferma');
        }
        return res.json();
      })
      .then(data => {
        setMessage({ text: 'Email confermata con successo! Ora puoi accedere.', type: 'success' });
      })
      .catch(err => {
        setMessage({ text: 'Errore nella conferma: ' + err.message, type: 'error' });
      });
  }, []);

  return (
    <div className="confirm-container">
      <div className="confirm-box">
        <h2>Conferma Email</h2>
        <p className={`confirm-message ${message.type}`}>
          {message.text}
        </p>
        {message.type === 'success' && (
          <a href="/" className="confirm-link">
            Torna alla home
          </a>
        )}
        {message.type === 'error' && (
          <a href="/" className="confirm-link">
            Torna alla Home
          </a>
        )}
      </div>
    </div>
  );
}

export default ConfirmEmail;