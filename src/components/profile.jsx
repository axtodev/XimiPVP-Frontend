import { useState, useEffect, useRef } from 'react';
import '../style/profile.css'

export default function Profile() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [userData, setUserData] = useState({
    pfp: '',
    username: '',
    roles: [],
    createdAt: '',
    lastSeen: ''
  });
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3000/users/profile', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (!res.ok) throw new Error('Errore nel recupero utente');
        const data = await res.json();
        
        const pfpRes = await fetch('http://localhost:3000/users/pfp', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const pfpData = await pfpRes.json();
        
        setUserData({
          pfp: pfpData.pfp || '',
          username: data.username || '',
          roles: data.roles || [],
          createdAt: data.createdAt || '',
          lastSeen: data.lastSeen || ''
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };


  const handleSave = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('pfp', file);

    try {
      const res = await fetch('http://localhost:3000/users/profile-picture', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Errore nell\'aggiornamento della pfp');
      const data = await res.json();
      setUserData(prev => ({ ...prev, pfp: data.pfp }));
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Formatta la data
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcola da quanto tempo è registrato
  const getAccountAge = (createdAt) => {
    if (!createdAt) return 'N/A';
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} giorno${diffDays !== 1 ? 'i' : ''}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} mese${months !== 1 ? 'i' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} anno${years !== 1 ? 'i' : ''}${remainingMonths > 0 ? ` e ${remainingMonths} mese${remainingMonths !== 1 ? 'i' : ''}` : ''}`;
    }
  };

 function getDates(userData) {
  if (!userData || !userData.lastSeen) return "Data non disponibile";

  const formatted = formatDate(userData.lastSeen);
  if (!formatted) return "Data non disponibile";

  const [datePart, timePart] = formatted.split(',');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  const lastSeenDate = new Date(year, month - 1, day, hour, minute);
  const now = new Date();
  const diffMs = now - lastSeenDate;

  if (diffMs < 5 * 60 * 1000) return "Online";
  if (diffMs < 60 * 60 * 1000) return `${Math.floor(diffMs / (60 * 1000))} minuti fa`;
  if (day === now.getDate() && month === now.getMonth() + 1 && year === now.getFullYear()) {
    return `${Math.floor(diffMs / (60 * 60 * 1000))} ore fa`;
  }

  return `${day}/${month}/${year}`;
}

const seen = getDates(userData)



  return (
    <div className="body">
  <div className="user-profile-wrapper">
  <div className="user-profile-main-content">
    <h2 className="user-profile-title">Profilo Utente</h2>
    
    <div className="user-profile-thread">
      <div className="user-profile-card-header">
        <h3>Informazioni Account</h3>
      </div>
      
      <div className="user-profile-header">
        <div className="user-profile-picture-container">
          <img
            src={preview || userData.pfp || 'https://wallpapers.com/images/hd/blank-default-pfp-wue0zko1dfxs9z2c.jpg'}
            alt="Profile"
            className="user-profile-image"
            onClick={() => inputRef.current.click()}
          />
        </div>
        
        <div className="user-profile-info">
          <h3 className="user-profile-username">{userData.username || 'Nome Utente'}</h3>
          <div className="user-profile-roles-container">
            {userData.roles && userData.roles.length > 0 ? (
              userData.roles.map((role, index) => (
                <span key={role._id || index} className={`user-profile-role-tag ${role.name}`}>{role.name}</span>
              ))
            ) : (
              <span className="user-profile-role-tag">Utente</span>
            )}
          </div>
        </div>
      </div>
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="user-profile-file-input"
        onChange={handleFileChange}
      />

      {file && (
        <div className="user-profile-save-button-container">
          <button onClick={handleSave} className="user-profile-save-button">
            Salva Nuova Immagine
          </button>
        </div>
      )}
      
      <div className="user-profile-details">
        <div className="user-profile-detail-item">
        </div>
        <div className="user-profile-detail-item">
          <strong>Ultimo Accesso:</strong> <p className={seen}>{seen}</p>
        </div>
        <div className="user-profile-detail-item">
        </div>
      </div>
    </div>
  </div>
</div>
</div>

);
}