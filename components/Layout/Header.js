import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import Sidebar from './Sidebar';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
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
      <div className="darkbg lightbg z-30 h-12 flex justify-between items-center max-w-full sm:mx-auto py-2 px-4 shadow-md fixed top-0 left-0 right-0 rounded-sm">
        {/* Logo */}
        {/* Search */}

        {/* Icons & Settings */}
        <div className="flex items-center space-x-2">
          {/* Logic to open a side menu */}
          <AiOutlineMenu className="cursor-pointer" onClick={toggleSidebar} />
        </div>
      </div>
    </div>
  );
}
