import React from 'react';
import '../style/header.css'
import Logo from '../assets/logo.png'
import { LogIn, UserPlus, LogOut, User   } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Head(){
    const navigate = useNavigate();

    const isLogged = localStorage.getItem('token');

    const handleLogout = () =>{
        localStorage.removeItem('token');
        navigate('/login');
    }
    return(
        <>
        <div className="header">
            <div className="auth">
                {isLogged ? (
                    <>
                        <button> <User />Profilo</button>
                        <button onClick={() => handleLogout()}><LogOut />Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={()=> navigate('/login')}><LogIn />Login</button>
                        <button onClick={()=> navigate('/register')}><UserPlus />Register</button>
                    </>
                )}
            </div>

            <img src={Logo} alt="" draggable="false"/>
        </div>
        </>
    )
}

export default Head;