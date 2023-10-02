import { IoClose } from 'react-icons/io5';
import { AiFillHome } from 'react-icons/ai';
import { FaUserFriends } from 'react-icons/fa';
import { MdManageAccounts } from 'react-icons/md';
import {
  BsMoonStarsFill,
  BsFillSunFill,
  BsFillChatTextFill,
} from 'react-icons/bs';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Sidebar(props) {
  const { theme } = useTheme();
  const { data: session } = useSession();

  const Menus = [
    { title: 'Home', src: '', icon: <AiFillHome /> },
    { title: 'Chat', src: 'posts', icon: <BsFillChatTextFill /> },
    {
      title: 'Account',
      src: session ? `account/${session?.user?.uid}` : 'auth/signin',
      icon: <MdManageAccounts />,
    },
  ];

  return (
    <div
      className={`${
        props.open
          ? 'translate-x-0 z-40 drop-shadow-[0_0_35px_rgba(0,0,0,0.65)]'
          : '-translate-x-full '
      } fixed top-0 left-0 h-full w-48 bg-zinc-200 dark:bg-zinc-900`}
    >
      <IoClose
        onClick={props.closeSidebar}
        className="text-red-600 mt-4 ml-3 cursor-pointer text-2xl"
      />
      {/* links */}
      <div className="">
        <ul className="pt-4 m-2">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className="flex rounded-md p-2 cursor-pointer text-sm hover:text-base hover:bg-zinc-900 hover:text-white dark:hover:lightbg dark:hover:text-black"
            >
              <Link
                href={`/${Menu.src}`}
                className="flex items-center gap-x-2"
                onClick={props.closeSidebar}
              >
                <span>{Menu.icon}</span>
                <span>{Menu.title}</span>
              </Link>
            </li>
          ))}
          <div className="absolute left-4 bottom-6 flex space-x-8 items-center">
            <li onClick={props.changeTheme}>
              {theme === 'light' ? (
                <BsMoonStarsFill
                  className="h-5 w-5 mt-1 cursor-pointer text-slate-900"
                  onClick={props.changeTheme}
                />
              ) : (
                <BsFillSunFill
                  className="h-5 w-5 mt-1 cursor-pointer text-yellow-500"
                  onClick={props.changeTheme}
                />
              )}
            </li>
            {!session ? (
              <li className="cursor-pointer hover:bg-zinc-900 hover:text-white dark:hover:lightbg dark:hover:text-black p-2 px-6 rounded-md">
                <Link href="/auth/signin" onClick={props.closeSidebar}>
                  Sign In
                </Link>
              </li>
            ) : (
              <li
                className="cursor-pointer hover:bg-zinc-900 hover:text-white dark:hover:lightbg dark:hover:text-black p-2 px-6 rounded-md"
                onClick={signOut}
              >
                Sign Out
              </li>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
}
