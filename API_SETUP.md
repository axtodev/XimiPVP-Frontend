# Configurazione API Backend

## Setup Completato ✅

L'API backend è stata collegata con successo al frontend.

### URL API Configurato
```
http://ximi.ximipvp.com:3000
```

## Come Funziona

1. **File di configurazione**: `.env`
   - Contiene l'URL del backend
   - Non viene committato su Git (protetto da `.gitignore`)

2. **Modulo centralizzato**: `src/config/api.js`
   - Esporta `API_URL` usata da tutti i componenti
   - Legge automaticamente da `.env`

## Componenti Aggiornati

Tutti i seguenti componenti ora usano la configurazione centralizzata:

- ✅ `login.jsx` - Login utenti
- ✅ `register.jsx` - Registrazione utenti
- ✅ `confirm.jsx` - Conferma email
- ✅ `profile.jsx` - Profilo utente
- ✅ `profileRoles.jsx` - Gestione ruoli
- ✅ `profileBadges.jsx` - Gestione badge
- ✅ `post.jsx` - Creazione post
- ✅ `reply.jsx` - Risposte ai post
- ✅ `forum.jsx` - Forum
- ✅ `goal.jsx` - Statistiche utenti
- ✅ `bans.jsx` - Lista ban
- ✅ `staff.jsx` - Lista staff
- ✅ `onlinestaff.jsx` - Staff online

## Per Cambiare Backend

### Produzione
Modifica il file `.env`:
```bash
VITE_API_URL=http://ximi.ximipvp.com:3000
```

### Sviluppo Locale
```bash
VITE_API_URL=http://localhost:3000
```

## Importante ⚠️

- **Riavvia il server di sviluppo** dopo aver modificato `.env`
- Il file `.env` è protetto da Git (non verrà committato)
- Usa `.env.example` come template per altri sviluppatori

## Test

Per verificare che tutto funzioni:

1. Avvia il dev server:
   ```bash
   npm run dev
   ```

2. Controlla la console del browser per eventuali errori API

3. Testa le funzionalità:
   - Login/Registrazione
   - Visualizzazione profili
   - Forum e post
   - Lista ban e staff
