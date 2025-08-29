import React, { useEffect, useState } from 'react';
import '../style/onlineStaff.css';

export default function StaffOnline({ token }) {
  const [staffOnline, setStaffOnline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('http://localhost:3000/users/staff/online');
        if (!res.ok) throw new Error(`Errore: ${res.status}`);
        const data = await res.json();
        setStaffOnline(data);
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
        const res = await fetch('http://localhost:3000/users/lastseen', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Token non valido');
        console.log('lastSeen aggiornato');
      } catch (e) {
        console.error('Errore updateLastSeen:', e.message);
      }
    };

    updateLastSeen();
    const interval = setInterval(updateLastSeen, 60 * 1000); 
    return () => clearInterval(interval);
  }, [token]);

  const roleNames = {
    '68825b15b31d59e453e3061f': 'Amministratore',
    '68825b15b31d59e453e30623': 'Developer',
    '68825b15b31d59e453e30626': 'Moderatore',
    '68b1b5ad2069d4ab1f40868a': 'Builder'
  };

  return (
    <aside>
      <h3>Staff Online</h3>
      {error ? (
        <p style={{ color: 'var(--error-color)' }}>Staff non disponibile</p>
      ) : loading ? (
        <p style={{color: 'var(--primary)'}}>Caricamento...</p>
      ) : staffOnline.length ? (
        <ul className="staff-lists">
          {staffOnline.map(user => {
            const rolesLabels = Array.isArray(user.roles)
              ? user.roles.map(roleId => roleNames[roleId] || 'Ruolo sconosciuto')
              : [];

            return (
              <div key={user._id} className={`staff-card ${rolesLabels[0]?.toLowerCase()}`}>
                <strong>{user.username}</strong>
                <p>{rolesLabels.join(', ')}</p>
              </div>
            );
          })}
        </ul>
      ) : (
        <p>Nessuno staff online</p>
      )}
    </aside>
  );
}