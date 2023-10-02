import { IoClose } from 'react-icons/io5';
import { HiDocumentText } from 'react-icons/hi';
import { AiFillHome } from 'react-icons/ai';
import { MdManageAccounts } from 'react-icons/md';
import { BsMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Sidebar(props) {
  const { theme } = useTheme();
  const { data: session } = useSession();

  const Menus = [
    { title: 'Home', src: '', icon: <AiFillHome /> },
    { title: 'Posts', src: 'posts', icon: <HiDocumentText /> },
    {
      title: 'Account',
      src: session ? `accounts/${session?.user?.uid}` : 'auth/signin',
      icon: <MdManageAccounts />,
    },
    { title: 'Other', src: '', icon: <HiDocumentText /> },
  ];

  return (
    <div
      className={`${
        props.open ? 'translate-x-0 z-40' : '-translate-x-full'
      } fixed top-0 left-0 h-full w-48 lightbg darkbg`}
    >
      <IoClose
        onClick={props.closeSidebar}
        className="text-red-600 mt-6 ml-4 cursor-pointer text-2xl"
      />
      {/* links */}
      <div className="">
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className="flex rounded-md p-2 cursor-pointer text-sm"
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
          <div className="absolute left-4 bottom-10 flex space-x-4">
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
              <li className="cursor-pointer" onClick={signIn}>
                Sign In
              </li>
            ) : (
              <li className="cursor-pointer" onClick={signOut}>
                Sign Out
              </li>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
}
