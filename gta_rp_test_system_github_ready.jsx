export default function App() {
  // GTA RP Test System
  // GitHub Ready React Component
  // Features:
  // - 505 questions support
  // - Random 45-question exam
  // - All questions mode
  // - Mistakes mode
  // - Reset exam button
  // - LocalStorage saving

  import React, { useEffect, useMemo, useState } from 'react';

  const TOTAL_EXAM_QUESTIONS = 45;

  // ==========================================
  // QUESTIONS DATABASE
  // Добавляй сюда свои 505 вопросов
  // ==========================================
  const QUESTIONS = [
    {
      id: 1,
      question: 'Какой цвет означает остановку?',
      answers: ['Зелёный', 'Красный', 'Синий', 'Жёлтый'],
      correct: 1,
    },
    {
      id: 2,
      question: 'Кто имеет право проводить задержание?',
      answers: ['Любой гражданин', 'Сотрудник гос. структуры', 'Механик', 'Журналист'],
      correct: 1,
    },
    {
      id: 3,
      question: 'Что запрещено делать сотруднику?',
      answers: ['Нарушать устав', 'Следовать приказу', 'Патрулировать', 'Заполнять отчёт'],
      correct: 0,
    },

    // ======================================
    // ДОБАВЬ ОСТАЛЬНЫЕ 502 ВОПРОСА
    // ======================================
  ];

  function shuffleArray(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }

  function getRandomExamQuestions() {
    return shuffleArray(QUESTIONS).slice(0, TOTAL_EXAM_QUESTIONS);
  }

  const loadMistakes = () => {
    const data = localStorage.getItem('mistakes');
    return data ? JSON.parse(data) : [];
  };

  const saveMistakes = (mistakes) => {
    localStorage.setItem('mistakes', JSON.stringify(mistakes));
  };

  const loadExam = () => {
    const data = localStorage.getItem('current_exam');
    return data ? JSON.parse(data) : getRandomExamQuestions();
  };

  const saveExam = (exam) => {
    localStorage.setItem('current_exam', JSON.stringify(exam));
  };

  const [mode, setMode] = useState('exam');
  const [examQuestions, setExamQuestions] = useState(loadExam());
  const [mistakes, setMistakes] = useState(loadMistakes());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    saveMistakes(mistakes);
  }, [mistakes]);

  useEffect(() => {
    saveExam(examQuestions);
  }, [examQuestions]);

  const questionsToShow = useMemo(() => {
    if (mode === 'all') return QUESTIONS;
    if (mode === 'mistakes') return mistakes;
    return examQuestions;
  }, [mode, mistakes, examQuestions]);

  const question = questionsToShow[currentQuestion];

  const resetState = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setFinished(false);
  };

  const startExam = () => {
    const newExam = getRandomExamQuestions();
    setExamQuestions(newExam);
    setMode('exam');
    resetState();
  };

  const startAllQuestions = () => {
    setMode('all');
    resetState();
  };

  const startMistakes = () => {
    setMode('mistakes');
    resetState();
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    const isCorrect = index === question.correct;

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);

      // Удаление из ошибок если ответил правильно
      setMistakes((prev) => prev.filter((q) => q.id !== question.id));
    } else {
      // Добавление в ошибки
      setMistakes((prev) => {
        const alreadyExists = prev.find((q) => q.id === question.id);

        if (alreadyExists) return prev;

        return [...prev, question];
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= questionsToShow.length) {
      setFinished(true);
      return;
    }

    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
  };

  if (!question && mode === 'mistakes') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-5">
        <div className="bg-zinc-900 p-10 rounded-2xl border border-zinc-700 text-center max-w-xl w-full">
          <h1 className="text-4xl font-bold mb-4">Работа над ошибками</h1>
          <p className="text-zinc-300 text-lg mb-6">
            У тебя нет ошибок. Все вопросы решены правильно.
          </p>

          <button
            onClick={startExam}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-lg font-bold"
          >
            Начать новый тест
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-5">
        <div className="bg-zinc-900 p-10 rounded-2xl border border-zinc-700 max-w-2xl w-full text-center">
          <h1 className="text-5xl font-bold mb-6">Тест завершён</h1>

          <div className="text-2xl mb-4">
            Правильных ответов: <span className="text-green-400">{correctAnswers}</span>
          </div>

          <div className="text-2xl mb-8">
            Ошибок: <span className="text-red-400">{questionsToShow.length - correctAnswers}</span>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={startExam}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold"
            >
              Новый тест (45 вопросов)
            </button>

            <button
              onClick={startMistakes}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold"
            >
              Работа над ошибками
            </button>

            <button
              onClick={startAllQuestions}
              className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-xl font-bold"
            >
              Все вопросы
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-5">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">GTA RP Test System</h1>
              <p className="text-zinc-400 mt-1">
                Вопрос {currentQuestion + 1} из {questionsToShow.length}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={startExam}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-bold"
              >
                Тест 45
              </button>

              <button
                onClick={startAllQuestions}
                className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-xl font-bold"
              >
                Все вопросы
              </button>

              <button
                onClick={startMistakes}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-bold"
              >
                Ошибки ({mistakes.length})
              </button>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8">
          <div className="mb-8">
            <div className="text-sm text-zinc-500 mb-2">
              Режим: {
                mode === 'exam'
                  ? 'Тест 45 вопросов'
                  : mode === 'all'
                  ? 'Все вопросы'
                  : 'Работа над ошибками'
              }
            </div>

            <h2 className="text-3xl font-bold leading-relaxed">
              {question.question}
            </h2>
          </div>

          <div className="grid gap-4">
            {question.answers.map((answer, index) => {
              const isCorrect = index === question.correct;
              const isSelected = index === selectedAnswer;

              let classes = 'border border-zinc-700 hover:border-zinc-500 bg-zinc-800';

              if (selectedAnswer !== null) {
                if (isCorrect) {
                  classes = 'border-green-500 bg-green-500/20';
                }

                if (isSelected && !isCorrect) {
                  classes = 'border-red-500 bg-red-500/20';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`text-left p-5 rounded-2xl transition-all duration-200 ${classes}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>

                    <div className="text-lg">{answer}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div className="text-zinc-400">
              Правильных ответов: {correctAnswers}
            </div>

            <button
              onClick={nextQuestion}
              disabled={selectedAnswer === null}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold text-lg"
            >
              Следующий вопрос
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
