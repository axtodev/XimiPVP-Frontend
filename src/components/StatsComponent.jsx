import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, ArrowLeft, Share2, Calendar, Trophy, Skull, Crosshair, Crown, MousePointer2, Sword, Shield, Clock } from 'lucide-react';
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

    const topPlayer = filteredStats.length > 0 ? filteredStats[0] : null;

    const parseInventory = (invString) => {
        if (!invString || typeof invString !== 'string') return [];
        const items = invString.split(';');
        return items.map(itemStr => {
            if (itemStr === 'null' || !itemStr) return null;
            const parts = itemStr.split(':');
            const data = {};
            parts.forEach(p => {
                if (!p.includes('@')) return;
                const [key, val] = p.split('@');
                if (key === 't') data.id = parseInt(val);
                if (key === 'd') data.durability = parseInt(val);
                if (key === 'a') data.amount = parseInt(val);
            });
            return data;
        });
    };

    const InventorySlot = ({ item }) => (
        <div className="mc-slot">
            {item && item.id !== 0 && (
                <div className="mc-item-wrapper" title={`ID: ${item.id}`}>
                    <img
                        src={`https://minecraft-api.com/api/items/${item.id}/${item.durability || 0}`}
                        alt={`Item ${item.id}`}
                        onError={(e) => { e.target.src = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/1.8.8/items/apple.png'; }}
                    />
                    {item.amount > 1 && <span className="mc-amount">{item.amount}</span>}
                </div>
            )}
        </div>
    );

    const InventoryGrid = ({ items, armor }) => {
        // Standard Minecraft Inventory: 36 slots
        const mainInv = items.slice(9, 36);
        const hotbar = items.slice(0, 9);
        // Correcting order to be standard MC layout visually
        // Hotbar is usually bottom, but let's follow the Java order if it was fixed
        // Actually standard MC: Armor (Top), Main Inv (Middle), Hotbar (Bottom)

        return (
            <div className="mc-inventory">
                <div className="mc-armor-section">
                    <div className="mc-stats-overlay">
                        <span style={{ fontSize: '0.6rem', color: '#fff', fontWeight: '900', marginLeft: '5px' }}>EQUIPMENT</span>
                    </div>
                    {armor.filter(a => a !== null).map((item, i) => <InventorySlot key={i} item={item} />)}
                </div>
                <div className="mc-main-inv">
                    {mainInv.map((item, i) => <InventorySlot key={i} item={item} />)}
                </div>
                <div className="mc-hotbar">
                    {hotbar.map((item, i) => <InventorySlot key={i} item={item} />)}
                </div>
            </div>
        );
    };

    if (view === 'inventory' && selectedMatch) {
        const fighter = selectedMatch.fighter;
        const opponent = selectedMatch.opponent;

        return (
            <div className="stats-page-wrapper">
                <div className="stats-container">
                    <div className="stats-header-top">
                        <button className="back-button" onClick={() => setView('history')}>
                            <ArrowLeft size={16} /> Torna ai Match
                        </button>
                    </div>

                    <div className="inventory-viewer-title">
                        <h2>Inventari Fine Match</h2>
                        <span className="match-kit-badge">{selectedMatch.kit || 'Solo'}</span>
                    </div>

                    <div className="inventory-split">
                        <div className="player-inv-card">
                            <div className="player-inv-header">
                                <img src={`https://mc-heads.net/avatar/${fighter.teamPlayer?.username || 'steve'}/40`} alt="f" />
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{fighter.teamPlayer?.username}</h3>
                                    <div className="inv-stats">
                                        <span style={{ color: '#ff4757', display: 'flex', alignItems: 'center', gap: '4px' }}><Skull size={14} /> {fighter.health ? (fighter.health / 2).toFixed(1) : 0} HP</span>
                                    </div>
                                </div>
                            </div>
                            <InventoryGrid
                                items={parseInventory(fighter.contents)}
                                armor={parseInventory(fighter.armor)}
                            />
                        </div>

                        <div className="player-inv-card">
                            <div className="player-inv-header">
                                <img src={`https://mc-heads.net/avatar/${opponent.teamPlayer?.username || 'steve'}/40`} alt="o" />
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{opponent.teamPlayer?.username}</h3>
                                    <div className="inv-stats">
                                        <span style={{ color: '#ff4757', display: 'flex', alignItems: 'center', gap: '4px' }}><Skull size={14} /> {opponent.health ? (opponent.health / 2).toFixed(1) : 0} HP</span>
                                    </div>
                                </div>
                            </div>
                            <InventoryGrid
                                items={parseInventory(opponent.contents)}
                                armor={parseInventory(opponent.armor)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'history' && selectedPlayer) {
        const history = selectedPlayer.matchHistory || [];

        return (
            <div className="stats-page-wrapper">
                <div className="stats-container">
                    <div className="stats-header-top">
                        <button className="back-button" onClick={() => setView('detail')}>
                            <ArrowLeft size={16} /> Torna al Profilo
                        </button>
                    </div>

                    <h1 className="leaderboard-title">Match di {selectedPlayer.name}</h1>

                    <div className="match-list">
                        {history.length === 0 ? (
                            <div className="loading">Nessun match trovato.</div>
                        ) : (
                            history.map((match, i) => {
                                const isWinner = match.won;
                                const date = match.createdAt ? new Date(match.createdAt).toLocaleDateString() : 'Oggi';
                                const oppName = match.opponent?.teamPlayer?.username || 'Player';
                                return (
                                    <div key={i} className={`match-card ${isWinner ? 'win' : 'loss'}`} onClick={() => {
                                        setSelectedMatch(match);
                                        setView('inventory');
                                    }}>
                                        <div className="match-status-side"></div>
                                        <div className="match-info-main">
                                            <div className="match-kit">{match.kit || 'Solo'}</div>
                                            <div className="match-opponent">vs <b>{oppName}</b></div>
                                        </div>
                                        <div className="match-elo-change">
                                            {isWinner ? (
                                                <span className="elo-win">+{match.eloChangeWinner || 0} Elo</span>
                                            ) : (
                                                <span className="elo-loss">-{match.eloChangeLoser || 0} Elo</span>
                                            )}
                                        </div>
                                        <div className="match-date">{date}</div>
                                        <button className="view-inv-btn">Inventari</button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'detail' && selectedPlayer) {
        const total = (selectedPlayer.wins || 0) + (selectedPlayer.losses || 0);
        const winRate = total > 0 ? ((selectedPlayer.wins || 0) / total * 100) : 0;
        const joinedDate = selectedPlayer.firstLogin ? new Date(selectedPlayer.firstLogin).toLocaleDateString('it-IT') : 'Sconosciuto';

        return (
            <div className="stats-page-wrapper">
                <div className="stats-container detail-view">
                    <div className="stats-header-top">
                        <button className="back-button" onClick={() => setView('leaderboard')}>
                            <ArrowLeft size={16} /> Leaderboard
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
                                <div className="online-dot"></div>
                                <h2>{selectedPlayer.name}</h2>
                            </div>
                            <div className="player-rank-label">
                                {selectedPlayer.rank || 'default'}
                            </div>
                            {selectedPlayer.isStaff && (
                                <div className="badge-staff">
                                    <MousePointer2 size={12} /> STAFF
                                </div>
                            )}
                        </div>
                        <div className="profile-joined-date">
                            <Calendar size={14} /> Join: {joinedDate}
                        </div>
                    </div>

                    <div className="section-header-row">
                        <div className="section-title-box">
                            <div className="section-icon"><Trophy size={18} /></div>
                            Statistiche Globali
                        </div>
                        <button className="guarda-partite-btn" onClick={() => setView('history')}>MATCH HISTORY</button>
                    </div>

                    <div className="detailed-stats-grid">
                        <div className="stat-square-card">
                            <div className="square-label"><Crosshair size={14} /> ELO</div>
                            <div className="square-value">{formatNumber(selectedPlayer.globalElo)}</div>
                        </div>
                        <div className="stat-square-card">
                            <div className="square-label"><Trophy size={14} /> WINS</div>
                            <div className="square-value">{formatNumber(selectedPlayer.wins)}</div>
                        </div>
                        <div className="stat-square-card">
                            <div className="square-label"><Skull size={14} /> LOSSES</div>
                            <div className="square-value">{formatNumber(selectedPlayer.losses)}</div>
                        </div>
                        <div className="stat-square-card">
                            <div className="square-label"><Crown size={14} /> STREAK</div>
                            <div className="square-value">{formatNumber(selectedPlayer.currentWinStreak)}</div>
                        </div>
                    </div>

                    <div className="profile-bottom-grid">
                        <div className="level-card-custom">
                            <div className="card-title-custom">
                                <Crown size={20} color="var(--primary)" /> Livello {selectedPlayer.level || 0}
                            </div>
                            <div className="level-number">
                                #{stats.findIndex(p => p.uuid === selectedPlayer.uuid) + 1}
                            </div>
                            <div className="rank-global-label">POSIZIONE GLOBALE</div>
                        </div>

                        <div className="winrate-card-custom">
                            <div className="card-title-custom">PERCENTUALE WIN</div>
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
                                        <div className="bar-label-row"><span>WINS</span><span>{formatNumber(selectedPlayer.wins)}</span></div>
                                        <div className="bar-outer"><div className="bar-inner wins" style={{ width: `${winRate}%` }}></div></div>
                                    </div>
                                    <div className="bar-item">
                                        <div className="bar-label-row"><span>LOSSES</span><span>{formatNumber(selectedPlayer.losses)}</span></div>
                                        <div className="bar-outer"><div className="bar-inner losses" style={{ width: `${100 - winRate}%` }}></div></div>
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
        <div className="stats-page-wrapper">
            <div className="stats-container">
                <h1 className="leaderboard-title">CLASSIFICA XIMIPVP</h1>

                <div className="search-container">
                    <div className="search-bar">
                        <Search size={20} color="var(--primary)" />
                        <input
                            type="text"
                            placeholder="Cerca un guerriero..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="loading">RECLUTANDO GIOCATORI...</div>
                ) : (
                    <>
                        {topPlayer && !searchTerm && (
                            <div className="top-player-featured" onClick={() => fetchPlayerDetail(topPlayer.uuid)}>
                                <div className="crown-badge"><Crown size={28} /></div>
                                <img src={`https://mc-heads.net/avatar/${topPlayer.name}/128`} className="top-player-skin" alt="top" />
                                <div className="top-player-info">
                                    <span className="top-label">IL RE DELLA CLASSIFICA</span>
                                    <h3>{topPlayer.name}</h3>
                                    <div className="top-stats-row">
                                        <span>ELO: <span className="stat-val">{formatNumber(topPlayer.globalElo)}</span></span>
                                        <span>WINS: <span className="stat-val">{formatNumber(topPlayer.wins)}</span></span>
                                    </div>
                                </div>
                                <div className="view-profile-cta">VEDI PROFILO</div>
                            </div>
                        )}

                        <div className="table-responsive">
                            <table className="stats-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Player</th>
                                        <th>Elo</th>
                                        <th>Wins</th>
                                        <th>Losses</th>
                                        <th>W/L</th>
                                        <th>Matches</th>
                                        <th>Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStats.map((player, index) => (
                                        <tr key={player.uuid} onClick={() => fetchPlayerDetail(player.uuid)}>
                                            <td style={{ fontWeight: '900', color: 'var(--secondary)' }}>#{index + 1}</td>
                                            <td className="player-cell">
                                                <div style={{ position: 'relative' }}>
                                                    <img
                                                        src={`https://mc-heads.net/avatar/${player.name || 'steve'}/32`}
                                                        alt={player.name}
                                                        className="player-head"
                                                    />
                                                    {player.isStaff && <div className="staff-indicator-dot"></div>}
                                                </div>
                                                <div className="player-name-col">
                                                    <span style={{ fontWeight: '700' }}>{player.name}</span>
                                                    {player.rank && player.rank !== 'default' && <span className="rank-sub-label">{player.rank}</span>}
                                                </div>
                                            </td>
                                            <td style={{ color: 'var(--primary)', fontWeight: '900' }}>{formatNumber(player.globalElo)}</td>
                                            <td>{formatNumber(player.wins)}</td>
                                            <td>{formatNumber(player.losses)}</td>
                                            <td>{((player.wins || 0) / Math.max(player.losses || 0, 1)).toFixed(2)}</td>
                                            <td>{formatNumber(player.matchesPlayed)}</td>
                                            <td style={{ fontWeight: '800' }}>{player.level || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StatsComponent;
