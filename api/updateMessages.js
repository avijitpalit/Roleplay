import { ObjectId } from 'mongodb';
import { connectDB } from './db.js';

export default async function handler(req, res) {
    try {
        const collection = await connectDB();
        // const db = client.db('roleplay');
        const {sessionId, userReply, aiReply, lastVisualPrompt} = req.body;
        console.log(req.body);

        // const existingDoc = await db.collection('sessions').findOne({ _id: new ObjectId('69bfc0d4dd4ee0dffa4e8a13') });
        // console.log('Existing document:', existingDoc);

        const result = await collection.updateOne(
            {_id: new ObjectId(sessionId)},
            {
                $push: {
                    messages: {
                        $each: [
                            {role: 'User', text: userReply},
                            {role: 'AI', text: aiReply}
                        ]
                    }
                },
                $set: {
                    lastVisualPrompt: lastVisualPrompt
                }
            }
        );
        console.log(result);

        res.status(200).json({success: true});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}