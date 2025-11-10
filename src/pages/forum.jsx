<<<<<<< HEAD
=======
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import CreatePost from '../components/post';
import '../style/forum.css';
import ForumPage from '../components/forum';
import StaffOnline from '../components/onlinestaff';
import '../style/forumpage.css';
import OnlinePlayer from '../components/onlineplayer';
import '../style/Root.css';
import Goal from '../components/goal';
import '../style/thread.css'

function Forum() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(false);

  const creaPost = () => {
    setPost(true);
  };

  const chiudiPost = () => {
    setPost(false);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <div className="forum-container">
      <div className="forum-main">
        <ForumPage user={user} />
      </div>
      <div className="forum-sidebar">
        <StaffOnline token={token} />

        <div className="bottom-sidebars">
          <OnlinePlayer address={'play.ximipvp.eu'} />
          <OnlinePlayer address={'play.ximipvp.eu'} />
        </div>

        <Goal />

        {localStorage.getItem('token') && (
          <button className="new" onClick={creaPost}>Nuovo post</button>
        )}

        {post && <CreatePost user={user} onClose={chiudiPost} />}

      </div>
    </div>
  );
}

=======
>>>>>>> 0c76dc1 (Initial commit)
import React, { useState, useEffect } from 'react';
import CreatePost from '../components/post';
import '../style/forum.css';
import ForumPage from '../components/forum';
import StaffOnline from '../components/onlinestaff';
import '../style/forumpage.css';
import OnlinePlayer from '../components/onlineplayer';
import '../style/Root.css';
import Goal from '../components/goal';
import '../style/thread.css'

function Forum() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(false);

  const creaPost = () => {
    setPost(true);
  };

  const chiudiPost = () => {
    setPost(false);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <div className="forum-container">
      <div className="forum-main">
        <ForumPage user={user} />
      </div>
      <div className="forum-sidebar">
        <StaffOnline token={token} />

        <div className="bottom-sidebars">
          <OnlinePlayer address={'play.ximipvp.eu'} />
          <OnlinePlayer address={'play.ximipvp.eu'} />
        </div>

        <Goal />

        {localStorage.getItem('token') && (
          <button className="new" onClick={creaPost}>Nuovo post</button>
        )}

        {post && <CreatePost user={user} onClose={chiudiPost} />}

      </div>
    </div>
  );
}

<<<<<<< HEAD
=======
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
export default Forum;