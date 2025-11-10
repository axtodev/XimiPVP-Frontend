import React, { useEffect, useState } from 'react';
import '../style/onlineStaff.css';
import { useNavigate } from 'react-router-dom';

export default function StaffOnline({ token }) {
  const [staffOnline, setStaffOnline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const roleNames = {
    '68efbfb7ebef2c1956dff5e0': 'Owner',
    '68efd499ebef2c1956dff96a': 'Amministratore',
    '68efd499ebef2c1956dff96b': 'Developer',
    '68efd499ebef2c1956dff96c': 'Moderatore',
    '68efd499ebef2c1956dff96d': 'Builder',
  };


  const roleOrder = ["Owner", "Amministratore", "Developer", "Moderatore", "Builder"];


  const rolePriority = roleOrder.reduce((acc, role, index) => {
    acc[role] = index;
    return acc;
  }, {});

  const getMainRole = (roles) => {
    if (!Array.isArray(roles) || !roles.length) return 'Utente';
    const roleLabels = roles.map(r => roleNames[r]).filter(Boolean);
    if (!roleLabels.length) return 'Utente';
    return roleLabels.reduce((best, current) => {
      if (best === null) return current;
      return rolePriority[current] < rolePriority[best] ? current : best;
    }, null);
  };

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://api.ximi.lol/users/staff/online');
        if (!res.ok) throw new Error(`Errore: ${res.status}`);
        const data = await res.json();

        const sorted = data.sort((a, b) => {
          const roleA = getMainRole(a.roles);
          const roleB = getMainRole(b.roles);
          return (rolePriority[roleA] ?? 999) - (rolePriority[roleB] ?? 999);
        });

        setStaffOnline(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
    const interval = setInterval(fetchStaff, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!token) return;
    const updateLastSeen = async () => {
      try {
        const res = await fetch('https://api.ximi.lol/users/lastseen', {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Token non valido');
      } catch (e) {
      }
    };
    updateLastSeen();
    const interval = setInterval(updateLastSeen, 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <aside>
      <h3>Staff Online</h3>
      {error ? (
        <p style={{ color: 'var(--error-color)' }}>Staff non disponibile</p>
      ) : loading ? (
        <p style={{ color: 'var(--primary)' }}>Caricamento...</p>
      ) : staffOnline.length ? (
        <ul className="staff-lists">
          {staffOnline.map(user => {
            const roleLabel = getMainRole(user.roles);
            return (
              <li 
                key={user._id} 
                className={`staff-card ${roleLabel.toLowerCase()}`} 
                onClick={() => navigate(`/profile/${user.username}`)}
              >
                <img
                  src={user.pfp || 'https://wallpapers.com/images/hd/blank-default-pfp-wue0zko1dfxs9z2c.jpg'}
                  alt={user.username}
                  className="staff-pfp"
                />
                <div className="staff-info">
                  <strong>{user.username}</strong>
                  <p>{roleLabel}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Nessuno staff online</p>
      )}
    </aside>
  );
}
