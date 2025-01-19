db.createCollection("quizzes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ['_id', 'topic', 'gameCode', 'questions'],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        topic: {
          bsonType: "string"
        },
        gameCode: {
          bsonType: "string"
        },
        questions: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['_id', 'question', 'answers'],
            properties: {
              _id: {
                bsonType: "objectId"
              },
              question: {
                bsonType: "string"
              },
              answers: {
                bsonType: 'array',
                required: ['text', 'correct'],
                items: {
                  bsonType: 'object',
                  properties: {
                    text: {
                      bsonType: "string"
                    },
                    correct: {
                      bsonType: "bool"
                    }
                  }
                }
              }
            }
          }
        }
      },
      additionalProperties: false
    }
  }
})