import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import AllQuizzesView from "./views/AllQuizzesView/AllQuizzesView.jsx";
import QuizDetailView from "./views/QuizDetailView/QuizDetailView.jsx";
import Layout from "./Layout.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AllQuizzesView />} />
          <Route path="quiz/:id" element={<QuizDetailView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}