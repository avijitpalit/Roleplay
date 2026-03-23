import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(cors());

const MONGODB_URI = 'mongodb+srv://avijitpalit3:iG8Bm9RapErx5cmJ@cluster0.1p85c.mongodb.net/?appName=Cluster0';
const client = new MongoClient(MONGODB_URI);

app.get('/api/getData', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('roleplay');
    const collection = db.collection('roleplay');
    
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
});

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});