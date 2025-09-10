import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ProfileRoles from './profileRoles';
import ProfileBadges from './profileBadges';
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
    badges: [], 
    createdAt: '',
    lastSeen: '',
    bio: '',
    postsCount: 0,
    threadsCount: 0,
    likesReceived: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserRoles, setCurrentUserRoles] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          console.log('Dati utente corrente:', data); 
          
          const roleNames = data.roles ? data.roles.map(role => {
            if (typeof role === 'string') return role;
            if (role.name) return role.name;
            return role;
          }) : [];
          
          setCurrentUserRoles(roleNames);
        }
      } catch (error) {
        console.error('Errore nel fetching utente:', error);
      }
    };
    
    if (localStorage.getItem('token')) {
      fetchCurrentUser();
    }
  }, []);

  const inputRef = useRef(null);

  const updateUserRoles = (newRoles) => {
    setUserData(prev => ({
      ...prev,
      roles: newRoles.map(role => ({ ...role }))
    }));
    
    // Aggiorna anche nello storage per sincronizzazione
    const updatedUser = { 
      ...userData, 
      roles: newRoles,
      // Mantieni altri dati importanti
      username: userData.username,
      pfp: userData.pfp
    };
    
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    
    // Invia evento per notificare altri componenti
    window.dispatchEvent(new Event('userRolesUpdated'));
  };

  const updateUserBadges = (newBadges) => {
    setUserData(prev => ({
      ...prev,
      badges: newBadges.map(badge => ({ ...badge }))
    }));
  };

  // Funzione per recuperare i post recenti dell'utente
  const fetchRecentPosts = async (userId) => {
    setLoadingPosts(true);
    try {
      const res = await fetch(`http://localhost:3000/posts/user/${userId}?limit=3`);
      if (res.ok) {
        const data = await res.json();
        setRecentPosts(data.posts || []);
      } else {
        console.error('Errore nel caricamento dei post');
      }
    } catch (err) {
      console.error('Errore di connessione:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

useEffect(() => {
  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/users/info/${username}`);
      if (!res.ok) throw new Error('Utente non disponibile');
      const data = await res.json();

      setUserData({
        ...data,
        roles: data.roles ? data.roles.map(role => ({ _id: role._id, name: role.name })) : [],
        badges: data.badges ? data.badges.map(badge => ({ _id: badge._id, name: badge.name })) : [],
        postsCount: 0 
      });

  if (data._id) {
    fetchRecentPosts(data._id);

    const countPostsRes = await fetch(`http://localhost:3000/posts/count/${data._id}`);
    if (countPostsRes.ok) {
      const { count } = await countPostsRes.json();
      setUserData(prev => ({ ...prev, postsCount: count }));
    }

    const countRepliesRes = await fetch(`http://localhost:3000/replies/count/${data._id}`);
    if (countRepliesRes.ok) {
      const { count } = await countRepliesRes.json();
      setUserData(prev => ({ ...prev, threadsCount: count }));
    }
  }
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
              <h1 className='title'>Profilo Utente</h1>
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
                  <ProfileRoles 
                    userData={userData} 
                    updateUserRoles={updateUserRoles}
                    currentUserRoles={currentUserRoles} 
                  />
                  </div>
                  
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
                      <span className="stat-label">Prossimamente</span>
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
                {loadingPosts ? (
                  <p>Caricamento attività...</p>
                ) : recentPosts.length > 0 ? (
                  <ul className="recent-posts-list">
                    {recentPosts.slice(0, 3).map(post => (   
                      <li key={post._id} className="recent-post-item">
                        <div className="post-content-preview">
                          {post.content.length > 100 
                            ? `${post.title.substring(0, 100)}...` 
                            : post.title
                          }
                        </div>
                        <div className="post-meta">
                          <span className="post-date">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                ) : (
                  <p>Nessuna attività recente</p>
                )}
              </div>
            </div>
            
            <div className="sidebar-section">
              <h3>Badge</h3>
              <ProfileBadges 
                userData={userData} 
                updateUserBadges={updateUserBadges}
                currentUserRoles={currentUserRoles} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}