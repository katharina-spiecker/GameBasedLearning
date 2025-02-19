/**
 * The component provides a wrapper for the header row of a page.
 * It ensures that the header row uses standardized styling.
 *
 * @component
 * @param {ReactNode} children The content of the wrapper component.
 * @returns {JSX.Element} The HeadingContainer component.
 */
function HeadingContainer({ children }) {
  return (
    <div className="flex flex-col md:flex-row items-center md:justify-between mx-auto mb-5 md:mb-7">
      {children}
    </div>
  );
}

export default HeadingContainer;