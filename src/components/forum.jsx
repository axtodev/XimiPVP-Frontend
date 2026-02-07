import React, { useState, useEffect, useMemo } from 'react';
import ReplyBlock from './reply';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, MessageCircle, Info, Shield, Bell, HelpCircle, FileText, Swords, ShieldCheck, Flag, Users, MoreHorizontal, User, Calendar, List, MessageSquareText } from 'lucide-react';

export default function ForumPage({ user = null }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [categories, setCategories] = useState({
    novita: { posts: [], stats: { total: 0 } },
    modalita: { posts: [], stats: { total: 0 } },
    assistenza: { posts: [], stats: { total: 0, resolved: 0, pending: 0 } },
    candidature: { posts: [], stats: { total: 0, resolved: 0, pending: 0 } },
    segnalazioni: { posts: [], stats: { total: 0, resolved: 0, pending: 0 } },
    altri: { posts: [], stats: { total: 0 } }
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const tagCategories = {
    'supporto': 'assistenza',
    'aiuto-generale': 'assistenza',
    'supporto-tecnico': 'assistenza',
    'supporto minecraft': 'assistenza',
    'supporto web': 'assistenza',
    'supporto discord': 'assistenza',
    'candidature': 'candidature',
    'staff': 'candidature',
    'builder': 'candidature',
    'candidatura staff': 'candidature',
    'candidatura builder': 'candidature',
    'SS': 'candidature',
    'kitpvp': 'modalita',
    'practice': 'modalita',
    'speedbridge': 'modalita',
    'novita': 'novita',
    'regolamento': 'novita',
    'eventi': 'novita',
    'annunci': 'novita',
    'bug-report': 'segnalazioni',
    'player-report': 'segnalazioni',
    'off-topic': 'altri',
    'altro': 'altri'
  };

  const subCategoriesMap = {
    novita: {
      label: 'Amministrazione Server & Regolamenti',
      description: 'Informazioni riguardo aggiornamenti relativi alle varie modalità di XimiPVP, eventi e tornei!',
      icon: <List size={22} />,
      subs: [
        { key: 'annunci', label: 'News & Annunci', desc: 'Tutte le novità principali del server.', icon: <MessageSquare size={20} /> },
        { key: 'regolamento', label: 'Regolamenti & Informazioni', desc: 'Leggi attentamente per non ricevere sanzioni.', icon: <MessageSquare size={20} /> },
        { key: 'eventi', label: 'Eventi', desc: 'Rimani aggiornato su tutte le attività extra.', icon: <MessageSquare size={20} /> }
      ]
    },
    modalita: {
      label: 'Modalità',
      description: 'Discussioni specifiche per ogni modalità di gioco disponibile.',
      icon: <List size={22} />,
      subs: [
        { key: 'kitpvp', label: 'KitPvP', desc: 'Discussioni riguardo la modalità KitPvP.', icon: <Swords size={20} /> },
        { key: 'practice', label: 'Practice', desc: 'Discussioni riguardo la modalità Practice.', icon: <Shield size={20} /> },
        { key: 'speedbridge', label: 'Speedbridge', desc: 'Discussioni riguardo la modalità Speedbridge.', icon: <Shield size={20} /> }
      ]
    },
    assistenza: {
      label: 'Assistenza',
      description: 'Apri una segnalazione o richiedi assistenza specifica.',
      icon: <HelpCircle size={22} />,
      subs: [
        { key: 'supporto minecraft', label: 'Supporto Minecraft', desc: 'Aiuto in-game per problemi tecnici.', icon: <HelpCircle size={20} /> },
        { key: 'supporto web', label: 'Supporto Sito Web', desc: 'Assistenza per il forum e il sito.', icon: <HelpCircle size={20} /> },
        { key: 'supporto discord', label: 'Supporto Discord', desc: 'Assistenza per il nostro server Discord.', icon: <HelpCircle size={20} /> }
      ]
    },
    candidature: {
      label: 'Candidature',
      description: 'Entra a far parte dello staff di XimiPVP.',
      icon: <Users size={22} />,
      subs: [
        { key: 'candidatura staff', label: 'Staff Candidature', desc: 'Proponiti come Helper/Mod.', icon: <User size={20} /> },
        { key: 'candidatura builder', label: 'Builder Candidature', desc: 'Proponiti per il team building.', icon: <User size={20} /> }
      ]
    },
    segnalazioni: {
      label: 'Segnalazioni',
      description: 'Segnala bug o utenti molesti del server.',
      icon: <Flag size={22} />,
      subs: [
        { key: 'player-report', label: 'Segnalazione Giocatori', desc: 'Segnala chi non rispetta le regole.', icon: <Flag size={20} /> },
        { key: 'bug-report', label: 'Segnalazione Bug', desc: 'Aiutaci a migliorare il server.', icon: <Flag size={20} /> }
      ]
    },
    altri: {
      label: 'Zona Social',
      description: 'Discussioni generali non legate direttamente al gioco.',
      icon: <MoreHorizontal size={22} />,
      subs: [
        { key: 'off-topic', label: 'Off-topic', desc: 'Discussioni libere di ogni genere.', icon: <MessageCircle size={20} /> },
        { key: 'altro', label: 'Altro', desc: 'Qualsiasi altra cosa!', icon: <MessageCircle size={20} /> }
      ]
    }
  };

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    const handleUserRolesUpdated = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await fetch('https://api.ximi.lol/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data);
          }
        }
      } catch (error) {
      }
    };

    window.addEventListener('userRolesUpdated', handleUserRolesUpdated);

    return () => {
      window.removeEventListener('userRolesUpdated', handleUserRolesUpdated);
    };
  }, []);

  useEffect(() => {
    const fetchAndOrganizePosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch('https://api.ximi.lol/posts', { headers });
        const posts = await res.json();

        const organized = JSON.parse(JSON.stringify(categories));

        posts.forEach(post => {
          const tagNames = post.tags?.map(tag => tag.name.toLowerCase()) || [];
          let category = 'altri';
          for (const tag of tagNames) {
            if (tagCategories[tag]) {
              category = tagCategories[tag];
            }
          }

          organized[category].posts.push({
            id: post._id,
            title: post.title,
            content: post.content,
            author: post.author?.username || 'Utente eliminato',
            timestamp: new Date(post.createdAt).toLocaleString(),
            tags: tagNames,
            status: post.status
          });

          organized[category].stats.total++;
          if (['assistenza', 'candidature', 'segnalazioni'].includes(category)) {
            if (post.status === 'resolved') organized[category].stats.resolved++;
            else if (post.status === 'pending') organized[category].stats.pending++;
          }
        });

        setCategories(organized);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchAndOrganizePosts();
  }, []);

  // Created by my prof LMFAO
  useEffect(() => {
    const { category, sub, postId } = params;
    const decodedSub = sub ? decodeURIComponent(sub) : null;

    if (category) setSelectedCategory(category);
    if (decodedSub) setSelectedSubCategory(decodedSub);

    if (postId && category && decodedSub && categories[category]) {
      const postsInSub = categories[category].posts.filter(p => p.tags.includes(decodedSub));
      const found = postsInSub.find(p => p.id === postId);
      if (found) setSelectedPost(found);
    } else if (!postId) {
      setSelectedPost(null);
    }

  }, [params, categories]);

  const filteredPosts = () => {
    if (!selectedCategory || !selectedSubCategory) return [];
    return categories[selectedCategory].posts.filter(post =>
      post.tags.includes(selectedSubCategory)
    );
  };

  useEffect(() => {
    if (!currentUser || !currentUser.token) return;

    const updateLastSeen = async (token) => {
      try {
        await fetch('https://api.ximi.lol/users/last-seen', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
      }
    };

    updateLastSeen(currentUser.token);

    const interval = setInterval(() => {
      updateLastSeen(currentUser.token);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const canDeletePost = (post) => {
    if (!currentUser || !currentUser.username) return false;

    // Check if user is the author
    if (post.author === currentUser.username) return true;

    // Check if user has Moderatore, Amministratore, or Owner role
    const userRoles = currentUser.roles || [];
    const roleNames = userRoles.map(role => typeof role === 'string' ? role : role.name);
    return roleNames.some(role => ['Moderatore', 'Amministratore', 'Owner'].includes(role));
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://api.ximi.lol/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Errore durante l'eliminazione del post");
      }

      // Navigate back and refresh
      setSelectedPost(null);
      navigate(`/forum/${selectedCategory}/${encodeURIComponent(selectedSubCategory)}`);

      // Refresh posts
      window.location.reload();
    } catch (error) {
      alert(error.message || "Errore durante l'eliminazione del post");
    } finally {
      setIsDeleting(false);
    }
  };

  const getLatestPost = (catKey, subKey) => {
    const posts = categories[catKey]?.posts || [];
    const subPosts = posts.filter(p => p.tags.includes(subKey));
    if (subPosts.length === 0) return null;
    return subPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  const getSubStats = (catKey, subKey) => {
    const posts = categories[catKey]?.posts || [];
    const subPosts = posts.filter(p => p.tags.includes(subKey));
    return {
      disc: subPosts.length,
      msgs: subPosts.length // In a real scenario we'd count replies, but here we estimate
    };
  };

  return (
    <div className="Forum-Coral-Wrapper">
      {!selectedSubCategory && !selectedPost ? (
        <div className="categories-vertical-panel">
          {Object.entries(subCategoriesMap).map(([catKey, catData]) => (
            <div className="category-panel" key={catKey}>
              <div className="category-panel-header">
                <div className="cat-icon-box">{catData.icon}</div>
                <div className="cat-header-text">
                  <h2>{catData.label}</h2>
                  <p>{catData.description}</p>
                </div>
              </div>

              <div className="sub-rows-container">
                {catData.subs.map(sub => {
                  const stats = getSubStats(catKey, sub.key);
                  const latest = getLatestPost(catKey, sub.key);

                  return (
                    <div
                      key={sub.key}
                      className="forum-row"
                      onClick={() => {
                        setSelectedCategory(catKey);
                        setSelectedSubCategory(sub.key);
                        navigate(`/forum/${catKey}/${encodeURIComponent(sub.key)}`);
                      }}
                    >
                      <div className="row-main-col">
                        <div className="row-icon-side">{sub.icon}</div>
                        <div className="row-text-side">
                          <h3>{sub.label}</h3>
                          <p>{sub.desc}</p>
                        </div>
                      </div>

                      <div className="row-stats-col">
                        <div className="stat-item">
                          <span className="stat-label">Discussioni</span>
                          <span className="stat-value">{stats.disc}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Messaggi</span>
                          <span className="stat-value">{stats.msgs}</span>
                        </div>
                      </div>

                      <div className="row-latest-col">
                        {latest ? (
                          <div className="latest-post-box">
                            <span className="latest-title">{latest.title.length > 30 ? latest.title.slice(0, 30) + '...' : latest.title}</span>
                            <span className="latest-meta">
                              {latest.timestamp.split(',')[0]} • <span className="author">{latest.author}</span>
                            </span>
                          </div>
                        ) : (
                          <span className="no-latest">Nessun messaggio</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : selectedSubCategory && !selectedPost ? (
        <>
          <button onClick={() => { setSelectedSubCategory(null); navigate('/forum'); }} style={{ marginBottom: '1rem' }}>
            ← Indietro
          </button>

          {loading ? (
            <p>Caricamento post...</p>
          ) : filteredPosts().length > 0 ? (
            filteredPosts().map(post => (
              <article
                key={post.id}
                className="thread"
                style={{ cursor: 'pointer' }}
                onClick={() => { setSelectedPost(post); navigate(`/forum/${selectedCategory}/${encodeURIComponent(selectedSubCategory)}/${post.id}`); }}
              >
                <h3 className="post-title">{post.title}</h3>
                <p className="post-preview">{post.content.slice(0, 100)}...</p>
                <small className="post-meta">
                  Autore: {post.author} | {post.timestamp}
                </small>
              </article>
            ))
          ) : (
            <p>Nessun post in questa sotto-categoria.</p>
          )}
        </>
      ) : selectedPost ? (
        <div className="post-wrapper">
          <section className="main-content">
            <button
              className="btn back-button"
              onClick={() => { setSelectedPost(null); navigate(`/forum/${selectedCategory}/${encodeURIComponent(selectedSubCategory)}`); }}
            >
              ← Torna ai post
            </button>

            <div className="thread-container">
              <h1 className="thread-title">{selectedPost.title}</h1>
              <div className="thread-content">
                {selectedPost.content.split('\n').map((paragraph, i) => (
                  <p key={i} className="par">{paragraph}</p>
                ))}

                <div className="thread-meta">
                  <span className="author">Autore: {selectedPost.author}</span>
                  <span className="timestamp">{selectedPost.timestamp}</span>
                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="tags">
                      {selectedPost.tags.map((tag, i) => (
                        <span key={i} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {canDeletePost(selectedPost) && (
                <button
                  className="btn delete-button"
                  onClick={() => handleDeletePost(selectedPost.id)}
                  disabled={isDeleting}
                  style={{
                    marginTop: '1rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    opacity: isDeleting ? 0.6 : 1
                  }}
                >
                  {isDeleting ? 'Eliminazione...' : 'Elimina Post'}
                </button>
              )}
            </div>
          </section>
          <ReplyBlock postId={selectedPost.id} user={currentUser} />
        </div>
      ) : null}
    </div>
  );
}
