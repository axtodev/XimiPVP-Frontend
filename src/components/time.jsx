<<<<<<< HEAD
=======
<<<<<<< HEAD
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

=======
>>>>>>> 0c76dc1 (Initial commit)
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

<<<<<<< HEAD
=======
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
export default Time;