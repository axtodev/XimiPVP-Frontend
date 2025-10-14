import React from 'react';
import Login from '../../components/login';
import '../../style/login.css';
import '../../style/Root.css';

function Logins() {
  const handleLoginSuccess = () => {
     window.location.href = '/';
  };

  return (
    <>
      <div className="login">
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    </>
  );
}

export default Logins;
