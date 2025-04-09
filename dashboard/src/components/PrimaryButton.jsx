/**
 * The component provides a button with standardized styling.
 *
 * @component
 * @param {string} text The button text.
 * @param {Function} clickHandler The event handler function for the onClick event.
 * @returns {JSX.Element} The PrimaryButton component.
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