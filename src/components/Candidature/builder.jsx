<<<<<<< HEAD
=======
<<<<<<< HEAD
import React, { useState, useEffect } from "react";

function BuilderForm({ onChange }) {
  const questions = [
    "Non disponibile al momento"
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

export default BuilderForm;
=======
>>>>>>> 0c76dc1 (Initial commit)
import React, { useState, useEffect } from "react";

function BuilderForm({ onChange }) {
  const questions = [
    "Non disponibile al momento"
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

export default BuilderForm;
<<<<<<< HEAD
=======
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
