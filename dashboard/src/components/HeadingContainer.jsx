/**
 * Die Komponente stellt einen Wrapper für die Headerzeile einer Seite zur Verfügung.
 * Kann verwendet werden damit die Headerzeile standardisiertes Styling verwendet.
 *
 * @component
 * @param {ReactNode} children Der Inhalt der Wrapperkomponente.
 * @returns {JSX.Element} Die HeadingContainer Komponente.
 */
function HeadingContainer({ children }) {
  return (
    <div className="flex flex-col md:flex-row items-center md:justify-between mx-auto mb-5 md:mb-7">
      {children}
    </div>
  );
}

export default HeadingContainer;