import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSession, signIn } from 'next-auth/react';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
import Sidebar from './Sidebar';

export default function Header() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
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

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div>
      {
        <Sidebar
          open={open}
          closeSidebar={toggleSidebar}
          changeTheme={toggleTheme}
        />
      }
      <div className="z-30 h-12 flex justify-between items-center max-w-full sm:mx-auto py-2 px-4 shadow-md sticky top-0 left-0 bg-inherit rounded-sm">
        {/* Logo */}
        {/* Search */}

        {/* Icons & Settings */}
        <div className="flex items-center space-x-2">
          {/* Logic to open a side menu */}
          <AiOutlineMenu className="cursor-pointer" onClick={toggleSidebar} />
        </div>
        {/* change theme */}
        <div className="flex items-center">
          {session && (
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
          )}
        </div>
      </div>
    </div>
  );
}
