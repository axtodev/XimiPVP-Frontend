import React from "react";
import "../style/rules.css";

const RulesPage = () => {
  const sections = [
    {
      title: "1. Compravendita Account",
      description: "È vietato scambiare, vendere o tentare di scambiare/vendere account Minecraft."
    },
    {
      title: "2. Pubblicità",
      description: "È vietato condividere IP o siti web di altri server Minecraft o community esterne."
    },
    {
      title: "3. Ban Evasion",
      description: "Non giocare con altri account se sei già bannato dal server."
    },
    {
      title: "4. Chargeback",
      description: "Non acquistare dal negozio e poi richiedere il rimborso o aprire dispute."
    },
    {
      title: "5. Cheat e Modifiche Illegali",
      description: "Non usare cheat, hack, autoclicker, macro o mod che diano vantaggi ingiusti."
    },
    {
      title: "6. Discriminazione",
      description: "Non essere omofobo, razzista o offensivo verso religioni, nazioni o etnie."
    },
    {
      title: "7. Minacce di Morte",
      description: "Non augurare o minacciare danni gravi o la morte a nessuno. Anche abbreviazioni come \"kys\" sono vietate."
    },
    {
      title: "8. Doxxing",
      description: "Non condividere o minacciare di condividere informazioni personali o private di altri giocatori."
    },
    {
      title: "9. Sfruttamento Bug",
      description: "Non abusare di bug o glitch per ottenere vantaggi."
    },
    {
      title: "10. Falsificazione Prove",
      description: "Non usare prove false per ottenere vantaggi o far punire altri ingiustamente."
    },
    {
      title: "11. Link Vietati",
      description: "Non inviare link a client hack, IP logger, malware o siti sospetti."
    },
    {
      title: "12. Lingua in Chat",
      description: "Non parlare in lingue diverse dall'italiano o dall'inglese nella chat pubblica."
    },
    {
      title: "13. Oggetti Illegali",
      description: "Non possedere oggetti non ottenibili in modo legittimo (es. command block, pozioni OP)."
    },
    {
      title: "14. Trappole Illegali",
      description: "Non intrappolare altri giocatori in portali o tramite comandi di teletrasporto per ucciderli o bloccarli."
    },
    {
      title: "15. Skin/Cape Inappropriate",
      description: "Non usare skin o mantelli con contenuti discriminatori, sessuali o offensivi."
    },
    {
      title: "16. Contenuti Inappropriati",
      description: "Non mostrare contenuti discriminatori, sessuali, volgari o offensivi."
    },
    {
      title: "17. Username Inappropriati",
      description: "Non usare username con contenuti discriminatori, sessuali o offensivi."
    },
    {
      title: "18. Evasione Mute",
      description: "Non comunicare con altri giocatori tramite account alternativi se il tuo principale è mutato."
    },
    {
      title: "19. Comportamento Negativo",
      description: "Non essere negativo o maleducato verso altri giocatori o lo staff. Non usare malattie/disabilità in modo offensivo."
    },
    {
      title: "20. Compravendita Denaro Reale",
      description: "È vietato scambiare denaro reale per oggetti, account o servizi nel server."
    },
    {
      title: "21. Spam in Chat",
      description: "Non floodare la chat inviando messaggi ripetuti o simili con l'intento di disturbare."
    },
    {
      title: "22. Spam di Comandi",
      description: "Non spammare comandi in chat o disturbare altri con richieste ripetute (es. /tp, /msg)."
    },
    {
      title: "23. Falsi Staff",
      description: "Non fingere di essere un membro dello staff o di avere permessi speciali."
    },
    {
      title: "24. Linguaggio Volgare",
      description: "Non usare parolacce o linguaggio volgare in chat."
    },
    {
      title: "25. Teaming con Cheater",
      description: "Non fare squadra intenzionalmente con cheater."
    },
    {
      title: "26. Manipolazione Elo",
      description: "Non manipolare il tuo elo (es. boost, account sharing, perdere apposta)."
    },
    {
      title: "27. Multiaccount in Classifica",
      description: "Non avere più account in classifica. Gli alt sono permessi solo se non usati per evadere ban."
    },
    {
      title: "28. Camping",
      description: "Non camperare durante i match."
    },
    {
      title: "29. Double Clicking",
      description: "Non usare tecniche di double click intenzionale. Butterfly e drag click sono a tuo rischio."
    },
    {
      title: "30. Screen Sharing",
      description: "Non rifiutare una richiesta di screen sharing da parte dello staff."
    }
  ];

  return (
    <div className="rules-page">
      <div className="rules-container">
        <header className="rules-header">
          <h1>Regolamento del Server</h1>
          <p>Ultimo aggiornamento: 15 ottobre 2025</p>
          <p className="rules-subtitle">La violazione di queste regole può comportare sanzioni tra cui mute, kick o ban permanenti</p>
        </header>
        <main className="rules-main">
          {sections.map((section, index) => (
            <div className="rules-section" key={index}>
              <h2 className="rules-title">{section.title}</h2>
              <p className="rules-description">{section.description}</p>
              {index !== sections.length - 1 && <hr className="rules-divider" />}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default RulesPage;
