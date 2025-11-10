import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { API_URL } from '../config/api';
=======
<<<<<<< HEAD
=======
import { API_URL } from '../config/api';
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
import '../style/confirm.css';

function ConfirmEmail() {
  const [message, setMessage] = useState({ text: 'Conferma in corso...', type: 'loading' });

  useEffect(() => {
<<<<<<< HEAD
    const urlParams = new URLSearchParams(window.location.search);
=======
<<<<<<< HEAD
    // Con Hash Router, i parametri sono in window.location.hash
    const hashParts = window.location.hash.split('?');
    const urlParams = new URLSearchParams(hashParts[1] || '');
=======
    const urlParams = new URLSearchParams(window.location.search);
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
    const token = urlParams.get('token');

    if (!token) {
      setMessage({ text: 'Token mancante o non valido.', type: 'error' });
      return;
    }

<<<<<<< HEAD
    fetch(`${API_URL}/auth/confirm`, {
=======
<<<<<<< HEAD
    fetch('https://api.ximi.lol/auth/confirm', {
=======
    fetch(`${API_URL}/auth/confirm`, {
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
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

<<<<<<< HEAD
export default ConfirmEmail;
=======
<<<<<<< HEAD
export default ConfirmEmail;
=======
export default ConfirmEmail;
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
