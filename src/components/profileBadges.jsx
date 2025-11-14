import { useState, useRef, useEffect } from "react";

export default function ProfileBadges({ userData, updateUserBadges, currentUserRoles }) {
  const [showBadgeMenu, setShowBadgeMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef(null);

  const allBadges = [
    { _id: '68f27be557b31fc8c027d88c', name: 'Donator' },
    { _id: '68f27be557b31fc8c027d88f', name: 'Veterano' },
    { _id: '68f27be557b31fc8c027d892', name: 'Staff' },
    { _id: '68f27be557b31fc8c027d895', name: 'Beta Tester' },
    { _id: '68f27be557b31fc8c027d898', name: 'VIP' },
    { _id: '68f27be557b31fc8c027d89b', name: 'Founder' },
    { _id: '68f27be557b31fc8c027d89e', name: 'Sviluppo' },
    { _id: '68f27be557b31fc8c027d886', name: '1# Donator' },
  ];

  const canEditBadges = () => {
    if (!currentUserRoles || !Array.isArray(currentUserRoles)) {
      return false;
    }
    
    const canEdit = currentUserRoles.includes('Owner') || 
                   currentUserRoles.includes('Amministratore');
    
    return canEdit;
  };
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
      const res = await fetch(`https://api.ximi.lol/users/${userData._id}/badges`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ badges: userData.badges ? userData.badges.map(b => b.name) : [] })
      });
      
      if (!res.ok) throw new Error('Errore nel salvataggio dei badge');

      const updatedUser = await res.json();
      
      const normalizedBadges = updatedUser.badges ? updatedUser.badges.map(badge => ({
        _id: badge._id,
        name: badge.name
      })) : [];
      
      updateUserBadges(normalizedBadges);
      
    } catch (err) {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-badges-wrapper" ref={dropdownRef}>
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
