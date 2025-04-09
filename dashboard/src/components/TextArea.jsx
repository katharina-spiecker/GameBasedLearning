/**
 * This component provides a text input field.
 *
 * @component TextArea
 * @param {string} label The short description of the expected input.
 * @param {number} id The ID that links the textarea element to the label.
 * @param {string} defaultValue The pre-filled text content of the textarea element.
 * @param {Function} changeHandler The function that is called when the change event occurs.
 * @returns {JSX.Element} The TextArea component.
 */
function TextArea({ label, id, defaultValue, changeHandler }) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block pb-1 font-semibold">
        {label}
      </label>
      <textarea
        defaultValue={defaultValue}
        id={id}
        onChange={(event) => changeHandler(event.target.value)}
        className="block w-full rounded-md p-1 text-gray-900 mb-2 border border-slate-300"
      />
    </div>
  );
}

export default TextArea;