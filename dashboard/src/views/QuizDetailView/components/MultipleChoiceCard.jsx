import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

/**
 * Die Komponente erzeugt eine Box, welche eine Frage, die Antwortmöglichkeiten,
 * ein Button zum Bearbeiten und ein Button zum Löschen darstellt.
 *
 * @component
 * @param {Object} content Das Objekte, welches die Multiple-Choice-Frage repräsentiert.
 * @param {Function} openModal Die Funktion, welche das Modal zum Bearbeiten der Multiple-Choice-Frage öffnet.
 * @returns {JSX.Element} Die MultipleChoiceCard Komponente.
 */
function MultipleChoiceCard({ content, openModal, deleteQuizHandler }) {
  return (
    <div className="bg-white shadow shadow-slate-300 p-4 relative rounded-2xl mb-7">
      <div className="font-bold mb-2 ms-5">{content.question}</div>
      {content.answers.map((answer, index) => (
        <div className="flex mb-1" key={index}>
          <span className="question-checkmark w-5">
            {answer.correct && (
              <FontAwesomeIcon className="text-green-700" icon={faCheck} />
            )}
          </span>
          <span>{answer.text}</span>
        </div>
      ))}
      <FontAwesomeIcon
        icon={faPenToSquare}
        className="card__edit-icon absolute hover:cursor-pointer"
        onClick={openModal}
      />

      <FontAwesomeIcon
        icon={faTrashCan}
        className="card__delete-icon text-red-600 absolute hover:cursor-pointer"
        onClick={deleteQuizHandler}
      />
    </div>
  );
}

export default MultipleChoiceCard;