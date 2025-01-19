/**
 * Diese Komponente stellt ein Text Eingabefeld bereit.
 *
 * @component TextArea
 * @param {string} label Die Kurzbeschreibung des erwarteten Inputs.
 * @param {number} id Die id, welche das textarea Element und das Label verbindet.
 * @param {string} defaultValue Der vorausgefüllte Textinhalt des textarea Element.
 * @param {Function} changeHandler Die Funktion, welche beim Auftreten des change Events aufgerufen wird.
 * @returns {JSX.Element} TextArea Komponente
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