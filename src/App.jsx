  import React, { useEffect, useState } from 'react';
  import { Routes, Route, useLocation } from 'react-router-dom';
  import Banner from './biscotti/biscotti.jsx';
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
  import Profile from './pages/profile.jsx';
  import Bans from './pages/ban.jsx'
  import Store from './pages/store.jsx';
  import PolicyPage from './pages/policy.jsx';
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
        setUser(null);
      }
    }
  }, []);

    return (
      <>
        {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/confirm' &&(  
          <>
            <Head />
            <Nav />
          </>
        )}

    <Routes>
      <Route path="/" element={
        <>
          <Hero />
          <Slider />
        </>
      } />
      <Route path="/register" element={<Registers />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/login" element={<Logins />} />
      <Route path="/confirm" element={<Confirm />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/profile/:username" element={<Profile />} />
      <Route path="/bans" element={<Bans />} />
      <Route path="/store" element={<Store />} />
      <Route path="/policy" element={<PolicyPage />} />
    </Routes>

        {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/profile' && (
          <>
            <Footer />
          </>
        )}  
        <Banner />
      </>
    );
  }

  export default App;