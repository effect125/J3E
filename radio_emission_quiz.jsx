import React, { useState } from "react";

const questions = [
  {
    q: "What is the emission designation for VHF-FM?",
    options: ["F3C", "J2B", "F3E", "G2B"],
    answer: "F3E"
  },
  {
    q: "The correct mode of emission for HF radiotelephony SSB transmission is",
    options: ["J3E", "H3E", "F1B", "G3E"],
    answer: "J3E"
  },
  {
    q: "What is the emission designation for MF-HF voice signals?",
    options: ["F1B", "J3E", "J2B", "F3E"],
    answer: "J3E"
  },
  {
    q: "Which emission mode occupies the most bandwidth?",
    options: ["J2B", "J3E", "F1B", "F3E"],
    answer: "F3E"
  },
  {
    q: "Which mode occupies the least bandwidth?",
    options: ["H3E", "J2B", "G3E", "F3E"],
    answer: "J2B"
  }
];

export default function RadioQuiz() {
  const [selected, setSelected] = useState({});

  const handleSelect = (qIndex, option) => {
    setSelected((prev) => ({ ...prev, [qIndex]: option }));
  };

  const isCorrect = (qIndex, option) => {
    return questions[qIndex].answer === option;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Radio Emission Quiz</h1>

      {questions.map((item, qIndex) => (
        <div key={qIndex} className="p-4 border rounded-xl shadow">
          <p className="font-semibold mb-3">
            {qIndex + 1}. {item.q}
          </p>

          <div className="grid gap-2">
            {item.options.map((opt) => {
              const chosen = selected[qIndex] === opt;
              const correct = item.answer === opt;

              let color = "bg-gray-200";

              if (selected[qIndex]) {
                if (correct) color = "bg-green-400 text-white";
                else if (chosen && !correct) color = "bg-red-400 text-white";
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(qIndex, opt)}
                  className={`p-2 rounded-lg text-left ${color}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
