// Sidebar.js
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import { AiOutlineMenu, AiFillHome, AiOutlineUser } from 'react-icons/ai';
import { BsFillChatLeftTextFill } from 'react-icons/bs';
import Signin from '../pages/auth/signin';

export default function Sidebar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: 'Home', src: '', icon: <AiFillHome /> },
    { title: 'Posts', src: 'posts', icon: <BsFillChatLeftTextFill /> },
    {
      title: 'Account',
      src: session?.user?.uid ? `account/${session.user.uid}` : 'auth/signin',
      icon: <AiOutlineUser />,
      gap: true,
    },
  ];

  return (
    // flex for full length of screen
    <div
      className={`flex flex-row ${
        open ? '' : 'flex-col w-screen absolute top-0 right-0 left-0'
      }`}
    >
      {' '}
      {/* This controls the size of the sidebar */}
      <div
        className={` ${
          open ? 'w-44 p-5' : 'w-4'
        } h-screen relative overflow-y-auto scrollbar-none`}
      >
        {/* This controls the hamburger icon */}
        <div
          className={`${
            open
              ? 'flex items-center space-x-2 pl-1'
              : 'absolute top-2 left-2 p-1 items-center'
          }`}
        >
          <AiOutlineMenu
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
          {(open && session && (
            <Link href={`/account/${session?.user?.uid}`}>
              {session?.user?.name}
            </Link>
          )) ||
            (open && (
              <div className="hover:cursor-pointer" onClick={() => signIn()}>
                Sign in
              </div>
            ))}
        </div>
        {open && !session && (
          <div className="pt-6 pl-1">
            <Link href="/">
              {open ? (
                <div className="items-center flex space-x-2">
                  <AiFillHome />
                  <p>Home</p>
                </div>
              ) : (
                ''
              )}
            </Link>
          </div>
        )}
        {open && session && (
          <ul className="pt-6">
            {Menus.map((Menu, index) => (
              <li
                key={index}
                className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4
              ${Menu.gap ? 'mt-3' : 'mt-2'} ${
                  index === 0 && 'bg-light-white'
                } `}
              >
                <Link
                  href={`/${Menu.src}`}
                  className="items-center flex space-x-4"
                >
                  {Menu.icon}
                  <span
                    className={`${!open && 'hidden'} origin-left duration-200`}
                  >
                    {Menu.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
