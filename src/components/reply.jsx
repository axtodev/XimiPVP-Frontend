import React, { useState, useEffect } from 'react';
import '../style/reply.css';

async function fetchReplies(postId) {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`https://api.ximi.lol/replies/post/${postId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error('Errore nel caricamento delle reply');
  }
  return res.json();
}

async function createReply(postId, content) {
  const token = localStorage.getItem('token');
  const res = await fetch('https://api.ximi.lol/replies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ content, post: postId }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Errore nella creazione della reply');
  }

  return res.json();
}

function ReplyBlock({ postId }) {
  const [replies, setReplies] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadReplies = async () => {
      try {
        const data = await fetchReplies(postId);
        setReplies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadReplies();
  }, [postId]);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!content.trim()) return;
  setIsSubmitting(true);
  try {
    await createReply(postId, content);         
    const updatedReplies = await fetchReplies(postId);
    setReplies(updatedReplies);                  
    setContent('');
    setSuccess('Reply inviata con successo!');
    setError(null);
  } catch (err) {
    setError(err.message);
    setSuccess(null);
  } finally {
    setIsSubmitting(false);
  }
};


  function isStaffUser(roles = []) {
    return roles.some(roleId =>
      ["68825b15b31d59e453e3061f", "68825b15b31d59e453e30623", "68825b15b31d59e453e30626"].includes(roleId)
    );
  }

  const sortedReplies = replies.slice().sort((a, b) => {
    const timeA = parseInt(a._id.substring(0, 8), 16);
    const timeB = parseInt(b._id.substring(0, 8), 16);
    return timeB - timeA; 
  });

  return (
    <div className="reply-block">
      <h3 className="reply-title">Commenti</h3>

      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <>
          <form className="reply-form" onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Scrivi un commento..."
              className="reply-textarea"
              required
            />
            <button type="submit" className="reply-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Invio...' : 'Invia'}
            </button>
          </form>

          <ul className="reply-list">
            {sortedReplies.length === 0 ? (
              <li className="reply-empty">Nessun commento</li>
            ) : (
              sortedReplies.map(r => {
                const roles = r.author?.roles || [];
                const isVip = roles.includes("68efd499ebef2c1956dff96e");
                const isMedia = roles.includes("68efc5d754fda135c66de403");
                const staff = isStaffUser(roles);
                const username = r.author?.username || "Utente eliminato";
                const pfp = r.author?.pfp || "https://wallpapers.com/images/hd/blank-default-pfp-wue0zko1dfxs9z2c.jpg";

                return (
                  <li key={r._id} className="reply-item">
                    <div className="reply-author-container">
                      <img src={pfp} alt={username} className="reply-pfp" />
                      <p className="reply-author">
                        {roles.map((roleId, index) => {
                          let roleName = "";
                          let roleClass = "";

                          if (roleId === "68f151d8bde29ee6d2793e21") { 
                            roleName = "[Admin]";
                            roleClass = "admin";
                          } else if (roleId === "68f151d8bde29ee6d2793e25") { 
                            roleName = "[Developer]";
                            roleClass = "dev";
                          } else if (roleId === "68f151d8bde29ee6d2793e28") {
                            roleName = "[Mod]";
                            roleClass = "mod";
                          } else if (roleId === "68f151d8bde29ee6d2793e1c") {
                            roleName = "[Owner]";
                            roleClass = "owner";
                          }

                          if (roleId === "68b1b5ad2069d4ab1f40868e") return null;

                          return <span key={index} className={`role-badge ${roleClass}`}>{roleName}</span>;
                        })}
                        {" "}
                        {!staff ? (
                          <span className={isMedia ? "media" : isVip ? "vip-username" : ""}>
                            {username}
                          </span>
                        ) : (
                          <span>{username}</span>
                        )}
                      </p>
                    </div>
                    <p className="conts">{r.content}</p>
                  </li>
                );
              })
            )}
          </ul>
        </>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ReplyBlock;
