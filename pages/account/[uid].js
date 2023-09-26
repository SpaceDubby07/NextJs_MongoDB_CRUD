import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

export default function index() {
  const { data: session } = useSession();
  const router = useRouter();
  const { uid } = router.query;

  const expectedUserId = session?.user?.uid; // Check if session and session.user are defined

  const handleSignOut = async () => {
    if (uid && uid !== expectedUserId) {
      router.replace('/posts'); // Redirect to a specific page if the account doesn't match
    } else {
      // Perform sign-out when the account matches or no user is signed in
      await signOut({ callbackUrl: '/posts' });
    }
  };

  useEffect(() => {
    // Check if uid exists and if it doesn't match the expected user ID
    if (uid && uid !== expectedUserId) {
      // Redirect to a specific page if the account doesn't match
      router.replace('/posts'); // Replace with the desired redirection URL
    }
  }, [uid, router]);

  return (
    <div>
      <p>Username: {session?.user?.name}</p>
      <p>email: {session?.user?.email}</p>
      <img src={session?.user?.image} className="rounded-full"></img>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
