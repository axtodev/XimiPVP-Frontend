import React, { useState, useEffect } from 'react';
import ReplyBlock from './reply';
import { useParams, useNavigate } from 'react-router-dom';

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
    'candidature': 'candidature',
    'staff': 'candidature',
    'builder': 'candidature',
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
    novita: [
      { key: 'regolamento', label: 'Regolamento' },
      { key: 'novita', label: 'Novità' },
      { key: 'annunci', label: 'Annunci' },
      { key: 'eventi', label: 'Eventi' }
    ],
    assistenza: [
      { key: 'supporto minecraft', label: 'Supporto Modalità' },
      { key: 'supporto web', label: 'Supporto Sito Web' },
      { key: 'supporto discord', label: 'Supporto Discord' }
    ],
    candidature: [
      { key: 'candidatura staff', label: 'Staff' },
      { key: 'candidatura ss', label: 'SS' },
      { key: 'candidatura developer', label: 'developer' },
      { key: 'candidatura builder', label: 'Builder' },
      { key: 'candidatura social', label: 'Social' }
    ],
    modalita: [
      { key: 'kitpvp', label: 'KitPvP' },
      { key: 'practice', label: 'Practice' },
      { key: 'speedbridge', label: 'Speedbridge' }
    ],
    segnalazioni: [
      { key: 'player-report', label: 'Segnalazione giocatore' },
      { key: 'bug-report', label: 'Segnalazione bug' }
    ],
    altri: [
      { key: 'off-topic', label: 'Off-topic' },
      { key: 'altro', label: 'Altro' }
    ]
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
        throw new Error(error.message || 'Errore durante l\'eliminazione del post');
      }

      // Navigate back and refresh
      setSelectedPost(null);
      navigate(`/forum/${selectedCategory}/${encodeURIComponent(selectedSubCategory)}`);

      // Refresh posts
      window.location.reload();
    } catch (error) {
      alert(error.message || 'Errore durante l\'eliminazione del post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="Forum XimiPVP">
      {!selectedSubCategory && !selectedPost ? (
        <div className="categories-vertical">
          <h1 className="title">Forum XimiPVP</h1>
          {Object.entries(categories).map(([catKey, catData]) => (
            <div className="category-row" key={catKey}>
              <h2>{catKey.charAt(0).toUpperCase() + catKey.slice(1)}</h2>
              <div className="category-stats">
                <span>Discussioni: {catData.stats.total}</span>
                {catData.stats.resolved !== undefined && <></>}
              </div>
              {subCategoriesMap[catKey] && (
                <div className="subcategories">
                  {subCategoriesMap[catKey].map(sub => (
                    <div
                      key={sub.key}
                      className="subcategory-item"
                      onClick={() => {
                        setSelectedCategory(catKey);
                        setSelectedSubCategory(sub.key);
                        navigate(`/forum/${catKey}/${encodeURIComponent(sub.key)}`);
                      }}
                    >
                      {sub.label}
                    </div>
                  ))}
                </div>
              )}
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
            </div>
          </section>
          <ReplyBlock postId={selectedPost.id} user={currentUser} />
        </div>
      ) : null}
    </div>
  );
}
