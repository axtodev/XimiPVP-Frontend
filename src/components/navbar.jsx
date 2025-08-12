import React from 'react';
import '../style/nav.css';
import { LayoutDashboard, MessageCircle, ShoppingCart, Users, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Nav() {
  const navigate = useNavigate();

  return (
    <nav>
      <ul>
        <li onClick={() => navigate('/')}>
          <LayoutDashboard /> Home
        </li>
        <li onClick={() => navigate('/staff')}>
          <Users /> Staff
        </li>
        <li onClick={() => navigate('/forum')} className='active'>
          <MessageCircle /> Forum
        </li>
        <li onClick={() => navigate('/store')}>
          <ShoppingCart /> Store
        </li>
        <li onClick={() => navigate('/regolamento')}>
         <Book /> Policy
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
