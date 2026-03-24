import { connectDB } from './db.js';

export default async function handler(req, res) {
    try {
        console.log('load chats start');
        const collection = await connectDB(); console.log('after connect db');
        const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
        // console.log(docs);

        res.status(200).json({success: true, chats: docs});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}