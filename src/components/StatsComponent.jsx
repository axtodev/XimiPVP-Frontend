import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Trophy, Skull, Crosshair, Crown } from 'lucide-react';
import '../style/stats.css';

const StatsComponent = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
                                <tr key={player.uuid}>
                                    <td className={`rank-cell rank-${index + 1}`}>#{index + 1}</td>
                                    <td className="player-cell">
                                        <img
                                            src={`https://crafatar.com/avatars/${player.uuid}?size=32&overlay`}
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
