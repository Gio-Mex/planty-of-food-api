import { MongoClient } from "mongodb";
import mockData from "./mockData.json" assert { type: "json" };
import { config } from "dotenv";

config();

//Create mock database
async function createDB() {
  const dbUrl = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  const client = new MongoClient(dbUrl);

  try {
    await client.connect();
    await newDB(client, "PoFDB");
    await newCollection(client, "PoFDB", "products");
    await newCollection(client, "PoFDB", "users");
    await newCollection(client, "PoFDB", "orders");
    await newDocs(client, "PoFDB", "products");
    await newDocs(client, "PoFDB", "users");
    await newDocs(client, "PoFDB", "orders");
  } finally {
    await client.close();
  }
}

createDB().catch(console.error);

//Functions
async function newDB(client, DBname) {
  await client.db(DBname);
  console.log(`${DBname} created`);
}

async function newCollection(client, DBname, colName) {
  await client.db(DBname).createCollection(colName);
  console.log(`${colName} collection created`);
}

async function newDocs(client, DBname, colName) {
  const result = await client
    .db(DBname)
    .collection(colName)
    .insertMany(mockData[colName]);
  console.log(
    `${result.insertedCount} new ${colName.slice(0, -1)} document(s) created`
  );
}
