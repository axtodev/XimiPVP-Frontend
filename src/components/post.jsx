import React, { useState, useEffect } from 'react';
import TagSelector from './selectTag';
import CandidaturaForm from './Candidature/staff';
import '../style/post.css';

async function creaPost(title, content, tags) {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/posts', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,   
    },
    body: JSON.stringify({ title, content, tags }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Errore nella creazione del post');
  }

  return response.json().catch(() => ({}));
}

function CreatePost({ user, onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Fetch dati utente aggiornati
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
        }
      } catch (error) {
        console.error('Errore nel fetching utente:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    async function fetchTags() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/tags', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Errore nel caricamento dei tag');

        const data = await res.json();

        // Debug: verifica i dati
        console.log('Dati utente corrente:', currentUser);
        console.log('Ruoli raw dal DB:', currentUser?.roles);
        console.log('Tutti i tag disponibili:', data);

        // Tag nascosti per ruolo
        const roles = {
          Amministratore: [],
          Owner: [],
          Moderatore: ['regolamento', 'candidatura staff'],
          Developer: ['regolamento', 'candidatura developer'],
          Utente: ['novita', 'annunci', 'eventi', 'regolamento'],
        };

        // ID ruolo -> nome
        const roleIdToName = {
          '68825b15b31d59e453e3061f': 'Amministratore',
          '68825b15b31d59e453e30623': 'Developer',
          '68825b15b31d59e453e30626': 'Moderatore',
          '68825b15b31d59e453e30629': 'Utente',
          '68b1b97a0042c37ceb374d8c': 'Owner', 
        };

        // Processa i ruoli dell'utente
        const userRoles = (currentUser?.roles || []).map(r => {
          // Se è una stringa (ID), cerca il nome nel mapping
          if (typeof r === 'string') {
            return roleIdToName[r];
          }
          // Se è un oggetto con proprietà name
          if (r.name) {
            return r.name;
          }
          // Se è un oggetto con _id
          if (r._id) {
            return roleIdToName[r._id];
          }
          return null;
        }).filter(Boolean);

        console.log('Ruoli elaborati:', userRoles);

        // Se l'utente ha almeno un ruolo privilegiato (Admin/Owner) vede tutto
        const privilegedRoles = ['Amministratore', 'Owner'];
        const isPrivileged = userRoles.some(role => privilegedRoles.includes(role));

        let filteredTags;
        if (isPrivileged) {
          filteredTags = data; // vede tutto
        } else {
          const hiddenSet = new Set(
            userRoles.flatMap(roleName => roles[roleName] || [])
              .map(tag => tag.toLowerCase().trim())
          );
          filteredTags = data.filter(tag => !hiddenSet.has(tag.name.toLowerCase().trim()));
        }

        setAvailableTags(filteredTags);

      } catch (err) {
        console.error("Errore nel caricamento dei tag", err);
        setError("Impossibile caricare i tag");
      } finally {
        setIsLoadingTags(false);
      }
    }

    if (currentUser) {
      fetchTags();
    }
  }, [currentUser]);

  const candidaturaTag = availableTags.find(
    tag => tag.name.toLowerCase() === 'candidatura staff'
  );
  const isCandidatura = candidaturaTag && tags.includes(candidaturaTag._id);

  useEffect(() => {
    if(!isCandidatura) setContent('');
  }, [isCandidatura]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await creaPost(title, content, tags);
      setSuccess('Post creato con successo!');
      setError(null);
      setTitle('');
      setContent('');
      setTags([]);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="post-form-modal">
        <button 
          className="close-button" 
          onClick={onClose} 
          aria-label="Chiudi"
        >
          ×
        </button>
        
        <h2 className="modal-title">Crea un nuovo post</h2>

        {isLoadingTags ? (
          <p>Caricamento tag...</p>
        ) : (
          <form onSubmit={handleSubmit} className="post-form">
            {!isCandidatura && (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titolo del post"
                className="post-title-input"
                required
                maxLength="100"
              />
            )}

            {isCandidatura ? (
              <CandidaturaForm onChange={setContent} />
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Scrivi un messaggio..."
                className="post-textarea"
                required
              />
            )}

            <TagSelector 
              tags={availableTags} 
              selectedTags={tags} 
              setSelectedTags={setTags} 
            />

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting || !content.trim() || (!isCandidatura && !title.trim())}
              >
                {isSubmitting ? 'Creazione...' : 'Crea Post'}
              </button>
            </div>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

export default CreatePost;