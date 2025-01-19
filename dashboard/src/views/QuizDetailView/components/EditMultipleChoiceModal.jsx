import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import TextArea from "../../../components/TextArea.jsx";
import PrimaryButton from "../../../components/PrimaryButton.jsx";

/**
 * Die Komponente stellt ein Modal zum Bearbeiten einer existierenden Multiple-Choice-Frage bereit.
 * Ermöglicht das Bearbeiten der Frage und Antworten, das Löschen oder Hinzufügen von Antwortmöglichkeiten
 * und die Auswahl der korrekten Antwort.
 *
 * @component
 * @param {boolean} isOpen Gibt an, ob das Modal geöffnet oder geschlossen ist.
 * @param {Function} closeModal Die Funktion, welche zum Schließen des Modals aufgerufen wird.
 * @param {Function} saveEditHandler Die Funktion, welche zum Speichern der Änderungen aufgerufen wird.
 * @param {Objekt} initialContent Enthält den Zustand einer Multiple-Choice-Frage vor dem Bearbeiten.
 * @returns {JSX.Element} Die EditMultipleChoiceModal Komponente.
 */
function EditMultipleChoiceModal({isOpen, closeModal, saveEditHandler, initialContent}) {
  const [editQuizContent, setEditQuizContent] = useState(initialContent);

  function handleClose() {
    setEditQuizContent(null);
    closeModal();
  }

  /**
   * Bearbeitet existierende Fragen und Antworten.
   * @param {string} newText neuer Text für die Frage
   */
  function updateQuestion(newText) {
    // update question, copy existing answers
    setEditQuizContent((prevState) => {
      return {
        _id: prevState._id,
        question: newText,
        answers: prevState.answers,
      };
    });
  }

  /**
   * Speichert die Auswahl der richtigen Antwort für bearbeitete Quizfragen.
   * @param {number} index
   */
  function updateCorrectAnswer(index) {
    setEditQuizContent((prevState) => {
      const updatedQuestion = structuredClone(prevState); // deep clone
      // setzte alle auf false, außer die, die neu ausgewählt wurde
      updatedQuestion.answers.forEach((answer, answerIndex) => {
        if (index === answerIndex) {
          answer.correct = true;
        } else {
          answer.correct = false;
        }
      });
      return updatedQuestion;
    });
  }

  /**
   * Speichert veränderten oder neu erstellten Antworttext
   * @param {number} index Index der Antwort im answers array von quiz Objekt
   * @param {string} newText neuer Antworttext
   */
  function updateAnswer(index, newText) {
    setEditQuizContent((prevState) => {
      const updatedQuestion = structuredClone(prevState);
      updatedQuestion.answers[index].text = newText;
      return updatedQuestion;
    });
  }

  /**
   * Fügt der Multiple-Choice-Frage eine neue Antwortmöglichkeit hinzu.
   */
  function addNewAnswer() {
    setEditQuizContent((prevState) => {
      return {
        ...prevState,
        answers: [
            ...prevState.answers,
            {
              text: null,
              correct: false,
            }
          ]
      }
    });
   }

   /**
   * Löscht eine Antwortmöglichkeit der Multiple-Choice-Frage.
   */
   function deleteAnswerHandler(deleteIndex) {
    console.log("deleteAnswerHandler called with index", deleteIndex)
    setEditQuizContent((prevState) => {
        return {
          ...prevState,
          answers: prevState.answers.filter((answer, index) => index !== deleteIndex)
        }
      });
   }

  return (
    <>
      {isOpen && (
        <>
          <div
            className="opacity-50 bg-slate-900 fixed top-0 bottom-0 left-0 right-0"
          ></div>

          <div className="bg-white shadow shadow-slate-300 rounded-2xl p-4 mt-5 z-1 min-w-80 min-h-80 fixed top-0 mx-4 mx-auto left-1/2 -translate-x-1/2 md:w-96 pb-20">
            <button className="absolute top-4 right-4 flex items-center hover:cursor-pointer" onClick={handleClose}>
                <span className="text-sm pe-1 pb-0.5">Eingaben verwerfen</span>
                <FontAwesomeIcon
                icon={faXmark}
                />
            </button>

            <div className="mb-5">
              <TextArea
                id="question"
                label="Frage"
                defaultValue={editQuizContent.question}
                changeHandler={updateQuestion}
              />
            </div>

            {editQuizContent.answers.map((answer, index) => (
              <div className="flex items-center" key={index}>
                <button
                  onClick={() => updateCorrectAnswer(index)}
                  className="shrink-0 rounded-full border w-6 h-6 flex items-center justify-center me-2 cursor-pointer"
                  disabled={answer.correct}
                >
                  <FontAwesomeIcon
                    className={
                      answer.correct ? "text-green-700" : "text-gray-200"
                    }
                    icon={faCheck}
                  />
                </button>
                <TextArea
                  id={"antwort-" + (index + 1)}
                  label={"Antwort " + (index + 1)}
                  defaultValue={answer.text}
                  changeHandler={(newText) => updateAnswer(index, newText)}
                />
                {
                    editQuizContent.answers.length > 2 &&
                    <FontAwesomeIcon
                    icon={faTrashCan}
                    className="text-red-600 hover:cursor-pointer ms-2"
                    onClick={() => deleteAnswerHandler(index)}
                    />
                }
                
              </div>
            ))}

            {editQuizContent.answers.length < 4 && (
                <button
                onClick={addNewAnswer}
                className="border border-black p-1 rounded mt-3 ms-7"
                >
                <FontAwesomeIcon icon={faCirclePlus} className="me-2" />
                {editQuizContent.answers.length + 1}. Antwort hinzufügen
                </button>
            )}

            <div className="absolute left-0 bottom-5 text-center w-full">
              <PrimaryButton
                text="Änderungen speichern"
                clickHandler={() => saveEditHandler(editQuizContent)}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default EditMultipleChoiceModal;
