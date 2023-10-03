import { createServer } from 'http';
import { Server } from 'socket.io';
import clientPromise from '../../../lib/mongodb';

// Create a single instance of Socket.IO server
const httpServer = createServer();
const io = new Server(httpServer);

httpServer.listen(4030, () => {
  console.log('Socket.IO server listening on port 4030');
});

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const { room, username, message } = req.body;

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Save message to MongoDB
    const chatCollection = db.collection('chat');
    await chatCollection.insertOne({ room, username, message });

    // Broadcast message to everyone in the room
    io.to(room).emit('chat', { room, username, message });

    res.status(200).json({ success: true });
  } else if (method === 'GET') {
    const { room } = req.query;

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const chatCollection = db.collection('chat');
    const chatMessages = await chatCollection.find({ room }).toArray();

    res.status(200).json(chatMessages);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
