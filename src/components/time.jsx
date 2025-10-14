import React from 'react';

function Time({ user }) {
  if (!user || !user.createdAt) {
    return <p>Loading...</p>;
  }

  const createdAt = new Date(user.createdAt);

  return (
    <p>{createdAt.toLocaleDateString()}</p> 
  )
}

export default Time;