import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Head from './components/header';
import Nav from './components/navbar';
import Hero from './components/hero';
import Slider from './components/info';
import Footer from './components/footer';
import Staff from './pages/staff.jsx';
import Logins from './pages/auth/login.jsx';
import Registers from './pages/auth/register.jsx';
import Confirm from './pages/auth/confirm.jsx';
import Forum from './pages/forum.jsx';
import './style/Root.css';

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error('Errore nel parsing del user da localStorage:', e);
      setUser(null);
    }
  }
}, []);

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/confirm' && (
        <>
          <Head />
          <Nav />
        </>
      )}

      <Routes>
        <Route path='/register' element={<Registers />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/login" element={<Logins />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="forum" element={<Forum />} />
      </Routes>

      {location.pathname === '/' && (
        <>
          <Hero />
          <Slider />
        </>
      )}
      {location.pathname !== '/login' && location.pathname !== '/register' && (
        <>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;