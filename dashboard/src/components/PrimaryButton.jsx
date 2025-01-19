/**
 * Die Komponente stellt einen Button mit standardisiertem Styling bereit.
 *
 * @component
 * @param {string} text Der Button Text.
 * @param {Function} clickHandler Die Event Handler Funktion für das onClick Event.
 * @returns {JSX.Element} Die PrimaryButton Komponente.
 */
function PrimaryButton({ text, clickHandler }) {
  return (
    <button
      onClick={clickHandler}
      className="bg-yellow-300 hover:bg-yellow-400 py-2 px-5 rounded-full"
    >
      {text}
    </button>
  );
}

export default PrimaryButton;