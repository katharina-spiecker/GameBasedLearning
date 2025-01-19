import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/**
 * Diese Komponente zeigt ein Quiz an.
 * Es wird das Quizthema, die Anzahl an Fragen in dem Quiz, ein Löschen-Icon und ein Bearbeiten-Icon angezeigt.
 * Das Bearbeiten-Icon führt zu der Quiz-Detailseite.
 *
 * @component
 * @param {Objekt} quiz Die Quizdaten darunter topic, _id, quizSize und gameCode.
 * @param {Function} deleteHandler Die Funktion, welche das Quiz inklusive aller dazugehörigen Multiple-Choice-Fragen löscht.
 * @returns {JSX.Element} Die QuizInfoCard Komponente.
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
        <span className="me-1">Kopiere Spielcode</span>
        <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} />
    </button>
   
      <span className="absolute topic-card__number text-gray-500">
        {quiz.quizSize} {quiz.quizSize === 1 ? "Frage" : "Fragen"}
      </span>
      <button onClick={() => navigate(`/quiz/${quiz._id}`)} className="card__edit-icon absolute hover:cursor-pointer text-sm">
        <span className="me-1">Bearbeiten</span>
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
