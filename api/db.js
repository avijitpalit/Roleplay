import { MongoClient } from 'mongodb';

let cachedClient = null;

export async function connectDB() {
    if (cachedClient) {
        console.log('Using cached connection');
        return cachedClient;
    }

    console.log('Creating new connection');
    const client = new MongoClient(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 1
    });
    await client.connect();
    cachedClient = client;

    const db = client.db('roleplay');
    const collection = db.collection('sessions');
    return collection;
}