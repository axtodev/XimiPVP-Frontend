<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> 0c76dc1 (Initial commit)
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
<<<<<<< HEAD
=======
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
