import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import TextArea from "../../../components/TextArea.jsx";
import PrimaryButton from "../../../components/PrimaryButton.jsx";

/**
 * Die Komponente stellt ein Modal zum Erstellen einer Multiple-Choice-Frage bereit.
 * Ermöglicht das Erstellen der Frage und Antworten und die Auswahl der korrekten Antwort.
 *
 * @component
 * @param {boolean} isOpen Gibt an, ob das Modal geöffnet oder geschlossen.
 * @param {Function} closeModal Die Funktion, welche zum Schließen des Modals aufgerufen wird.
 * @param {Function} saveNewHandler Die Funktion, welche beim Klick auf den Hauptbutton aufgerufen wird.
 * @returns {JSX.Element} Die CreateMultipleChoiceModal Komponente.
 */
function CreateMultipleChoiceModal({ isOpen, closeModal, saveNewHandler }) {
  const [newMultipleChoiceQuiz, setNewMultipleChoiceQuiz] = useState({
    question: null,
    answers: [
      {
        text: null,
        correct: false,
      },
      {
        text: null,
        correct: false,
      },
    ],
  });

  function handleClose() {
    setNewMultipleChoiceQuiz({
      question: null,
      answers: [
        {
          text: null,
          correct: false,
        },
        {
          text: null,
          correct: false,
        },
      ],
    });
    closeModal();
  }

  /**
   * Bearbeitet Frage.
   * @param {string} newText neuer Text für die Frage
   */
  function updateQuestion(newText) {
    // aktualisiere Fragen, kopiere existierende Antworten
    setNewMultipleChoiceQuiz((prevState) => {
      return {
        quizId: prevState.quizId,
        question: newText,
        answers: prevState.answers,
      };
    });
  }

  /**
   * Aktualisiert Antworttext.
   * @param {number} index Index der Antwort im answers array vom quiz Objekt
   * @param {string} newText neuer Antworttext
   */
  function updateAnswer(index, newText) {
    setNewMultipleChoiceQuiz((prevState) => {
      // speichere aktualisierte Antworten
      // verwende structuredClone da Array aus Objekten
      const updatedAnswers = structuredClone(prevState.answers);
      updatedAnswers[index].text = newText;

      return {
        quizId: prevState.quizId,
        question: prevState.question,
        answers: updatedAnswers,
      };
    });
  }

  /**
   * Speichert die Auswahl der richtigen Antwort.
   * @param {number} index
   */
  function updateCorrectAnswer(index) {
    setNewMultipleChoiceQuiz((prevState) => {
      const updatedAnswers = structuredClone(prevState.answers);

      // setzte alle auf false, außer die, die neu ausgewählt wurde
      updatedAnswers.forEach((answer, answerIndex) => {
        if (index === answerIndex) {
          answer.correct = true;
        } else {
          answer.correct = false;
        }
      });

      return {
        quizId: prevState.quizId,
        question: prevState.question,
        answers: updatedAnswers,
      };
    });
  }

  /**
   * Fügt einem Quiz eine neue Antwortmöglichkeit hinzu.
   */
  function addNewAnswer() {
    setNewMultipleChoiceQuiz((prevState) => {
      return {
        ...prevState,
        answers: [
            ...prevState.answers,
            {
              text: null,
              correct: false,
            }
          ]
      };
    });
  }

  /**
   * Speichert Quiz und setzt Modal zurück.
   */
  function onClickSave() {
    saveNewHandler(newMultipleChoiceQuiz);
    handleClose();
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
                <span className="text-sm pe-1 pb-0.5">Discard</span>
                <FontAwesomeIcon
                icon={faXmark}
                />
            </button>

            <div className="mb-5">
              <TextArea
                id="new-question"
                label="Question"
                changeHandler={updateQuestion}
              />
            </div>
            {newMultipleChoiceQuiz.answers.map((answer, index) => (
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
                  key={index}
                  id={"new-answer" + index}
                  label={"Answer " + (index + 1)}
                  changeHandler={(newText) => updateAnswer(index, newText)}
                />
              </div>
            ))}

            {newMultipleChoiceQuiz.answers.length < 4 && (
              <button
                onClick={addNewAnswer}
                className="border border-black p-1 rounded mt-3 ms-7"
              >
                <FontAwesomeIcon icon={faCirclePlus} className="me-2" />
                {newMultipleChoiceQuiz.answers.length + 1}. answer
              </button>
            )}

            <div className="absolute left-0 bottom-5 text-center w-full">
              <PrimaryButton
                text="Save"
                clickHandler={onClickSave}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CreateMultipleChoiceModal;