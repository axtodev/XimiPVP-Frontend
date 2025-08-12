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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch('http://localhost:3000/tags');
        if (response.ok) {
          const data = await response.json();

          const roles = {
            Amministratore: [],
            Moderatore: ['regolamento', 'candidatura staff'],
            Developer: ['regolamento', 'candidatura developer'],
            Utente: ['novita', 'annunci', 'eventi', 'regolamento'],
          };

          const roleIdToName = {
            '68825b15b31d59e453e3061f': 'Amministratore',
            '68825b15b31d59e453e30623': 'Developer',     
            '68825b15b31d59e453e30626': 'Moderatore',
            '68825b15b31d59e453e30629': 'Utente'    
          };

          const roleId = user?.roles?.[0] || '';
          const roleName = roleIdToName[roleId] || 'Utente';
          const hiddenTags = roles[roleName] || roles.Utente;

          setAvailableTags(
            data.filter(tag => !hiddenTags.includes(tag.name.toLowerCase().trim()))
          );
        }
      } catch (err) {
        console.error("Errore nel caricamento dei tag", err);
        setError("Impossibile caricare i tag");
      } finally {
        setIsLoadingTags(false);
      }
    }

    fetchTags();
  }, [user]);

  const candidaturaTag = availableTags.find(
    tag => tag.name.toLowerCase() === 'candidatura staff'
  );
  const isCandidatura = candidaturaTag && tags.includes(candidaturaTag._id);

  useEffect(() =>{
    if(!isCandidatura) {
      setContent('');
    }
  }, [isCandidatura])

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
