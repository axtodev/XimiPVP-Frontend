import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../style/profile.css';

export default function Profile() {
  const { username } = useParams(); // prende :username dall'URL
  const myUsername = localStorage.getItem('username');
  const isMyProfile = username === myUsername;

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
        const res = await fetch(`http://localhost:3000/users/info/${username}`);
        if (!res.ok) throw new Error('Utente non disponibile');
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [username]);

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

  const getLastSeen = (lastSeen) => {
    if (!lastSeen) return "Data non disponibile";
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now - date;
    if (diffMs < 5*60*1000) return "Online";
    if (diffMs < 60*60*1000) return `${Math.floor(diffMs/60000)} minuti fa`;
    if (date.toDateString() === now.toDateString()) return `${Math.floor(diffMs/(60*60*1000))} ore fa`;
    return date.toLocaleDateString('it-IT');
  };

  const seen = getLastSeen(userData.lastSeen);


    function formatDateOnly(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    }


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
                  onClick={() => isMyProfile && inputRef.current.click()}
                />
              </div>

              <div className="user-profile-info">
                <h3 className="user-profile-username">{userData.username || 'Nome Utente'}</h3>
                <div className="user-profile-roles-container">
                  {userData.roles?.length > 0 ? (
                    userData.roles.map((role, index) => (
                      <span key={index} className={`user-profile-role-tag ${role.name}`}>{role.name}</span>
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

            {isMyProfile && file && (
              <div className="user-profile-save-button-container">
                <button onClick={handleSave} className="user-profile-save-button">
                  Salva Nuova Immagine
                </button>
              </div>
            )}

            <div className="user-profile-details">
              <div className="user-profile-detail-item">
                <p>Ultimo Accesso:</p> <p className={`last-seen ${seen === "Online" ? "Online" : ""}`}>{seen}</p>
              </div>
              <div className="user-profile-detail-item">
                <p>Iscritto da:</p> {formatDateOnly(userData.createdAt)}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
