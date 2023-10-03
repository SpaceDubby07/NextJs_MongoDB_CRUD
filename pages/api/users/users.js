import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  switch (req.method) {
    case 'POST':
      const bodyObject = req.body;

      // Basic request body validation
      if (!bodyObject.username || !bodyObject.email || !bodyObject.message) {
        res
          .status(400)
          .json({ error: 'Missing required fields in the request body.' });
        return;
      }

      try {
        const myPost = await db.collection('posts').insertOne(bodyObject);

        if (myPost.acknowledged) {
          const insertedPost = {
            _id: myPost.insertedId.toString(), // Convert ObjectId to string
            ...bodyObject, // Include the original data
          };

          res.status(201).json(insertedPost);
        } else {
          res.status(500).json({ error: 'Failed to insert the post.' });
        }
      } catch (error) {
        console.error('Error inserting the post:', error);
        res.status(500).json({ error: 'Error inserting the post.' });
      }
      break;
    default:
      res.status(405).end(); // Method Not Allowed
  }
}
