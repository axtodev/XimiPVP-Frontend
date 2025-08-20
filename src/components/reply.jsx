import React, { useState, useEffect } from 'react';
import '../style/reply.css';

async function fetchReplies(postId) {
  const res = await fetch(`http://localhost:3000/replies/post/${postId}`);
  if (!res.ok) throw new Error('Errore nel caricamento delle reply');
  return res.json();
}

async function createReply(postId, content) {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3000/replies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
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
      const newReply = await createReply(postId, content);
      setReplies(prev => [...prev, newReply]);
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
        {replies.length === 0 ? (
            <li className="reply-empty">Nessun commento</li>
        ) : (
            replies.map(r => (
            <li key={r._id} className="reply-item">
                <p className="reply-author">
                {r.author?.roles?.length > 0 && (
                    <>
                    {r.author.roles.map((roleId, index) => {
                        let roleName = "";
                        let roleClass = "";

                        if (roleId === "68825b15b31d59e453e3061f") { 
                            roleName = "[Admin]";
                            roleClass = "admin";
                        } else if (roleId === "68825b15b31d59e453e30623") { 
                            roleName = "[Developer]";
                            roleClass = "dev";
                        }else if (roleId === "68825b15b31d59e453e30626") {
                            roleName = "[Mod]"
                            roleClass = "mod"
                        }
                        else {
                            roleName = " ";
                            roleClass = " ";
                        }

                        return <span key={index} className={`role-badge ${roleClass}`}>{roleName}</span>;
                    })}
                    {" "}
                    </>
                )}
                {r.author?.username || "Sconosciuto"}
                </p>

                <p className='conts'>{r.content}</p>
            </li>
            ))
        )}
        </ul>

        </>
      )}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}

export default ReplyBlock;
