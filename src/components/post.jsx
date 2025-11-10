import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { API_URL } from '../config/api';
=======
<<<<<<< HEAD
=======
import { API_URL } from '../config/api';
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
import TagSelector from './selectTag';
import CandidaturaStaffForm from './Candidature/staff';
import DeveloperForm from './Candidature/developer';
import BuilderForm from './Candidature/builder';
import ScreenShareForm from './Candidature/screenshare';
import '../style/post.css';

async function creaPost(title, content, tags) {
  const token = localStorage.getItem('token');

<<<<<<< HEAD
  const response = await fetch(`${API_URL}/posts`, {
=======
<<<<<<< HEAD
  const response = await fetch('https://api.ximi.lol/posts', {
=======
  const response = await fetch(`${API_URL}/posts`, {
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
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
  const [candidatureContent, setCandidatureContent] = useState({});
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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
<<<<<<< HEAD
        const res = await fetch(`${API_URL}/users/profile`, {
=======
<<<<<<< HEAD
        const res = await fetch('https://api.ximi.lol/users/profile', {
=======
        const res = await fetch(`${API_URL}/users/profile`, {
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
        }
      } catch (error) {
      }
    };
    
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    async function fetchTags() {
      try {
        const token = localStorage.getItem('token');
<<<<<<< HEAD
        const res = await fetch(`${API_URL}/tags`, {
=======
<<<<<<< HEAD
        const res = await fetch('https://api.ximi.lol/tags', {
=======
        const res = await fetch(`${API_URL}/tags`, {
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Errore nel caricamento dei tag');

        const data = await res.json();

        const roles = {
          Amministratore: [],
          Owner: [],
          Moderatore: ['annunci','eventi', 'regolamento', 'candidatura staff'],
          Builder: ['novita', 'annunci','eventi', 'regolamento', 'candidatura builder'],
          Developer: ['eventi', 'regolamento', 'candidatura developer'],
          Vip: ['novita', 'annunci', 'eventi', 'regolamento'],
          Media: ['novita', 'annunci', 'eventi', 'regolamento'],
          Utente: ['novita', 'annunci', 'eventi', 'regolamento'],
        };

        const roleIdToName = {
<<<<<<< HEAD
=======
<<<<<<< HEAD
          '68f151d8bde29ee6d2793e1c': 'Owner',
          '68f151d8bde29ee6d2793e21': 'Amministratore',
          '68f151d8bde29ee6d2793e25': 'Developer',
          '68f151d8bde29ee6d2793e28': 'Moderatore',
          '68f151d8bde29ee6d2793e2b': 'Builder',
          '68f151d8bde29ee6d2793e2e': 'Vip',
          '68f151d8bde29ee6d2793e31': 'Media',
          '68f151d8bde29ee6d2793e34': 'Utente'
=======
>>>>>>> 0c76dc1 (Initial commit)
          '68825b15b31d59e453e3061f': 'Amministratore',
          '68825b15b31d59e453e30623': 'Developer',
          '68825b15b31d59e453e30626': 'Moderatore',
          '68825b15b31d59e453e30629': 'Utente',
          '68b1b97a0042c37ceb374d8c': 'Owner', 
          '68b1b5ad2069d4ab1f40868a': 'Builder',
          '68b1b5ad2069d4ab1f40868e': 'Vip',
          '68b1b97a0042c37ceb374d95': 'Media'
<<<<<<< HEAD
=======
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
        };

        const userRoles = (currentUser?.roles || []).map(r => {
          if (typeof r === 'string') return roleIdToName[r];
          if (r.name) return r.name;
          if (r._id) return roleIdToName[r._id];
          return null;
        }).filter(Boolean);

        const privilegedRoles = ['Amministratore', 'Owner'];
        const isPrivileged = userRoles.some(role => privilegedRoles.includes(role));

        let filteredTags;
        if (isPrivileged) {
          filteredTags = data;
        } else {
          const hiddenSet = new Set(
            userRoles.flatMap(roleName => roles[roleName] || [])
              .map(tag => tag.toLowerCase().trim())
          );
          filteredTags = data.filter(tag => !hiddenSet.has(tag.name.toLowerCase().trim()));
        }

        setAvailableTags(filteredTags);

      } catch (err) {
        setError("Impossibile caricare i tag");
      } finally {
        setIsLoadingTags(false);
      }
    }

    if (currentUser) {
      fetchTags();
    }
  }, [currentUser]);

  const candidaturaMap = {
    'candidatura staff': CandidaturaStaffForm,
    'candidatura developer': DeveloperForm,
    'candidatura builder': BuilderForm,
    'candidatura screenshare': ScreenShareForm,
  };

  const candidaturaTag = availableTags.find(tag =>
    Object.keys(candidaturaMap).includes(tag.name.toLowerCase()) &&
    tags.includes(tag._id)
  );

  const CandidaturaComponent = candidaturaTag
    ? candidaturaMap[candidaturaTag.name.toLowerCase()]
    : null;

  const candidaturaKey = candidaturaTag?.name.toLowerCase();

  useEffect(() => {
    if (candidaturaKey) {
      setCandidatureContent(prev => ({
        ...prev,
        [candidaturaKey]: prev[candidaturaKey] || ''
      }));
    }
  }, [candidaturaKey]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const finalContent = CandidaturaComponent
        ? candidatureContent[candidaturaKey] || ''
        : content;

      await creaPost(title, finalContent, tags);
      setSuccess('Post creato con successo!');
      setError(null);
      setTitle('');
      setContent('');
      setTags([]);
      setCandidatureContent({});
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
            {!CandidaturaComponent && (
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

            {CandidaturaComponent ? (
              <CandidaturaComponent
                key={candidaturaKey}
                value={candidatureContent[candidaturaKey] || ''} 
                onChange={(val) =>
                  setCandidatureContent(prev => ({
                    ...prev,
                    [candidaturaKey]: val,
                  }))
                }
              />
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
                disabled={isSubmitting || 
                  (!CandidaturaComponent && !content.trim()) ||
                  (CandidaturaComponent && !(candidatureContent[candidaturaKey]?.trim()))
                }
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
=======
>>>>>>> 0c76dc1 (Initial commit)
            {!CandidaturaComponent && (
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

            {CandidaturaComponent ? (
              <CandidaturaComponent
                key={candidaturaKey}
                value={candidatureContent[candidaturaKey] || ''} 
                onChange={(val) =>
                  setCandidatureContent(prev => ({
                    ...prev,
                    [candidaturaKey]: val,
                  }))
                }
              />
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
                disabled={isSubmitting || 
                  (!CandidaturaComponent && !content.trim()) ||
                  (CandidaturaComponent && !(candidatureContent[candidaturaKey]?.trim()))
                }
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

<<<<<<< HEAD
export default CreatePost;
=======
export default CreatePost;
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
