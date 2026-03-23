import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db('roleplay');
    const collection = db.collection('roleplay');
    
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
  } finally {
    // await client.close();
  }
}