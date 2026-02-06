import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, ArrowLeft, Share2, Calendar, Trophy, Skull, Crosshair, Crown, MousePointer2 } from 'lucide-react';
import '../style/stats.css';

const StatsComponent = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [view, setView] = useState('leaderboard');
    const [selectedMatch, setSelectedMatch] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://api.ximi.lol/stats');
            setStats(response.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    const fetchPlayerDetail = async (uuid) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.ximi.lol/stats/${uuid}`);
            setSelectedPlayer(response.data);
            setView('detail');
            setLoading(false);
        } catch (error) {
            console.error('Error fetching player detail:', error);
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        return (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const filteredStats = stats.filter(player =>
        (player.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Render Helpers
    const getRankClass = (index) => {
        if (index === 0) return 'top-1';
        if (index === 1) return 'top-2';
        if (index === 2) return 'top-3';
        return '';
    };

    const ProgressBar = ({ wins, losses }) => {
        const total = (wins || 0) + (losses || 0);
        const winPercent = total > 0 ? (wins / total) * 100 : 0;
        return (
            <div className="wl-bar-container">
                <span className="wl-percentage">{winPercent.toFixed(1)}%</span>
                <div className="wl-progress-track">
                    <div className="wl-progress-fill" style={{ width: `${winPercent}%` }}></div>
                </div>
            </div>
        );
    };

    if (view === 'detail' && selectedPlayer) {
        const total = (selectedPlayer.wins || 0) + (selectedPlayer.losses || 0);
        const winRate = total > 0 ? ((selectedPlayer.wins || 0) / total * 100) : 0;
        const joinedDate = selectedPlayer.firstLogin ? new Date(selectedPlayer.firstLogin).toLocaleDateString('it-IT') : 'Recente';

        return (
            <div className="stats-page-wrapper">
                <div className="stats-container">
                    <button className="back-btn-top" onClick={() => setView('leaderboard')}>
                        <ArrowLeft size={18} /> Torna alle classifiche
                    </button>

                    <div className="profile-hero">
                        <div className="profile-avatar-box">
                            <img src={`https://mc-heads.net/avatar/${selectedPlayer.name}/128`} alt="p" />
                        </div>
                        <div className="profile-main-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div className="online-dot"></div>
                                <h2>{selectedPlayer.name}</h2>
                            </div>
                            <div className="profile-rank-tag">
                                {selectedPlayer.isStaff && <MousePointer2 size={14} />}
                                {selectedPlayer.rank || 'PLAYER'}
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                            <Calendar size={14} style={{ marginRight: '5px' }} /> Entrato il: <b>{joinedDate}</b>
                        </div>
                    </div>

                    <div className="stats-grid-coral">
                        <div className="stat-card-clean">
                            <div className="stat-card-header"><Crosshair size={14} /> Global Elo</div>
                            <div className="stat-card-value highlight">{formatNumber(selectedPlayer.globalElo)}</div>
                        </div>
                        <div className="stat-card-clean">
                            <div className="stat-card-header"><Trophy size={14} /> Vittorie</div>
                            <div className="stat-card-value">{formatNumber(selectedPlayer.wins)}</div>
                        </div>
                        <div className="stat-card-clean">
                            <div className="stat-card-header"><Skull size={14} /> Sconfitte</div>
                            <div className="stat-card-value">{formatNumber(selectedPlayer.losses)}</div>
                        </div>
                        <div className="stat-card-clean">
                            <div className="stat-card-header"><Crown size={14} /> Winstreak</div>
                            <div className="stat-card-value">{formatNumber(selectedPlayer.currentWinStreak)}</div>
                        </div>
                    </div>

                    <div className="bottom-panels">
                        <div className="panel-card">
                            <div className="panel-title"><Crown size={20} color="var(--primary)" /> Livello Player</div>
                            <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)' }}>
                                #{stats.findIndex(p => p.uuid === selectedPlayer.uuid) + 1}
                            </div>
                            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '5px' }}>Classifica globale</div>
                        </div>

                        <div className="panel-card">
                            <div className="panel-title"><Trophy size={20} color="var(--primary)" /> Win Rate</div>
                            <div className="wr-flex">
                                <div className="wr-chart-mini">
                                    <svg viewBox="0 0 36 36">
                                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="circle-fill" strokeDasharray={`${winRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <text x="18" y="20.35" className="wr-text">{winRate.toFixed(1)}%</text>
                                    </svg>
                                </div>
                                <div className="wr-legend">
                                    <div className="legend-item">
                                        <div className="legend-row"><span>Vittorie</span><span>{formatNumber(selectedPlayer.wins)}</span></div>
                                        <div className="wl-progress-track"><div className="wl-progress-fill" style={{ width: `${winRate}%` }}></div></div>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-row"><span>Sconfitte</span><span>{formatNumber(selectedPlayer.losses)}</span></div>
                                        <div className="wl-progress-track" style={{ background: '#15253a' }}><div className="wl-progress-fill" style={{ width: `${100 - winRate}%`, background: 'var(--loss-color)' }}></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                        <button className="guarda-partite-btn-coral" onClick={() => fetchPlayerDetail(selectedPlayer.uuid)}>
                            VEDI CRONOLOGIA MATCH
                        </button>
                    </div>
                </div>
            </div >
        );
    }

    return (
        <div className="stats-page-wrapper">
            <div className="stats-container">
                <div className="stats-header-top">
                    <span className="update-status">Ultimo aggiornamento: pochi secondi fa</span>
                    <div className="pagination-mini">
                        <button className="page-btn active">1</button>
                        <button className="page-btn">2</button>
                        <button className="page-btn">3</button>
                    </div>
                </div>

                <div className="search-container" style={{ marginBottom: '2rem' }}>
                    <div className="search-box-coral">
                        <Search size={18} color="var(--primary)" />
                        <input
                            placeholder="Cerca un utente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="leaderboard-card">
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>Rank</th>
                                <th>Nome Utente</th>
                                <th style={{ width: '120px' }}>Global Elo</th>
                                <th style={{ width: '100px' }}>Vittorie</th>
                                <th style={{ width: '100px' }}>Sconfitte</th>
                                <th style={{ width: '180px' }}>W/L Ratio</th>
                                <th style={{ width: '100px' }}>Livello</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="loading-state">CARICAMENTO DATI...</td></tr>
                            ) : filteredStats.map((player, index) => (
                                <tr key={player.uuid} onClick={() => fetchPlayerDetail(player.uuid)}>
                                    <td>
                                        <div className={`player-rank-icon ${getRankClass(index)}`}>
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="player-cell">
                                            <div className="player-img-wrapper">
                                                <img src={`https://mc-heads.net/avatar/${player.name}/32`} className="player-head-img" alt="h" />
                                            </div>
                                            <div className="player-name-wrapper">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span className="player-name-text">{player.name}</span>
                                                    <span className="player-level-badge">{player.level || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--primary)', fontWeight: '800' }}>{formatNumber(player.globalElo)}</td>
                                    <td>{formatNumber(player.wins)}</td>
                                    <td>{formatNumber(player.losses)}</td>
                                    <td>
                                        <ProgressBar wins={player.wins} losses={player.losses} />
                                    </td>
                                    <td style={{ fontWeight: '800' }}>{player.level || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StatsComponent;
