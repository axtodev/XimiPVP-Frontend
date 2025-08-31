import { useState, useRef, useEffect } from "react";

export default function ProfileRoles({ userData, updateUserRoles, currentUserRoles }) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef(null);

  const allRoles = [
    { _id: '68b1b97a0042c37ceb374d8c', name: 'Owner' },
    { _id: '68825b15b31d59e453e3061f', name: 'Amministratore' },
    { _id: '68825b15b31d59e453e30623', name: 'Developer' },
    { _id: '68825b15b31d59e453e30626', name: 'Moderatore' },
    { _id: '68b1b5ad2069d4ab1f40868a', name: 'Builder' },
    { _id: '68b1b5ad2069d4ab1f40868e', name: 'Vip' },
    { _id: '68b1b97a0042c37ceb374d95', name: 'Media' },
    { _id: '68825b15b31d59e453e30629', name: 'Utente' },
  ];

  // Verifica se l'utente corrente può modificare i ruoli
  // In ProfileRoles, modifica la funzione:
const canEditRoles = () => {
  console.log('currentUserRoles:', currentUserRoles);
  console.log('is Array?', Array.isArray(currentUserRoles));
  
  if (!currentUserRoles || !Array.isArray(currentUserRoles)) {
    console.log('Non è un array valido');
    return false;
  }
  
  const canEdit = currentUserRoles.includes('Owner') || 
                 currentUserRoles.includes('Amministratore');
  
  console.log('Può modificare?', canEdit);
  return canEdit;
};

  // DEBUG: aggiungi questo console.log
  useEffect(() => {
    console.log('Ruoli utente corrente:', currentUserRoles);
    console.log('Può modificare ruoli:', canEditRoles());
  }, [currentUserRoles]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRoleMenu(false);
        if (canEditRoles()) {
          saveRoles(); 
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userData.roles]);

  const toggleRole = (role) => {
    if (!canEditRoles()) return;
    
    const currentIds = userData.roles.map(r => r._id);
    let updatedIds;
    
    if (currentIds.includes(role._id)) {
      updatedIds = currentIds.filter(id => id !== role._id);
    } else {
      updatedIds = [...currentIds, role._id];
    }

    const newRoles = allRoles
      .filter(r => updatedIds.includes(r._id))
      .map(r => ({ _id: r._id, name: r.name }));
    
    updateUserRoles(newRoles);
  };

  const saveRoles = async () => {
    if (!canEditRoles()) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/users/${userData._id}/roles`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roles: userData.roles.map(r => r.name) })
      });
      
      if (!res.ok) throw new Error('Errore nel salvataggio dei ruoli');

      const updatedUser = await res.json();
      console.log('Ruoli aggiornati dal backend:', updatedUser.roles);
      
      const normalizedRoles = updatedUser.roles.map(role => ({
        _id: role._id,
        name: role.name
      }));
      
      updateUserRoles(normalizedRoles);
      
    } catch (err) {
      console.error('Errore completo:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-roles-wrapper" ref={dropdownRef}>
      {/* Mostra i ruoli */}
      {userData.roles.length > 0 ? (
        userData.roles
          .sort((a, b) => {
            const order = ['Owner', 'Amministratore', 'Developer', 'Moderatore', 'Builder', 'Vip', 'Media', 'Utente'];
            return order.indexOf(a.name) - order.indexOf(b.name);
          })
          .map((role, index) => (
            <span key={index} className={`profile-role-tag ${role.name}`}>{role.name}</span>
          ))
      ) : (
        <span className="profile-role-tag Utente">Utente</span>
      )}

      {canEditRoles() && (
        <button onClick={() => setShowRoleMenu(prev => !prev)} className="role-dropdown-btn">+</button>
      )}

      {showRoleMenu && canEditRoles() && (
        <div className="role-dropdown-menu">
          {allRoles.map(role => (
            <label key={role._id} className="role-checkbox">
              <input
                type="checkbox"
                checked={userData.roles.some(r => r._id === role._id)}
                onChange={() => toggleRole(role)}
              />
              {role.name}
            </label>
          ))}
          {saving && <div>Salvataggio...</div>}
        </div>
      )}
    </div>
  );
}