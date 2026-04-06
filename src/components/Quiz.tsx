import React, { useState } from 'react'
import './Quiz.css'
import QuizCore from '../core/QuizCore';

// Initialize QuizCore once outside component to persist across renders
const quizCore = new QuizCore();

interface QuizState {
  currentQuestionIndex: number
  selectedAnswer: string | null
  score: number
  quizFinished: boolean
}

const Quiz: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswer: null,
    score: 0,
    quizFinished: false,
  });

  const handleOptionSelect = (option: string): void => {
    setState((prevState) => ({ ...prevState, selectedAnswer: option }));
  }

  const handleButtonClick = (): void => {
    const { selectedAnswer } = state;

    // Record the answer in QuizCore
    if (selectedAnswer !== null) {
      quizCore.answerQuestion(selectedAnswer);
    }

    if (quizCore.hasNextQuestion()) {
      // Move to the next question
      quizCore.nextQuestion();
      setState((prevState) => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        selectedAnswer: null,
      }));
    } else {
      // Quiz is finished - show final score
      setState((prevState) => ({
        ...prevState,
        quizFinished: true,
        score: quizCore.getScore(),
      }));
    }
  }

  const { selectedAnswer, quizFinished, score } = state;
  const currentQuestion = quizCore.getCurrentQuestion();
  const totalQuestions = quizCore.getTotalQuestions();
  const isLastQuestion = !quizCore.hasNextQuestion();

  if (quizFinished) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {score} out of {totalQuestions}</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div>
        <h2>No questions available.</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>Quiz Question:</h2>
      <p>{currentQuestion.question}</p>

      <h3>Answer Options:</h3>
      <ul>
        {currentQuestion.options.map((option) => (
          <li
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={selectedAnswer === option ? 'selected' : ''}
          >
            {option}
          </li>
        ))}
      </ul>

      <h3>Selected Answer:</h3>
      <p>{selectedAnswer ?? 'No answer selected'}</p>

      <button onClick={handleButtonClick}>
        {isLastQuestion ? 'Submit' : 'Next Question'}
      </button>
    </div>
  );
};

export default Quiz;
