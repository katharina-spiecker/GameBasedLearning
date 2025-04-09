import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import MultipleChoiceCard from "./components/MultipleChoiceCard.jsx";
import EditMultipleChoiceModal from "./components/EditMultipleChoiceModal.jsx";
import CreateMultipleChoiceModal from "./components/CreateMultipleChoiceModal.jsx";
import PrimaryButton from "../../components/PrimaryButton.jsx";
import HeadingContainer from "../../components/HeadingContainer.jsx";

/**
 * The component generates the quiz detail page, which displays all multiple-choice questions for a specific quiz.
 *
 * @component
 * @returns {JSX.Element} The QuizDetailView component.
 */
function QuizDetailView() {
  const { id } = useParams();

  const [topicName, setTopicName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [editNameActive, setEditNameActive] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/api/quizzes/${id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch topics");
        }
      })
      .then((data) => {
        setTopicName(data.topic);
        setQuestions(data.questions);
      })
      .catch((error) => console.error(error.message));
  }, []);

  function openModal(mode = "", index) {
    if (mode === "edit") {
      setQuestionIndex(index);
    }
    setMode(mode);
    setModalIsOpen(true);
  }

  function resetModal() {
    setModalIsOpen(false);
    setMode(null);
    setQuestionIndex(null);
  }

  function saveNewHandler(newMultipleChoiceQuiz) {
    resetModal();

    fetch(`http://localhost:3000/api/quizzes/${id}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: newMultipleChoiceQuiz.question,
        answers: newMultipleChoiceQuiz.answers,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }
        return res.json();
      })
      .then((data) => {
        setQuestions((prevState) => {
          return [...prevState, data];
        });
      })
      .catch((err) => console.error(err));
  }

  function deleteQuizHandler(index) {
    const questionId = questions[index]._id;

    setQuestions((prevState) => {
      const updatedQuestions = [...prevState];
      updatedQuestions.splice(index, 1);

      return updatedQuestions;
    });

    fetch(`http://localhost:3000/api/quizzes/${id}/questions/${questionId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("deletion failed");
        }
      })
      .catch((error) => console.error(error.message));
  }

  function saveEditHandler(editQuizContent) {
    fetch(
      `http://localhost:3000/api/quizzes/${id}/questions/${editQuizContent._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: editQuizContent.question,
          answers: editQuizContent.answers,
        }),
      }
    )
      .then((res) => {
        if (res.ok) {
          setQuestions((prevState) => {
            const updatedQuestions = [...prevState];
            updatedQuestions[questionIndex] = editQuizContent;
            return updatedQuestions;
          });
          resetModal();
        } else {
          throw new Error("updating question failed");
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  function editNameHandler(event) {
    const newTopicName = event.target.value;

    fetch(`http://localhost:3000/api/quizzes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: newTopicName,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setTopicName(newTopicName);
          setEditNameActive(false);
        } else {
          throw new Error("updating topic failed");
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  return (
    <>
      <Link to="/" className="block mb-4">
        <FontAwesomeIcon icon={faArrowLeft} className="pe-1"/>
        All quizzes
      </Link>
      <HeadingContainer>
        <span className="inline-block md:w-1/3">
          {questions.length} {questions.length === 1 ? "Question" : "Questions"}
        </span>
        <div className="relative">
          {editNameActive ? (
            <input type="text" onBlur={editNameHandler} />
          ) : (
            <h1 className="md:text-center text-2xl">
              {topicName}
            </h1>
          )}
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="topic-name-edit__icon absolute hover:cursor-pointer"
            onClick={() => setEditNameActive(true)}
          />
        </div>

        <div className="mt-2 md:mt-0 md:w-1/3 md:text-end">
          <PrimaryButton
            text="New question"
            clickHandler={() => openModal("create")}
          />
        </div>
      </HeadingContainer>

      <section>
        {questions.map((item, index) => (
          <MultipleChoiceCard
            key={index}
            content={item}
            openModal={() => openModal("edit", index)}
            deleteQuizHandler={() => deleteQuizHandler(index)}
          />
        ))}
      </section>

      {mode === "edit" ? (
        <EditMultipleChoiceModal
          initialContent={questions[questionIndex]}
          isOpen={modalIsOpen}
          closeModal={resetModal}
          saveEditHandler={saveEditHandler}
        />
      ) : (
        <CreateMultipleChoiceModal
          isOpen={modalIsOpen}
          closeModal={resetModal}
          saveNewHandler={saveNewHandler}
        />
      )}
    </>
  );
}

export default QuizDetailView;