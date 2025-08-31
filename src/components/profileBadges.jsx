import { useState, useRef, useEffect } from "react";

export default function ProfileBadges({ userData, updateUserBadges, currentUserRoles }) {
  const [showBadgeMenu, setShowBadgeMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef(null);

  // Lista di tutti i badge disponibili
  const allBadges = [
    { _id: '68b22595f070ae56104991c6', name: 'Donator' },
    { _id: '68b22595f070ae56104991ca', name: 'Veterano' },
    { _id: '68b22595f070ae56104991cd', name: 'Staff' },
    { _id: '68b22595f070ae56104991d0', name: 'Beta Tester' },
    { _id: '68b22595f070ae56104991d3', name: 'VIP' },
    { _id: '68b22595f070ae56104991d6', name: 'Founder' },
    { _id: '68b22595f070ae56104991d9', name: 'Sviluppo' },
    { _id: '68b22a1bd1132a4472812809', name: '1# Donator' },
  ];

  // Verifica se l'utente corrente può modificare i badge
  const canEditBadges = () => {
    console.log('currentUserRoles per badge:', currentUserRoles);
    console.log('is Array?', Array.isArray(currentUserRoles));
    
    if (!currentUserRoles || !Array.isArray(currentUserRoles)) {
      console.log('Non è un array valido');
      return false;
    }
    
    const canEdit = currentUserRoles.includes('Owner') || 
                   currentUserRoles.includes('Amministratore');
    
    console.log('Può modificare badge?', canEdit);
    return canEdit;
  };

  // DEBUG: aggiungi questo console.log
  useEffect(() => {
    console.log('Ruoli utente corrente per badge:', currentUserRoles);
    console.log('Può modificare badge:', canEditBadges());
  }, [currentUserRoles]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowBadgeMenu(false);
        if (canEditBadges()) {
          saveBadges(); 
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userData.badges]);

  const toggleBadge = (badge) => {
    if (!canEditBadges()) return;
    
    const currentIds = userData.badges ? userData.badges.map(b => b._id) : [];
    let updatedIds;
    
    if (currentIds.includes(badge._id)) {
      updatedIds = currentIds.filter(id => id !== badge._id);
    } else {
      updatedIds = [...currentIds, badge._id];
    }

    const newBadges = allBadges
      .filter(b => updatedIds.includes(b._id))
      .map(b => ({ _id: b._id, name: b.name }));
    
    updateUserBadges(newBadges);
  };

  const saveBadges = async () => {
    if (!canEditBadges()) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/users/${userData._id}/badges`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ badges: userData.badges ? userData.badges.map(b => b.name) : [] })
      });
      
      if (!res.ok) throw new Error('Errore nel salvataggio dei badge');

      const updatedUser = await res.json();
      console.log('Badge aggiornati dal backend:', updatedUser.badges);
      
      // Normalizza i badge ricevuti dal backend
      const normalizedBadges = updatedUser.badges ? updatedUser.badges.map(badge => ({
        _id: badge._id,
        name: badge.name
      })) : [];
      
      updateUserBadges(normalizedBadges);
      
    } catch (err) {
      console.error('Errore nel salvataggio badge:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-badges-wrapper" ref={dropdownRef}>
      {/* Mostra i badge */}
      <div className="user-badges">
        {userData.badges && userData.badges.length > 0 ? (
          userData.badges.map((badge, index) => (
            <span key={index} className={`user-badge ${badge.name.replace(/\s+/g, '-').replace(/[#0-9]/g, '').toLowerCase()}`}>
              {badge.name}
            </span>
          ))
        ) : (
          <p>Nessun badge ancora</p>
        )}
      </div>

      {canEditBadges() && (
        <button onClick={() => setShowBadgeMenu(prev => !prev)} className="badge-dropdown-btn">
          +
        </button>
      )}

      {/* Dropdown dei badge */}
      {showBadgeMenu && canEditBadges() && (
        <div className="badge-dropdown-menu">
          <h4>Seleziona Badge</h4>
          {allBadges.map(badge => (
            <label key={badge._id} className="badge-checkbox">
              <input
                type="checkbox"
                checked={userData.badges && userData.badges.some(b => b._id === badge._id)}
                onChange={() => toggleBadge(badge)}
              />
              {badge.name}
            </label>
          ))}
          {saving && <div>Salvataggio...</div>}
        </div>
      )}
    </div>
  );
}