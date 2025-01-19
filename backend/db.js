import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(process.env.DB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectDB() {
  // falls noch nicht verbunden: verbinde
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  
  return client.db(process.env.DB_NAME)
};

process.on('SIGINT', async () => {
  await client.close();
  process.exit(0); // beende die Ausführung vom Node Script
});