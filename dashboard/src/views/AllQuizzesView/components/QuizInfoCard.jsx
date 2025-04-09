import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/**
 * This component displays an overview of a quiz.
 * It shows the quiz topic, the number of questions in the quiz, a delete icon, and an edit icon.
 * The edit icon leads to the quiz detail page.
 *
 * @component
 * @param {Objekt} quiz The quiz data, including topic, _id, quizSize, and gameCode.
 * @param {Function} deleteHandler The function that deletes the quiz, including all associated multiple-choice questions.
 * @returns {JSX.Element} The QuizInfoCard component.
 */
function QuizInfoCard({ quiz, deleteHandler }) {
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();

  async function copyGameCode() {
    try {
        await navigator.clipboard.writeText(quiz.gameCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 500); // nach 0.5 Sekunden wieder Anfangsicon anzeigen
      } catch (error) {
        console.error('Failed to copy', error.message);
      }
  }

  return (
    <div className="bg-white shadow shadow-slate-300 p-4 relative rounded-2xl h-40 flex flex-col items-center justify-center">
     
    <div className="font-medium">{quiz.topic}</div>
    <button onClick={copyGameCode} className="bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-md mt-4 text-sm">
        <span className="me-1">Copy gamecode</span>
        <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} />
    </button>
   
      <span className="absolute topic-card__number text-gray-500">
        {quiz.quizSize} {quiz.quizSize === 1 ? "Question" : "Questions"}
      </span>
      <button onClick={() => navigate(`/quiz/${quiz._id}`)} className="card__edit-icon absolute hover:cursor-pointer text-sm">
        <span className="me-1">Edit</span>
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>
      
      <FontAwesomeIcon
        icon={faTrashCan}
        className="card__delete-icon text-red-600 absolute hover:cursor-pointer"
        onClick={deleteHandler}
      />
    </div>
  );
}

export default QuizInfoCard;
