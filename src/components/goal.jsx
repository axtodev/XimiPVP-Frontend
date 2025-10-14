import React, { useEffect, useState } from 'react';
import { API_URL } from '../config/api';

const Goal = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const goals = [10, 100, 1000, 10000];

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(`${API_URL}/users/count`);
        const data = await response.json();
        setCount(data.c || 0);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  const getNextGoal = () => {
    return goals.find(goal => count < goal) || goals[goals.length - 1];
  };

  const currentGoal = getNextGoal();
  const progress = Math.min((count / currentGoal) * 100, 100);

  return (
    <div style={{ background: 'white', height: '150px', display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', borderRadius: '10px', boxShadow: 'var(--box)'}}>
      <h3 style={{color: 'var(--primary)', marginTop: '10px'}}>Utenti registrati</h3>
      {loading ? (
        <p style={{color: 'var(--primary)'}}>Caricamento...</p>
      ) : (
        <>
          <div style={{
            backgroundColor: '#eee',
            borderRadius: '10px',
            overflow: 'hidden',
            height: '20px',
            width: '90%',
            marginTop: '20px',
            marginBottom: '20px'
          }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: 'var(--primary)',
                transition: 'width 0.5s ease-in-out'
              }}
            />
          </div>

          <p>{count} / {currentGoal}</p>
        </>
      )}
    </div>
  );
};

export default Goal;
