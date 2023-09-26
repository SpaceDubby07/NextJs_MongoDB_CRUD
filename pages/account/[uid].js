import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import clientPromise from '../../lib/mongodb';

export default function index({ user }) {
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  const { uid } = router.query;

  const expectedUserId = user?.uid;

  const handleSignOut = async () => {
    if (session?.user?.uid !== expectedUserId) {
      router.replace('/posts'); // Redirect to a specific page if the account doesn't match
    } else {
      // Perform sign-out when the account matches or no user is signed in
      await signOut({ callbackUrl: '/posts' });
    }
  };

  useEffect(() => {
    // Check if uid exists and if it doesn't match the expected user ID
    if (session?.user?.uid !== expectedUserId) {
      // Redirect to a specific page if the account doesn't match
      router.replace('/posts'); // Replace with the desired redirection URL
    } else {
      setIsLoading(false); // Set isLoading to false when the data is ready
    }
  }, [uid, expectedUserId, router]);

  // Render your component conditionally based on isLoading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (uid !== session?.user?.uid) {
    return <div>Unauthorized access</div>; // Or any other message
  }

  return (
    <div className="items-center text-center">
      <p className="m-4">Username: {user?.username}</p>
      <p className="m-4">Email: {user?.email}</p>
      <p className="m-4">Auth Provider: {user?.provider}</p>
      <p className="m-4">Admin: {user?.isAdmin ? 'True' : 'False'} </p>
      <img src={user?.userImageURL} className="rounded-full mx-auto"></img>
      <button onClick={handleSignOut} className="m-4">
        Sign Out
      </button>
    </div>
  );
}

// match the user session data with the database data
export async function getServerSideProps(ctx) {
  const client = await clientPromise;
  const db = client.db('nextjs-db');
  const { uid } = ctx.query;
  try {
    // Find the user by uid and convert the cursor to an array
    const currentUser = await db.collection('users').findOne({ uid });

    if (currentUser) {
      // Convert the MongoDB ObjectIds and dates to a string for serialization so the page can load correctly
      const serializedUser = {
        ...currentUser,
        _id: currentUser._id.toString(),
        accountCreationDate: currentUser.accountCreationDate.toString(),
        lastLogin: currentUser.lastLogin.toString(),
      };

      return {
        props: {
          user: serializedUser,
        },
      };
    } else {
      return {
        notFound: true, // User not found
      };
    }
  } catch (error) {
    console.error(error);
    return {
      props: {
        user: null,
      },
    };
  }
}
