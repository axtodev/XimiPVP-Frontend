  import { useState, useEffect, useRef } from 'react';
  import { useParams } from 'react-router-dom';
  import '../style/profile.css';

  export default function Profile() {
    const { username } = useParams(); 
    const myUsername = localStorage.getItem('username');
    const isMyProfile = username === myUsername;

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [userData, setUserData] = useState({
      pfp: '',
      username: '',
      roles: [],
      createdAt: '',
      lastSeen: '',
      bio: '',
      postsCount: 0,
      threadsCount: 0,
      likesReceived: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const inputRef = useRef(null);

    useEffect(() => {
      const fetchUser = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch(`http://localhost:3000/users/info/${username}`);
          if (!res.ok) throw new Error('Utente non disponibile');
          const data = await res.json();
          setUserData(data);
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    }, [username]);

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;
      
      if (!selectedFile.type.startsWith('image/')) {
        setError('Per favore seleziona un file immagine');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('L\'immagine non deve superare i 5MB');
        return;
      }
      
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    };

    const handleSave = async () => {
      if (!file) return;
      
      setIsLoading(true);
      const formData = new FormData();
      formData.append('pfp', file);

      try {
        const res = await fetch('http://localhost:3000/users/profile-picture', {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: formData,
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Errore nell\'aggiornamento della pfp');
        }
        
        const data = await res.json();
        setUserData(prev => ({ ...prev, pfp: data.pfp }));
        setFile(null);
        setPreview(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
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


    if (isLoading) {
      return (
        <div className="profile-full-width">
          <div className="profile-container">
            <div className="loading-spinner">Caricamento...</div>
          </div>
        </div>
      );
    }

    // Se c'è un errore
    if (error && !userData.username) {
      return (
        <div className="profile-full-width">
          <div className="profile-container">
            <div className="error-message">
              <h3>Errore</h3>
              <p>{error}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="profile-full-width">
        <div className="profile-header-banner"></div>
        
        <div className="profile-container">
          {error && (
            <div className="error-banner">
              {error}
              <button onClick={() => setError(null)}>X</button>
            </div>
          )}

          <div className="profile-content">
            <div className="profile-main">
              <div className="profile-main-header">
                <h1>Profilo Utente</h1>
              </div>

              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-picture-container"  onClick={() => isMyProfile && inputRef.current.click()}>
                    <img
                      src={preview || userData.pfp || 'https://wallpapers.com/images/hd/blank-default-pfp-wue0zko1dfxs9z2c.jpg'}
                      alt="Profile"
                      className="profile-image"
                    />
                    {isMyProfile && (
                      <div className="profile-picture-overlay">
                        <span>Cambia immagine</span>
                      </div>
                    )}
                  </div>

                  <div className="profile-info">
                    <h3 className="profile-username">{userData.username || 'Nome Utente'}</h3>
                    <div className="profile-roles-container">
                      {userData.roles?.length > 0 ? (
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
              </div>

                    
                    {userData.bio && (
                      <div className="profile-bio">
                        <p>{userData.bio}</p>
                      </div>
                    )}
                    
                    <div className="profile-stats">
                      <div className="stat-item">
                        <span className="stat-number">{userData.postsCount || 0}</span>
                        <span className="stat-label">Post</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{userData.threadsCount || 0}</span>
                        <span className="stat-label">Thread</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{userData.likesReceived || 0}</span>
                        <span className="stat-label">Mi piace</span>
                      </div>
                    </div>
                  </div>
                </div>

                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />


                {isMyProfile && file && (
                  <div className="profile-save-button-container">
                    <button 
                      onClick={handleSave} 
                      className="profile-save-button"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Salvataggio...' : 'Salva Nuova Immagine'}
                    </button>
                    <button 
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                      }} 
                      className="profile-cancel-button"
                    >
                      Annulla
                    </button>
                  </div>
                )}

                <div className="profile-details">
                  <div className="profile-detail-item">
                    <p>Ultimo Accesso:</p> 
                    <p className={`last-seen ${seen === "Online" ? "Online" : ""}`}>{seen}</p>
                  </div>
                  <div className="profile-detail-item">
                    <p>Iscritto da:</p> 
                    <p>{formatDateOnly(userData.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="profile-sidebar">
              <div className="sidebar-section">
                <h3>Attività Recente</h3>
                <div className="recent-activity">
                  <p>Nessuna attività recente</p>
                </div>
              </div>
              
              <div className="sidebar-section">
                <h3>Badge</h3>
                <div className="user-badges">
                  {userData.badges && userData.badges.length > 0 ? (
                    userData.badges.map((badge, index) => (
                      <span key={index} className={`user-badge  ${badge.name.replace(/\s+/g, '-').replace(/\d+/g, "").replace('#', "").toLowerCase()}`}>{badge.name}</span>
                    ))
                  ) : (
                    <p>Nessun badge ancora</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }