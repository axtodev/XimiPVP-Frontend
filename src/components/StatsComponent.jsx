import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Trophy, Skull, Crosshair, Crown } from 'lucide-react';
import '../style/stats.css';

const StatsComponent = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('https://api.ximi.lol/stats');
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    const filteredStats = stats.filter(player =>
        (player.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedPlayer) {
        const winRate = ((selectedPlayer.wins || 0) / Math.max(selectedPlayer.losses || 0, 1) * 100);

        return (
            <div className="stats-container detail-view">
                <button className="back-button" onClick={() => setSelectedPlayer(null)}>
                    ← Torna alle classifiche
                </button>

                <div className="profile-hero">
                    <div className="hero-avatar">
                        <img
                            src={`https://mc-heads.net/avatar/${selectedPlayer.uuid}/100`}
                            alt={selectedPlayer.name}
                        />
                    </div>
                    <div className="hero-info">
                        <h2>{selectedPlayer.name || 'Unknown'}</h2>
                        <div className="badges">
                            <span className="badge staff">Staff</span>
                        </div>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon"><Crosshair size={20} /></div>
                        <div className="stat-label">Global Elo</div>
                        <div className="stat-value">{selectedPlayer.globalElo}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><Trophy size={20} /></div>
                        <div className="stat-label">WinStreak</div>
                        <div className="stat-value">{selectedPlayer.currentWinStreak}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><Crown size={20} /></div>
                        <div className="stat-label">Matches</div>
                        <div className="stat-value">{selectedPlayer.matchesPlayed}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><Skull size={20} /></div>
                        <div className="stat-label">Coins</div>
                        <div className="stat-value">{selectedPlayer.coins || 0}</div>
                    </div>
                </div>

                <div className="bottom-row">
                    <div className="level-card">
                        <div className="level-header">
                            <Crown size={20} /> Livello {selectedPlayer.level || 0}
                        </div>
                        <div className="level-info">
                            <div className="global-rank">#{stats.findIndex(p => p.uuid === selectedPlayer.uuid) + 1}</div>
                            <div className="rank-label">Classifica globale</div>
                        </div>
                    </div>

                    <div className="win-rate-card">
                        <div className="card-header">Win rate</div>
                        <div className="win-rate-content">
                            <div className="rate-circle">
                                <svg viewBox="0 0 36 36" className="circular-chart">
                                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="circle" strokeDasharray={`${Math.min(winRate, 100)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <text x="18" y="20.35" className="percentage">{winRate.toFixed(1)}%</text>
                                </svg>
                            </div>
                            <div className="rate-details">
                                <div className="rate-item">
                                    <span className="dot win"></span> Wins: {selectedPlayer.wins || 0}
                                </div>
                                <div className="rate-item">
                                    <span className="dot loss"></span> Losses: {selectedPlayer.losses || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="stats-container">
            <div className="stats-header">
                <h1>Server Statistics</h1>
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search player..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading stats...</div>
            ) : (
                <div className="table-responsive">
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Player</th>
                                <th><div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}><Crown size={16} /> Global Elo</div></th>
                                <th><div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}><Trophy size={16} /> Streak</div></th>
                                <th>Wins</th>
                                <th>Losses</th>
                                <th>W/L</th>
                                <th>Matches</th>
                                <th>Coins</th>
                                <th>Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStats.map((player, index) => (
                                <tr key={player.uuid} onClick={() => setSelectedPlayer(player)} style={{ cursor: 'pointer' }}>
                                    <td className={`rank-cell rank-${index + 1}`}>#{index + 1}</td>
                                    <td className="player-cell">
                                        <img
                                            src={`https://mc-heads.net/avatar/${player.uuid}/32`}
                                            alt={player.name}
                                            className="player-head"
                                        />
                                        {player.name || 'Unknown'}
                                    </td>
                                    <td>{player.globalElo}</td>
                                    <td>{player.currentWinStreak}</td>
                                    <td>{player.wins || 0}</td>
                                    <td>{player.losses || 0}</td>
                                    <td>{((player.wins || 0) / Math.max(player.losses || 0, 1)).toFixed(2)}</td>
                                    <td>{player.matchesPlayed}</td>
                                    <td>{player.coins || 0}</td>
                                    <td>{player.level || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StatsComponent;
