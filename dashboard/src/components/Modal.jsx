import PrimaryButton from "./PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";

/**
 *
 * Die Komponente stellt ein Modal mit grundlegenden Funktionen (öffnen und schließen) bereit.
 *
 * @component
 * @param {boolean} isOpen Gibt an, ob das Modal geöffnet oder geschlossen ist.
 * @param {Function} closeModal Die Funktion, welche zum Schließen des Modals aufgerufen wird.
 * @param {string} saveText Der Text welcher in dem Hauptbutton erscheint.
 * @param {ReactNode} children Der Inhalt des Modals.
 * @param {Function} saveHandler Die Funktion, welche beim Klick auf den Hauptbutton aufgerufen wird.
 * @returns {JSX.Element} Die Modal Komponente.
 */
function Modal({ isOpen, closeModal, saveText, children, saveHandler }) {
  return (
    <>
      {isOpen && (
        <>
          <div
            className="opacity-50 bg-slate-900 fixed top-0 bottom-0 left-0 right-0"
          ></div>

          <div className="bg-white shadow shadow-slate-300 rounded-2xl p-4 mt-5 z-1 min-w-80 fixed top-0 mx-4 mx-auto left-1/2 -translate-x-1/2 md:w-96 pb-20">
            <button className="absolute top-4 right-4 flex items-center hover:cursor-pointer" onClick={closeModal}>
                <span className="text-sm pe-1 pb-0.5">Discard</span>
                <FontAwesomeIcon
                icon={faXmark}
                />
            </button>

            {children}

            <div className="absolute left-0 bottom-5 text-center w-full">
              <PrimaryButton text={saveText} clickHandler={saveHandler} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Modal;
