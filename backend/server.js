import express from 'express';
import cors from 'cors';
import quizzesRouter from "./routes/quizzes.js";

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

app.use(express.json());
app.use(cors());

app.use("/api/quizzes", quizzesRouter);

// Globale Fehlerbehandlungsmiddleware
app.use((err, req, res, next) => {
  // mongoDB Schema Validierung fehlgeschlagen (err.code ist 121): setze 400 Fehler da Fehler bei Anfragedaten
  if (err.name === "MongoServerError" && err.code === 121) {
    res.status(400).send("Invalid request data");
  } else {
    res.status(err.status || 500).send(err.message || "Internal Server Error");
  }
});

// Falls keine passende Route gefunden, antworte mit 404
app.use((req, res) => {
  res.status(404).send("Not found");
})