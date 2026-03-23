import { connectDB } from './db.js';

export default async function handler(req, res) {
    try {
        const collection = await connectDB();
        const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
        // console.log(docs);

        res.status(200).json({success: true, chats: docs});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}