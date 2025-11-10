import React, { useState, useEffect } from "react";

function CandidaturaForm({ onChange }) {
  const questions = [
    "Qual è il tuo nickname attuale su Minecraft? Quanti anni hai?",
    "Da quanto tempo giochi su XimiPvP?",
    "Qual è la tua modalità preferita sul server e perché?",
    "Hai mai ricevuto sanzioni (ban, mute, warn) su XimiPvP o altri server? Spiega.",
    "Qual è il tuo obiettivo entrando nello staff?",
    "Hai esperienze precedenti come Helper, Mod o altri ruoli?",
    "Quanto tempo puoi dedicare al server durante la settimana?",
    "Sai usare strumenti come Discord, Telegram e piattaforme di ticketing?",
    "Come reagiresti se un player ti insultasse mentre stai staffando?",
    "Se un amico viola il regolamento davanti a te, come ti comporti?",
    "Cosa ti rende una buona scelta per il ruolo di staffer?",
    "Hai conoscenze tecniche (plugin, comandi, anticheat, ecc.)?",
    "Inserisci il tuo contatto Telegram",
    "C’è qualche staffer attivo che potrebbe confermare le tue capacità?"
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

export default CandidaturaForm;
