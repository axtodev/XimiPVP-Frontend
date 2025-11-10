<<<<<<< HEAD
=======
<<<<<<< HEAD
import React from 'react';
import '../style/header.css';
import Logo from '../assets/logo.png';
import { LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Head() {
    const navigate = useNavigate();
    const isLogged = localStorage.getItem('token');
    const myUsername = localStorage.getItem('username'); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    }

    return (
        <div className="header">
            <div className="auth">
                {isLogged ? (
                    <>
                        <button onClick={() => navigate(`/profile/${myUsername}`)}>
                            <User /> Profilo
                        </button>
                        <button onClick={() => handleLogout()}><LogOut /> Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/login')}><LogIn /> Login</button>
                        <button onClick={() => navigate('/register')}><UserPlus /> Register</button>
                    </>
                )}
            </div>
            <img src={Logo} alt="Logo" draggable="false"/>
        </div>
    );
}

export default Head;
=======
>>>>>>> 0c76dc1 (Initial commit)
import React from 'react';
import '../style/header.css';
import Logo from '../assets/logo.png';
import { LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Head() {
    const navigate = useNavigate();
    const isLogged = localStorage.getItem('token');
    const myUsername = localStorage.getItem('username'); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    }

    return (
        <div className="header">
            <div className="auth">
                {isLogged ? (
                    <>
                        <button onClick={() => navigate(`/profile/${myUsername}`)}>
                            <User /> Profilo
                        </button>
                        <button onClick={() => handleLogout()}><LogOut /> Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/login')}><LogIn /> Login</button>
                        <button onClick={() => navigate('/register')}><UserPlus /> Register</button>
                    </>
                )}
            </div>
            <img src={Logo} alt="Logo" draggable="false"/>
        </div>
    );
}

export default Head;
<<<<<<< HEAD
=======
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
