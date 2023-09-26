import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/outline';
import { useSession, signIn } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const targetUserId = session?.user.uid; // Replace with the actual user ID

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="z-30 flex justify-between items-center max-w-full sm:mx-auto p-6 shadow-md sticky top-0 left-0 bg-inherit rounded-sm">
      {/* Logo */}
      {/* Search */}

      {/* Icons & Settings */}
      <div className="flex items-center">
        <Link href="/" className="mr-4">
          Home
        </Link>
        {theme === 'light' ? (
          <MoonIcon
            className="h-5 w-5 mt-1 cursor-pointer text-black"
            onClick={toggleTheme}
          />
        ) : (
          <SunIcon
            className="h-5 w-5 mt-1 cursor-pointer text-yellow-500"
            onClick={toggleTheme}
          />
        )}
      </div>
      {/* change theme */}
      <div className="flex items-center">
        {session ? (
          <Fragment>
            {session?.user?.uid === targetUserId ? (
              <Link href={`/account/${session.user.uid}`}>
                <img
                  src={session.user.image}
                  referrerPolicy="no-referrer"
                  alt="user-image"
                  className="h-10 rounded-full cursor-pointer object-cover ml-4"
                />
              </Link>
            ) : null}
          </Fragment>
        ) : (
          <button className="m-4" onClick={signIn}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}
