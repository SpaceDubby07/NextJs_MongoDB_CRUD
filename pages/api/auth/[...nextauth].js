import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '../../../lib/mongodb';

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],

  // routes
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user.uid = token.sub;
      return session;
    },

    async signIn(user, account, profile) {
      const client = await clientPromise;
      const db = client.db('nextjs-db');

      // Check the user data from the session
      // console.log('User Data from Session:', user);

      // Use user data from the session if available
      const sessionUser = {
        uid: user.user.id,
        username: user.user.name, // Use the appropriate property from the session
        email: user.user.email,
        userImageURL: user.user.image, // Use the appropriate property from the session
        accountCreationDate: new Date(),
        provider: user.account.provider,
        lastLogin: new Date(),
        isAdmin: false, // Set isAdmin to false by default
        // Add other user properties as needed
      };

      // Check if the user exists in the database based on a unique identifier (e.g., id)
      const existingUser = await db
        .collection('users')
        .findOne({ uid: user.user.id });

      if (!existingUser) {
        // User doesn't exist in the database, so create a new user document
        await db.collection('users').insertOne(sessionUser);
      } else {
        // User already exists, you can update their data if needed
        // update the last login timestamp
        await db
          .collection('users')
          .updateOne(
            { uid: user.user.id },
            { $set: { lastLogin: new Date() } }
          );
      }

      // Continue the sign-in process (returning true)
      return true;
    },
    secret: process.env.NEXTAUTH_SECRET,
  },
};

export default NextAuth(authOptions);
