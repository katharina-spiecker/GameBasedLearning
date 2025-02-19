import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import TextArea from "../../../components/TextArea.jsx";
import PrimaryButton from "../../../components/PrimaryButton.jsx";

/**
 * The component provides a modal for creating a multiple-choice question.
 * It allows creating the question and answers and selecting the correct answer.
 *
 * @component
 * @param {boolean} isOpen Indicates whether the modal is open or closed.
 * @param {Function} closeModal The function that is called to close the modal.
 * @param {Function} saveNewHandler The function that is called when clicking the main button.
 * @returns {JSX.Element} The CreateMultipleChoiceModal component.
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
   * Edits question.
   * @param {string} newText New question text
   */
  function updateQuestion(newText) {
    setNewMultipleChoiceQuiz((prevState) => {
      return {
        quizId: prevState.quizId,
        question: newText,
        answers: prevState.answers,
      };
    });
  }

  /**
   * Updates answer text.
   * @param {number} index Index of answer in answers array of quiz object
   * @param {string} newText new answer text
   */
  function updateAnswer(index, newText) {
    setNewMultipleChoiceQuiz((prevState) => {
      // saves updated answers in state
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
   * Saves correct answer selection.
   * @param {number} index
   */
  function updateCorrectAnswer(index) {
    setNewMultipleChoiceQuiz((prevState) => {
      const updatedAnswers = structuredClone(prevState.answers);

      // set all to false besides selected one
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
   * Adds a new answer to a quiz
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
   * Saves quiz and resets modal.
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
                <span className="text-sm pe-1 pb-0.5">Eingaben verwerfen</span>
                <FontAwesomeIcon
                icon={faXmark}
                />
            </button>

            <div className="mb-5">
              <TextArea
                id="new-question"
                label="Frage"
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
                  label={"Antwort " + (index + 1)}
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
                {newMultipleChoiceQuiz.answers.length + 1}. Antwort hinzufügen
              </button>
            )}

            <div className="absolute left-0 bottom-5 text-center w-full">
              <PrimaryButton
                text="Speichern"
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