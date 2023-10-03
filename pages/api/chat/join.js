// pages/api/chat/join.js
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { room, username } = req.body;

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Optionally, you can check if the room exists or handle other validations.

    // Respond with a success message.
    res.status(200).json({ success: true });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
