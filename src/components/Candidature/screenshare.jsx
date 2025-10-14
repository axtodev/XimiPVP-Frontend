import React, { useState, useEffect } from "react";

function ScreenShareForm({ onChange }) {
  const questions = [
    "Qual è il tuo attuale nickname Minecraft e quanti anni hai?",
    "Hai già svolto il ruolo di SS Staffer in altri server? Se sì, elencali e indica anche per quanto tempo.",
    "Conosci come funzionano i ghost client, injection, mod loader e client esterni? Descrivi brevemente cosa sai.",
    "Sai leggere i log di Minecraft o file di configurazione di mod/client?",
    "Quali sono, secondo te, i 'segnali' più evidenti che indicano un cheater?",
    "Hai mai commesso errori in un controllo? Se sì, racconta l’esperienza e cosa hai imparato.",
    "Hai mai utilizzato cheat in passato? Se sì, quando e perché hai smesso? (Risposta onesta, non comporta sulla tua candidatura.)",
    "Durante un controllo, il player si rifiuta di passarti anydesk. Cosa fai?",
    "Quanto tempo settimanale potresti dedicare ai controlli SS su XimiPvP? (Specificare orari e giorni)",
    "Sapresti controllare un computer che abbia un sistema operativo diverso da Windows? (ES: Linux, MacOS ecc..)",
    "In che modo individueresti un injection loader o DLL sospetta attiva nei processi?",
    "Con quali tool/software per ScreenShare hai familiarità?",
    "Inserisci il tuo contatto Telegram per comunicazioni interne.",
    "C’è uno Staffer attuale che può garantire per te (Vouch)? (Inserire solo se autorizzato)"
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  useEffect(() => {
    const content = questions
      .map((q, i) => `${i + 1}. ${q}\n${answers[i]}\n`)
      .join("\n");
    onChange(content);
  }, [answers]);

  function handleChange(index, value) {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  }

  return (
    <div className="candidatura-form">
      {questions.map((q, index) => (
        <div key={index} className="candidatura-question">
          <label>
            {index + 1}. {q}
          </label>
          <textarea
            value={answers[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            rows={2}
          />
        </div>
      ))}
    </div>
  );
}

export default ScreenShareForm;
