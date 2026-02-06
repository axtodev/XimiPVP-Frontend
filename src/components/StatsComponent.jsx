import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
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
                    Back to Leaderboards
                </button>

                <div className="profile-hero">
                    <div className="hero-body-render">
                        <img
                            src={`https://mc-heads.net/body/${selectedPlayer.name || 'steve'}`}
                            alt={selectedPlayer.name}
                        />
                    </div>
                    <div className="hero-info">
                        <h2>{selectedPlayer.name || 'Unknown'}</h2>
                        <div className="player-rank-tag">Default</div>
                    </div>
                </div>

                <div className="stats-section">
                    <div className="section-label">General Info</div>
                    <div className="info-grid">
                        <div className="info-row">
                            <span className="info-label">Current Level</span>
                            <span className="info-value text-primary">{selectedPlayer.level || 0}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Global Rank</span>
                            <span className="info-value">#{stats.findIndex(p => p.uuid === selectedPlayer.uuid) + 1}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Total Coins</span>
                            <span className="info-value">{selectedPlayer.coins || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                    <div className="section-label">Practice Statistics</div>
                    <div className="gamemodes-grid">
                        <div className="gamemode-card">
                            <div className="card-title-bar">Overall</div>
                            <div className="card-body">
                                <div className="card-stat-row">
                                    <span className="row-label">Global Elo</span>
                                    <span className="row-value">{selectedPlayer.globalElo}</span>
                                </div>
                                <div className="card-stat-row">
                                    <span className="row-label">Wins</span>
                                    <span className="row-value">{selectedPlayer.wins || 0}</span>
                                </div>
                                <div className="card-stat-row">
                                    <span className="row-label">Losses</span>
                                    <span className="row-value">{selectedPlayer.losses || 0}</span>
                                </div>
                                <div className="card-stat-row">
                                    <span className="row-label">Current Streak</span>
                                    <span className="row-value">{selectedPlayer.currentWinStreak}</span>
                                </div>
                            </div>
                            <div className="card-footer-rate">
                                {winRate.toFixed(2)}% WIN RATE
                            </div>
                        </div>

                        <div className="gamemode-card">
                            <div className="card-title-bar">Matches</div>
                            <div className="card-body">
                                <div className="card-stat-row">
                                    <span className="row-label">Total Played</span>
                                    <span className="row-value">{selectedPlayer.matchesPlayed}</span>
                                </div>
                                <div className="card-stat-row">
                                    <span className="row-label">W/L Ratio</span>
                                    <span className="row-value">{((selectedPlayer.wins || 0) / Math.max(selectedPlayer.losses || 0, 1)).toFixed(2)}</span>
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
                <h1>Leaderboards</h1>
                <div className="search-bar">
                    <Search size={20} color="#777" />
                    <input
                        type="text"
                        placeholder="Search for a player..."
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
                                <th className="rank-cell">#</th>
                                <th>Player</th>
                                <th>Elo</th>
                                <th>Streak</th>
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
                                <tr key={player.uuid} onClick={() => setSelectedPlayer(player)}>
                                    <td className="rank-cell">#{index + 1}</td>
                                    <td className="player-cell">
                                        <img
                                            src={`https://mc-heads.net/avatar/${player.name || 'steve'}/32`}
                                            alt={player.name}
                                            className="player-head"
                                        />
                                        {player.name || 'Unknown'}
                                    </td>
                                    <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{player.globalElo}</td>
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
