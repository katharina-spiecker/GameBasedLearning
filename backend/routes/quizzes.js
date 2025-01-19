import { Router } from "express";
import { v4 as uuid } from "uuid";
import { ObjectId } from 'mongodb';
import { connectDB } from "../db.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const database = await connectDB();
    const data = await database.collection('quizzes').find({}).toArray();
    const transformedData = data.map(quiz => { 
      return {
        topic: quiz.topic,
        _id: quiz._id,
        gameCode: quiz.gameCode,
        quizSize: quiz.questions.length
      }
    });
    res.status(200).json(transformedData);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const database = await connectDB();
    const data = await database.collection('quizzes').findOne({_id: new ObjectId(req.params.id)});
    if (data === null) {
      res.status(404).send("quiz not found");
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  if (!req.body.topic) {
    return res.status(400).send("Invalid request data");
  }
   
  try {
    const database = await connectDB();
    const data = await database.collection('quizzes').insertOne({
      topic: req.body.topic,
      gameCode: uuid(),
      questions: []
    });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {

  if (!req.body.topic) {
    return res.status(400).send("Invalid request data");
  }

  try {
    const database = await connectDB();
    const data = await database.collection('quizzes').updateOne({_id: new ObjectId(req.params.id)}, { '$set': { topic: req.body.topic}});
    if (data.matchedCount === 0) {
      res.status(404).send("quiz not found");
    } else {
      res.status(200).send("quiz successfully updated");
    }
  } catch (error) {
    next(error);
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const database = await connectDB();
    const data = await database.collection('quizzes').deleteOne({_id: new ObjectId(req.params.id)});
    if (data.deletedCount === 0) {
      res.status(404).send("quiz not found");
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
})

// endpunkt for game
router.get("/game/:gameCode", async (req, res, next) => {
  try {
    const database = await connectDB();
    const data = await database.collection('quizzes').findOne({gameCode: req.params.gameCode});
    if (data === null) {
      res.status(404).send("quiz not found");
    } else {
      res.status(200).json({quiz: data.questions, topic: data.topic});
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:quizId/questions/:questionId", async (req, res, next) => {
  try {
    const database = await connectDB();
    // nicht deleteOne sondern updateOne, da delete Operation nur bezogen auf ganze Dokumente möglich ist
    const data = await database.collection('quizzes').updateOne({_id: new ObjectId(req.params.quizId)}, {
      "$pull": {
        questions: {
          _id: new ObjectId(req.params.questionId)
        }
      }
    });
    
    if (data.matchedCount === 0) {
      res.status(404).send("question not found");
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
})

router.put("/:quizId/questions/:questionId", async (req, res, next) => {
  const { question, answers } = req.body;

  if (!question || !answers) {
    return res.status(400).send("Invalid request data");
  }

  // Array aus Antwort-Objekten, die einen Text haben
  const filteredAnswers = answers.filter(answer => answer.text);

  if (filteredAnswers.length === 0) {
    return res.status(400).send("Invalid request data");
  }

  try {
    const database = await connectDB();
    const data = await database.collection('quizzes').updateOne({
      _id: new ObjectId(req.params.quizId),
      "questions._id": new ObjectId(req.params.questionId)
      }, { 
        $set: { 'questions.$.question': question, 'questions.$.answers': filteredAnswers }
      });
    
    if (data.matchedCount === 0) {
      res.status(404).send("question not found");
    } else {
      res.status(200).send("question sucessfully updated");
    }
  } catch (error) {
    next(error);
  }
})

router.post("/:quizId/questions", async (req, res, next) => {
  const { question, answers } = req.body;

  if (!question || !answers ) {
    return res.status(400).send("Invalid request data");
  }

  // Array aus Antwort-Objekten, die einen Text haben
  const filteredAnswers = answers.filter(answer => answer.text);

  if (filteredAnswers.length === 0) {
    return res.status(400).send("Invalid request data");
  }

  try {
    const database = await connectDB();

    const newQuestion = {
      _id: new ObjectId(),
      question: question,
      answers: filteredAnswers
    };

    const data = await database.collection('quizzes').updateOne(
      {_id: new ObjectId(req.params.quizId)}, 
      { $push: { questions: newQuestion}}
    );
    
    if (data.matchedCount === 0) {
      res.status(404).send("quiz not found");
    } else {
      res.status(201).json(newQuestion);
    }
  } catch (error) {
    next(error);
  }
})

export default router;