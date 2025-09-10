import React, { useEffect, useState } from 'react';
import '../style/ban.css'

function Bans() {
  const [bans, setBans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleBans, setVisibleBans] = useState(50); 
  const loadMoreCount = 50; 

  useEffect(() => {
    const fetchBans = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:3000/litebans');
        
        if (!res.ok) {
          throw new Error(`Errore HTTP: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Aggiungiamo il calcolo dello stato active per ogni ban
        const now = Date.now();
        const bansWithActiveStatus = data.map(ban => {
          // Calcoliamo lo stato active basandoci sulla data di scadenza
          const isActive = ban.until === -1 || ban.until > now;
          return {
            ...ban,
            active: isActive // Sovrascriviamo la proprietà active
          };
        });
        
        setBans(bansWithActiveStatus);
      } catch (err) {
        console.error('Errore fetch:', err);
        setError('Impossibile caricare la lista dei ban');
      } finally {
        setLoading(false);
      }
    };

    fetchBans();
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDuration = (until) => {
    if (until === -1) return 'Permanente';
    const now = Date.now();
    const diff = until - now;
    
    if (diff <= 0) return 'Scaduto';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}g ${hours}h`;
  };

  const loadMoreBans = () => {
    setVisibleBans(prev => prev + loadMoreCount);
  };

  const currentBans = bans.slice(0, visibleBans);
  const hasMoreBans = visibleBans < bans.length;

  // Contatori aggiornati basati sulla proprietà active che abbiamo calcolato
  const activeBansCount = bans.filter(ban => ban.active).length;
  const expiredBansCount = bans.filter(ban => !ban.active).length;

  if (loading) {
    return (
      <div className="bans-container">
        <div className="loading">Caricamento ban...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bans-container">
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => window.location.reload()}>↻</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-full-width">
      <div className="bans-container">
        <div className="bans-content">
          <div className="bans-main">
            <div className="bans-main-header">
              <h2>Lista Ban <span className="bans-count">{bans.length}</span></h2>
            </div>
            
            <div className="bans-stats">
              <div className="stat-item">
                <span className="stat-number">{activeBansCount}</span>
                <span className="stat-label">Attivi</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{expiredBansCount}</span>
                <span className="stat-label">Scaduti</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{bans.length}</span>
                <span className="stat-label">Totali</span>
              </div>
            </div>
            {bans.length === 0 ? (
              <div className="no-bans">
                <h3>Nessun ban trovato</h3>
              </div>
            ) : (
              <>
                <div className="bans-grid">
                  {currentBans.map((ban) => {
                    // Calcoliamo lo stato per questa card specifica
                    const isCurrentlyActive = ban.until === -1 || ban.until > Date.now();
                    
                    return (
                      <div key={`${ban.uuid}-${ban.time}`} className="ban-card">
                        <div className="ban-header">
                          <img 
                            src={ban.skinUrl} 
                            alt={ban.nickname} 
                            className="player-avatar"
                            onError={(e) => {
                              e.target.src = 'https://crafatar.com/avatars/8667ba71b85a4004af54457a9734eed7?size=100&overlay';
                            }}
                          />
                          <div className="player-info">
                            <h3 className="player-name">{ban.nickname}</h3>
                            <span className={`ban-status ${isCurrentlyActive ? 'active' : 'inactive'}`}>
                              {isCurrentlyActive ? 'Attivo' : 'Scaduto'}
                            </span>
                          </div>
                        </div>

                        <div className="ban-details">
                          <p className="ban-reason">
                            <strong>Motivo:</strong> {ban.reason || 'Nessun motivo specificato'}
                          </p>
                          
                          <div className="ban-meta">
                            <div className="meta-item">
                              <strong>Durata:</strong> {getDuration(ban.until)}
                            </div>
                          </div>
                        </div>

                        <div className="staff-info">
                          <div className="staff-header">
                            <img 
                              src={ban.staffSkinUrl} 
                              alt={ban.staffer} 
                              className="staff-avatar"
                              onError={(e) => {
                                e.target.src = 'https://crafatar.com/avatars/4e03150512d84609830c86121e1f86b9?size=100&overlay';
                              }}
                            />
                            <span className="staff-name">
                              Bannato da: {ban.staffer || 'Console'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {hasMoreBans && (
                  <div className="load-more-container">
                    <button className="load-more-btn" onClick={loadMoreBans}>
                      Mostra altri ban
                      <span className="load-more-count">
                        ({visibleBans} di {bans.length})
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bans;