import { useState, useEffect } from "react";
import QuizInfoCard from "./components/QuizInfoCard.jsx";
import PrimaryButton from "../../components/PrimaryButton.jsx";
import Modal from "../../components/Modal.jsx";
import TextArea from "../../components/TextArea.jsx";
import HeadingContainer from "../../components/HeadingContainer.jsx";

/**
 * Die Komponente generiert die Übersichtsseite für alle Quizze.
 *
 * @component
 * @returns {JSX.Element} Die AllQuizzesView Komponente.
 */
function AllQuizzesView() {
  const [quizzes, setQuizzes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/quizzes")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch quizzes");
        }
      })
      .then((data) => {
        setQuizzes(data);
      })
      .catch((error) => console.error(error.message));
  }, []);

  /**
   * Fügt dem quizzes array ein neues quiz Objekt hinzu.
   */
  function saveNewQuiz() {
    fetch("http://localhost:3000/api/quizzes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({topic: newTopicName}),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }
        return res.json();
      })
      .then((data) => {
        // speichere die id von mongodb
        setQuizzes((prevQuizzes) => {
          return [...prevQuizzes, {
            _id: data.insertedId,
            topic: newTopicName,
            gameCode: data.gameCode,
            quizSize: 0
          }];
        });
      })
      .finally(() => {
        resetModal(); // if worked or not: reset the modal
      });
  }

  function resetModal() {
    setModalIsOpen(false);
    setNewTopicName("");
  }

  /**
   * Löscht ein topic Objekt vom topic state
   * @param {number} index
   */
  function deleteHandler(index) {
    // delete in frontend
    setQuizzes((prevState) => {
      const updatedState = [...prevState];
      updatedState.splice(index, 1);
      return updatedState;
    });

    fetch(`http://localhost:3000/api/quizzes/${quizzes[index]._id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  return (
    <>
      <HeadingContainer>
        <span className="inline-block md:w-1/3">
          {quizzes.length} {quizzes.length === 1 ? "Quiz" : "Quizze"}
        </span>
        <h1 className="md:text-center text-2xl">Alle Quizze</h1>
        <div className="mt-2 md:mt-0 md:w-1/3 md:text-end">
          <PrimaryButton
            text="Neues Quizthema"
            clickHandler={() => setModalIsOpen(true)}
          />
        </div>
      </HeadingContainer>

      <div className="grid grid-cold-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {quizzes.map((quiz, index) => (
          <QuizInfoCard
            key={quiz._id}
            quiz={quiz}
            deleteHandler={() => deleteHandler(index)}
          />
        ))}
      </div>
      <Modal
        closeModal={resetModal}
        isOpen={modalIsOpen}
        saveText="Speichern"
        saveHandler={saveNewQuiz}
      >
        <TextArea
          label="Neues Thema"
          id="new-topic"
          changeHandler={(newText) => setNewTopicName(newText)}
        />
      </Modal>
    </>
  );
}

export default AllQuizzesView;
