import React, { useEffect, useState } from 'react';
import { User, Copy } from 'lucide-react';

function OnlinePlayer({ address }) {
  const [online, setOnline] = useState(null);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchPlayerData = async () => {
      setError('');
      try {
        const res = await fetch(`https://api.mcsrvstat.us/2/${address}`);
        if (!res.ok) throw new Error("Errore nella chiamata all'API");
        const data = await res.json();
        setOnline(data.players ? data.players.online : 0);
      } catch (e) {
        setError("Errore nel recuperare i dati");
        setOnline(null);
      }
    };

    fetchPlayerData();
    const interval = setInterval(fetchPlayerData, 60 * 1000);
    return () => clearInterval(interval);
  }, [address]);

  const copyIP = () => {
    navigator.clipboard.writeText(address)
      .then(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2500);
      })
      .catch(err => {
        console.error("Errore durante la copia:", err);
        setError("Errore durante la copia dell'IP");
      });
  };

  if (error) return (
    <div className="error-message">
      <p>{error}</p>
    </div>
  );

  if (online === null) return (
    <div className="loading-message">
      <p>Caricamento...</p>
    </div>
  );

  return (
    <div className="online-player-container">
      <div 
        className="online-player"
        onClick={copyIP}
      >
        <User />
        <p>Online: {online}</p>
        <div className="ip-address">
        </div>
        <div className="copy-tooltip">Clicca per copiare</div>
      </div>

      {showNotification && (
        <div className="copy-notification">
          IP {address} copiato!
        </div>
      )}
    </div>
  );
}

export default OnlinePlayer;