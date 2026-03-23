import { connectDB } from './db.js';

export default async function handler(req, res) {
    try {
        const collection = await connectDB();
        // const db = client.db('roleplay');
        const result = await collection.insertOne({
            ...req.body,
            messages: [],
            createdAt: new Date()
        });

        res.status(200).json({id: result.insertedId});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}