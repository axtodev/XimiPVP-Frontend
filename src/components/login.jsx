import React, { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
