// pages/api/posts/getById.js
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

// Get a single post by its ID
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('nextjs-db');

  if (req.method === 'GET') {
    try {
      // We will most likely be querying this id from our frontend, destructure the id from our query string
      const { id } = req.query;

      // If the objectId is NOT a valid id
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }

      // the id is an object
      const postObjectId = new ObjectId(id);
      // search the database collection posts for the matching _id
      const post = await db.collection('posts').findOne({ _id: postObjectId });

      // if there is no post, return an error
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Convert ObjectId to string for serialization
      const serializedPost = {
        ...post,
        _id: post._id.toString(),
      };

      // return success
      res.status(200).json(serializedPost);

      // otherwise, return an error
    } catch (error) {
      console.error('Error fetching post:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
