import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, ArrowLeft, Share2, Calendar, Trophy, Skull, Crosshair, Crown, MousePointer2, Sword, Shield, Target, Flame } from 'lucide-react';
import '../style/stats.css';

const StatsComponent = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [view, setView] = useState('leaderboard');
    const [mode, setMode] = useState('practice');

    useEffect(() => {
        if (view === 'leaderboard') {
            fetchStats();
        }
    }, [mode, view]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.ximi.lol/stats?mode=${mode}`);
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

    const filteredStats = (stats || []).filter(player =>
        (player.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRankDisplay = (rank = 'Default') => {
        const r = rank.toLowerCase();
        if (r === 'owner') return 'OWNER';
        if (r === 'manager') return 'MANAGER';
        if (r === 'sradmin') return 'SR-ADMIN';
        if (r === 'admin') return 'ADMIN';
        if (r === 'srmod') return 'SR-MOD';
        if (r === 'mod') return 'MOD';
        if (r === 'trialmod' || r === 't-mod') return 'TRIAL-MOD';
        return r.toUpperCase();
    };

    const getRankBadgeClass = (rank = 'default') => {
        const r = rank.toLowerCase();
        if (r === 't-mod') return 'rank-trialmod';
        return `rank-${r}`;
    };

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

    const PracticeStatsGrid = ({ player }) => {
        if (!player) return <div className="no-data-msg">Nessun dato Practice trovato</div>;
        return (
            <div className="stats-grid-coral">
                <div className="stat-card-clean">
                    <div className="stat-card-header"><Crosshair size={14} /> Global Elo</div>
                    <div className="stat-card-value">{formatNumber(player.globalElo)}</div>
                </div>
                <div className="stat-card-clean">
                    <div className="stat-card-header"><Trophy size={14} /> Vittorie</div>
                    <div className="stat-card-value">{formatNumber(player.wins)}</div>
                </div>
                <div className="stat-card-clean">
                    <div className="stat-card-header"><Skull size={14} /> Sconfitte</div>
                    <div className="stat-card-value">{formatNumber(player.losses)}</div>
                </div>
                <div className="stat-card-clean">
                    <div className="stat-card-header"><Crown size={14} /> Winstreak</div>
                    <div className="stat-card-value">{formatNumber(player.currentWinStreak)}</div>
                </div>
            </div>
        );
    };

    const KitPvPStatsGrid = ({ player }) => {
        if (!player) return <div className="no-data-msg">Nessun dato KitPvP trovato</div>;
        const kd = player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : (player.kills || 0).toFixed(2);
        return (
            <div className="stats-grid-coral">
                <div className="stat-card-clean">
                    <div className="stat-card-header"><Sword size={14} /> Uccisioni</div>
                    <div className="stat-card-value">{formatNumber(player.kills)}</div>
                </div>
                <div className="stat-card-clean">
                    <div className="stat-card-header"><Skull size={14} /> Morti</div>
                    <div className="stat-card-value">{formatNumber(player.deaths)}</div>
                </div>
                <div className="stat-card-clean">
                    <div className="stat-card-header"><Target size={14} /> Rapporto K/D</div>
                    <div className="stat-card-value">{kd}</div>
                </div>
                <div className="stat-card-clean">
                    <div className="stat-card-header"><Flame size={14} /> Killstreak</div>
                    <div className="stat-card-value">{formatNumber(player.killstreak)}</div>
                </div>
                <div className="stat-card-clean">
                    <div className="stat-card-header"><Crown size={14} /> Killstreak Massima</div>
                    <div className="stat-card-value">{formatNumber(player.maxKillstreak)}</div>
                </div>
                <div className="stat-card-clean">
                    <div className="stat-card-header"><Trophy size={14} /> Taglia Attuale</div>
                    <div className="stat-card-value">{formatNumber(player.bounty)}</div>
                </div>
                <div className="stat-card-clean">
                    <div className="stat-card-header"><Target size={14} /> Taglia Massima</div>
                    <div className="stat-card-value">{formatNumber(player.maxBounty)}</div>
                </div>
            </div>
        );
    };

    if (view === 'detail' && selectedPlayer) {
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
                            <div className={`rank-badge ${getRankBadgeClass(selectedPlayer.rank)}`}>
                                {selectedPlayer.isStaff && <MousePointer2 size={12} style={{ marginRight: '4px' }} />}
                                {getRankDisplay(selectedPlayer.rank)}
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                            <Calendar size={14} style={{ marginRight: '5px' }} /> Entrato il: <b>{joinedDate}</b>
                        </div>
                    </div>

                    <div className="stats-section-container">
                        <div className="section-divider">
                            <div className="section-icon"><Shield size={20} /></div>
                            <h2>Statistiche Practice</h2>
                        </div>
                        <PracticeStatsGrid player={selectedPlayer.practice} />

                        <div className="section-divider">
                            <div className="section-icon"><Sword size={20} /></div>
                            <h2>Statistiche KitPvP</h2>
                        </div>
                        <KitPvPStatsGrid player={selectedPlayer.kitpvp} />
                    </div>

                    <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
                        <button className="guarda-partite-btn-coral" onClick={() => setView('leaderboard')}>
                            CHIUDI SCHEDA PLAYER
                        </button>
                    </div>
                </div>
            </div >
        );
    }

    return (
        <div className="stats-page-wrapper">
            <div className="stats-container">
                <div className="mode-selection-grid">
                    <div className={`mode-card ${mode === 'practice' ? 'active' : ''}`} onClick={() => setMode('practice')}>
                        <div className="mode-card-header">
                            <div className="mode-icon-box" style={{ background: mode === 'practice' ? 'var(--primary)' : '#cbd5e1' }}><Shield size={24} /></div>
                            <h3>Practice</h3>
                        </div>
                        <p className="mode-card-description">
                            Affronta duelli in diverse modalità, migliora le tue abilità e scala le classifiche globali Elo.
                        </p>
                    </div>
                    <div className={`mode-card ${mode === 'kitpvp' ? 'active' : ''}`} onClick={() => setMode('kitpvp')}>
                        <div className="mode-card-header">
                            <div className="mode-icon-box" style={{ background: mode === 'kitpvp' ? 'var(--primary)' : '#cbd5e1' }}><Sword size={24} /></div>
                            <h3>KitPvP</h3>
                        </div>
                        <p className="mode-card-description">
                            Scegli il tuo kit, combatti nel tutti contro tutti e accumula uccisioni e taglie spettacolari.
                        </p>
                    </div>
                </div>

                <div className="stats-header-top">
                    <span className="update-status">Ultimo aggiornamento automatico: ora</span>
                    <div className="pagination-mini">
                        <button className="page-btn active">1</button>
                    </div>
                </div>

                <div className="search-container" style={{ marginBottom: '2rem' }}>
                    <div className="search-box-coral">
                        <Search size={18} color="var(--primary)" />
                        <input
                            placeholder="Cerca il nick di un giocatore..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="leaderboard-card">
                    <table className="stats-table">
                        <thead>
                            {mode === 'practice' ? (
                                <tr>
                                    <th style={{ width: '80px' }}>RANK</th>
                                    <th>USERNAME</th>
                                    <th style={{ width: '120px' }}>GLOBAL ELO</th>
                                    <th style={{ width: '100px' }}>VITTORIE</th>
                                    <th style={{ width: '100px' }}>SCONFITTE</th>
                                    <th style={{ width: '180px' }}>W/L RATIO</th>
                                    <th style={{ width: '100px' }}>LIVELLO</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th style={{ width: '80px' }}>RANK</th>
                                    <th>USERNAME</th>
                                    <th style={{ width: '100px' }}>UCCISIONI</th>
                                    <th style={{ width: '100px' }}>MORTI</th>
                                    <th style={{ width: '80px' }}>K/D</th>
                                    <th style={{ width: '80px' }}>STREAK</th>
                                    <th style={{ width: '120px' }}>MAX STREAK</th>
                                    <th style={{ width: '100px' }}>TAGLIA</th>
                                    <th style={{ width: '120px' }}>MAX TAGLIA</th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="9" className="loading-state">CARICAMENTO DATI IN CORSO...</td></tr>
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
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span className={`rank-badge ${getRankBadgeClass(player.rank)}`}>
                                                        {getRankDisplay(player.rank)}
                                                    </span>
                                                    <span className="player-name-text">{player.name}</span>
                                                    {mode === 'practice' && <span className="player-level-badge">{player.level || 0}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    {mode === 'practice' ? (
                                        <>
                                            <td style={{ color: 'var(--primary)', fontWeight: '800' }}>{formatNumber(player.globalElo)}</td>
                                            <td>{formatNumber(player.wins)}</td>
                                            <td>{formatNumber(player.losses)}</td>
                                            <td>
                                                <ProgressBar wins={player.wins} losses={player.losses} />
                                            </td>
                                            <td style={{ fontWeight: '800' }}>{player.level || 0}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td style={{ color: 'var(--primary)', fontWeight: '800' }}>{formatNumber(player.kills)}</td>
                                            <td>{formatNumber(player.deaths)}</td>
                                            <td>{player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : (player.kills || 0).toFixed(2)}</td>
                                            <td style={{ fontWeight: '700' }}>{formatNumber(player.killstreak)}</td>
                                            <td>{formatNumber(player.maxKillstreak)}</td>
                                            <td style={{ color: 'var(--primary)', fontWeight: '800' }}>{formatNumber(player.bounty)}</td>
                                            <td>{formatNumber(player.maxBounty)}</td>
                                        </>
                                    )}
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
