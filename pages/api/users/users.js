import clientPromise from '../../../lib/mongodb';
// import { getSession } from 'next-auth/react';

// export default async function handler(req, res) {
//   const session = await getSession({ req }); // Retrieve the session object

//   if (session) {
//     const client = await clientPromise;
//     const db = client.db('nextjs-db');

//     switch (req.method) {
//       //   Get the current user information from the database
//       case 'GET':
//         try {
//           const existingUser = await db
//             .collection('users')
//             .findOne({ uid: session.user.id }); // Access session.user.id
//           res.status(200).json({ status: 200, data: existingUser });
//         } catch (error) {
//           res.status(500).json({ error: 'Error fetching user' });
//         }
//         break;
//       default:
//         res.status(405).end(); // Method Not Allowed
//     }
//   } else {
//     res.status(401).json({ error: 'Not authenticated' }); // Unauthorized
//   }
// }

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { uid } = req.query;

    const client = await clientPromise;
    const db = client.db('nextjs-db');

    try {
      const existingUser = await db.collection('users').findOne({ uid });

      if (existingUser) {
        res.status(200).json(existingUser);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
