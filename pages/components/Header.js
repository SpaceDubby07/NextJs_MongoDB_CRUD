import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/outline';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

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
      <div className="flex">
        <Link href="/" className="mr-4">
          CRUD
        </Link>

        {theme === 'light' ? (
          <MoonIcon
            className="h-6 w-6 cursor-pointer text-black"
            onClick={toggleTheme}
          />
        ) : (
          <SunIcon
            className="h-6 w-6 cursor-pointer text-yellow-500"
            onClick={toggleTheme}
          />
        )}
      </div>
      {/* change theme */}
      <div className="flex items-center">
        <Link href="/" className="m-4">
          Home
        </Link>
        <Link href="/posts" className="m-4">
          Posts
        </Link>
        {session ? (
          <Fragment>
            <img
              src={session.user.image}
              referrerPolicy="no-referrer"
              alt="user-image"
              className="h-10 rounded-full cursor-pointer object-cover ml-4"
              onClick={signOut}
            />
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
