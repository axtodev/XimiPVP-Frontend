import React from "react";
import "../style/policy.css";

const PolicyPage = () => {
  const sections = [
    {
      title: "Raccolta dei dati",
      points: [
        "Raccogliamo dati come email, username, password criptata.",
        "Raccogliamo dati di navigazione tramite strumenti analytics.",
        "Raccogliamo dati di pagamento per lo store."
      ]
    },
    {
      title: "Finalità del trattamento",
      points: [
        "Consentire registrazione e login.",
        "Inviare email di verifica e comunicazioni account.",
        "Gestire acquisti in gioco, statistiche e controllo regolamento."
      ]
    },
    {
      title: "Conservazione dei dati",
      points: [
        "I dati dell'account sono conservati finché il profilo esiste.",
        "I dati analitici sono conservati in forma anonima.",
        "Lo staff può eliminare profili che violano il regolamento."
      ]
    },
    {
      title: "Condivisione dei dati",
      points: [
        "I profili creati sono pubblici e visibili a chiunque.",
        "I dati non vengono venduti a terzi."
      ]
    },
    {
      title: "Sicurezza dei dati",
      points: [
        "Adottiamo misure tecniche e organizzative per proteggere i dati.",
        "Le password sono sempre memorizzate in forma criptata."
      ]
    },
    {
      title: "Diritti dell’utente",
      points: [
        "Accesso ai propri dati personali.",
        "Richiesta di rettifica o cancellazione dei dati.",
      ]
    },
    {
      title: "Pagamenti e resi",
      points: [
        "I pagamenti nello store sono definitivi e non rimborsabili.",
        "I vantaggi acquistati sono virtuali e legati al tuo account."
      ]
    },
    {
      title: "Modifiche alla policy",
      points: [
        "Possiamo aggiornare la policy in qualsiasi momento.",
        "Gli utenti registrati non saranno informati tramite email o notifica sul sito."
      ]
    },
    {
      title: "Contatti",
      points: [
        "Per domande sulla privacy: assistenza@ximipvp.it"
      ]
    }
  ];

  return (
    <div className="policy-page">
      <div className="policy-container">
        <header className="policy-header">
          <h1>Privacy Policy e Termini d’Uso</h1>
          <p>Ultimo aggiornamento: 8 settembre 2025</p>
        </header>
        <main className="policy-main">
          {sections.map((section, index) => (
            <div className="policy-section" key={index}>
              <h2 className="policy-title">{section.title}</h2>
              <ul className="policy-points">
                {section.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
              {index !== sections.length - 1 && <hr className="policy-divider" />}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default PolicyPage;
