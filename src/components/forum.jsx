import React, { useState, useEffect } from 'react';
import ReplyBlock from './reply';

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
      { key: 'supporto discord', label: 'Supporto Discord'}
    ],
    candidature: [
      { key: 'candidatura staff', label: 'Staff' },
      {key: 'candidatura ss', label: 'SS'},
      { key: 'candidatura developer', label: 'developer'},
      { key: 'candidatura builder', label: 'Builder' },
      { key: 'candidatura social', label: 'Social'}
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
    const fetchAndOrganizePosts = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/posts');
        const posts = await res.json();

        const organized = JSON.parse(JSON.stringify(categories));

        posts.forEach(post => {
          const tagNames = post.tags?.map(tag => tag.name.toLowerCase()) || [];
          let category = 'altri';

          for (const tag of tagNames) {
            if (tagCategories[tag]) {
              category = tagCategories[tag];
              break;
            }
          }

          organized[category].posts.push({
            id: post._id,
            title: post.content.substring(0, 50),
            content: post.content,
            author: post.author?.username || 'Utente eliminato',
            timestamp: new Date(post.createdAt).toLocaleString(),
            tags: tagNames,
            status: post.status
          });

          organized[category].stats.total++;
          if (['assistenza', 'candidatura', 'segnalazioni'].includes(category)) {
            if (post.status === 'resolved') organized[category].stats.resolved++;
            else if (post.status === 'pending') organized[category].stats.pending++;
          }
        });

        setCategories(organized);
      } catch (err) {
        console.error('Errore nel fetch dei post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndOrganizePosts();
  }, []);

  const filteredPosts = () => {
    if (!selectedCategory || !selectedSubCategory) return [];
    return categories[selectedCategory].posts.filter(post =>
      post.tags.includes(selectedSubCategory)
    );
  };

  useEffect(() => {
    if(!user || !user.token) return;

    updateLastSeen(user.token);

    const interval = setInterval(()=>{
      updateLastSeen(user.token)
    }, 5 * 60 * 1000);

    return() => clearInterval(interval);
  },
  [user]);

return (
    <div className="Forum XimiPVP">
      {!selectedSubCategory && !selectedPost ? (
        // Lista categorie
        <div className="categories-vertical">
          <h1 className="title">Forum XimiPVP</h1>
          {Object.entries(categories).map(([catKey, catData]) => (
            <div className="category-row" key={catKey}>
              <h2>{catKey.charAt(0).toUpperCase() + catKey.slice(1)}</h2>
              <div className="category-stats">
                <span>Discussioni: {catData.stats.total}</span>
                {catData.stats.resolved !== undefined && (
                  <>
                    <span>Risolte: {catData.stats.resolved}</span>
                    <span>In attesa: {catData.stats.pending}</span>
                  </>
                )}
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
          <button onClick={() => setSelectedSubCategory(null)} style={{ marginBottom: '1rem' }}>
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
                onClick={() => setSelectedPost(post)}
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
    {/* Colonna principale del thread */}
    <section className="main-content">
      <button 
        className="btn back-button"
        onClick={() => setSelectedPost(null)}
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
    <ReplyBlock postId={selectedPost.id} user={user} />
  </div>
) : null}

    </div>
  );

}
