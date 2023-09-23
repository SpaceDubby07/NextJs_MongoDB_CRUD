import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('nextjs-db');
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
    case 'GET':
      try {
        const allPosts = await db.collection('posts').find({}).toArray();
        res.status(200).json({ status: 200, data: allPosts });
      } catch (error) {
        res.status(500).json({ error: 'Error fetching posts' });
      }
      break;
    case 'DELETE':
      // Handle DELETE request to delete a specific post by ID
      const postId = req.query.id; // Assuming you pass the post ID as a query parameter
      const postObjectId = new ObjectId(postId);

      const deleteResult = await db
        .collection('posts')
        .deleteOne({ _id: postObjectId });

      if (deleteResult.deletedCount === 1) {
        res.status(204).end(); // Successfully deleted, return 204 No Content
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
      break;

    default:
      res.status(405).end(); // Method Not Allowed
  }
}
