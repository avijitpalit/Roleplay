import { MongoClient } from 'mongodb';

let cachedClient = null;

export async function connectDB() {
    if (cachedClient) {
        // console.log('Using cached connection');
    } else {
        // console.log('Creating new connection');
        // console.log('connection string: ', process.env.MONGODB_URI);
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        cachedClient = client;
    }

    const db = cachedClient.db('roleplay');
    const collection = db.collection('sessions');
    return collection;
}