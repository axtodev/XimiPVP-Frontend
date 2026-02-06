import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, ArrowLeft, Share2, Calendar, Trophy, Skull, Crosshair, Crown, MousePointer2 } from 'lucide-react';
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
            setStats(response.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    const filteredStats = stats.filter(player =>
        (player.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatNumber = (num) => {
        return (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    if (selectedPlayer) {
        const total = (selectedPlayer.wins || 0) + (selectedPlayer.losses || 0);
        const winRate = total > 0 ? ((selectedPlayer.wins || 0) / total * 100) : 0;
        const joinedDate = selectedPlayer.firstLogin ? new Date(selectedPlayer.firstLogin).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Sconosciuto';

        return (
            <div className="stats-container detail-view">
                <div className="stats-header-top">
                    <button className="back-button" onClick={() => setSelectedPlayer(null)}>
                        <ArrowLeft size={16} /> Torna alle classifiche
                    </button>
                    <button className="share-button">
                        <Share2 size={18} />
                    </button>
                </div>

                <div className="profile-main-card">
                    <div className="profile-avatar-large">
                        <img
                            src={`https://mc-heads.net/avatar/${selectedPlayer.name || 'steve'}/100`}
                            alt={selectedPlayer.name}
                        />
                    </div>
                    <div className="profile-name-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00ff00' }}></div>
                            <h2>{selectedPlayer.name || 'Unknown'}</h2>
                        </div>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '4px', textTransform: 'uppercase' }}>
                            {selectedPlayer.rank || 'default'}
                        </div>
                        {selectedPlayer.isStaff && (
                            <div className="badge-staff">
                                <MousePointer2 size={12} /> Staff
                            </div>
                        )}
                    </div>
                    <div className="profile-joined-date">
                        <Calendar size={14} /> Entrato il: {joinedDate}
                    </div>
                </div>

                <div className="section-header-row">
                    <div className="section-title-box">
                        <div className="section-icon">
                            <Trophy size={18} />
                        </div>
                        Statistiche Practice
                    </div>
                    <button className="guarda-partite-btn">Guarda le partite</button>
                </div>

                <div className="detailed-stats-grid">
                    <div className="stat-square-card">
                        <div className="square-label"><Crosshair size={14} /> Global Elo</div>
                        <div className="square-value">{formatNumber(selectedPlayer.globalElo)}</div>
                    </div>
                    <div className="stat-square-card">
                        <div className="square-label"><Skull size={14} /> Perdite</div>
                        <div className="square-value">{formatNumber(selectedPlayer.losses)}</div>
                    </div>
                    <div className="stat-square-card">
                        <div className="square-label"><Trophy size={14} /> Vittorie</div>
                        <div className="square-value">{formatNumber(selectedPlayer.wins)}</div>
                    </div>
                    <div className="stat-square-card">
                        <div className="square-label"><Crown size={14} /> Winstreak</div>
                        <div className="square-value">{formatNumber(selectedPlayer.currentWinStreak)}</div>
                    </div>
                </div>

                <div className="profile-bottom-grid">
                    <div className="level-card-custom">
                        <div className="card-title-custom">
                            <Crown size={20} color="#00a8ff" /> Livello Player {selectedPlayer.level || 0}
                        </div>
                        <div className="level-number">
                            #{stats.findIndex(p => p.uuid === selectedPlayer.uuid) + 1}
                        </div>
                        <div className="rank-global-label">Classifica globale</div>
                    </div>

                    <div className="winrate-card-custom">
                        <div className="card-title-custom">
                            Win rate
                        </div>
                        <div className="winrate-content-box">
                            <div className="circular-container">
                                <svg viewBox="0 0 36 36" className="circular-chart">
                                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="circle" strokeDasharray={`${winRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <text x="18" y="20.35" className="percentage-text">{winRate.toFixed(1)}%</text>
                                </svg>
                            </div>
                            <div className="winrate-bars">
                                <div className="bar-item">
                                    <div className="bar-label-row">
                                        <span>Wins</span>
                                        <span>{formatNumber(selectedPlayer.wins)}</span>
                                    </div>
                                    <div className="bar-outer">
                                        <div className="bar-inner wins" style={{ width: `${winRate}%` }}></div>
                                    </div>
                                </div>
                                <div className="bar-item">
                                    <div className="bar-label-row">
                                        <span>Losses</span>
                                        <span>{formatNumber(selectedPlayer.losses)}</span>
                                    </div>
                                    <div className="bar-outer">
                                        <div className="bar-inner losses" style={{ width: `${100 - winRate}%` }}></div>
                                    </div>
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
            <h1 className="leaderboard-title">Classifiche Server</h1>

            <div className="search-container">
                <div className="search-bar">
                    <Search size={20} color="#8ba3c7" />
                    <input
                        type="text"
                        placeholder="Cerca un giocatore..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading">Caricamento classifiche...</div>
            ) : (
                <div className="table-responsive">
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Giocatore</th>
                                <th>Elo</th>
                                <th>Streak</th>
                                <th>Wins</th>
                                <th>Losses</th>
                                <th>W/L</th>
                                <th>Matches</th>
                                <th>Livello</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStats.map((player, index) => (
                                <tr key={player.uuid} onClick={() => setSelectedPlayer(player)}>
                                    <td style={{ fontWeight: '800', color: '#8ba3c7' }}>#{index + 1}</td>
                                    <td className="player-cell">
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                src={`https://mc-heads.net/avatar/${player.name || 'steve'}/32`}
                                                alt={player.name}
                                                className="player-head"
                                            />
                                            {player.isStaff && (
                                                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%', border: '2px solid var(--bg-card)' }}></div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{player.name || 'Unknown'}</span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                                {player.rank !== 'default' ? player.rank : ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--primary)', fontWeight: '800' }}>{formatNumber(player.globalElo)}</td>
                                    <td>{formatNumber(player.currentWinStreak)}</td>
                                    <td>{formatNumber(player.wins)}</td>
                                    <td>{formatNumber(player.losses)}</td>
                                    <td>{((player.wins || 0) / Math.max(player.losses || 0, 1)).toFixed(2)}</td>
                                    <td>{formatNumber(player.matchesPlayed)}</td>
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
