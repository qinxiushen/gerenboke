import { Link, useLocation } from 'react-router-dom';
import { PenLine, User, Home, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/about', label: '关于', icon: User },
];

export default function Header() {
  const location = useLocation();
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#16171d]/80 backdrop-bl-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <PenLine className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            我的博客
          </span>
        </Link>

        {/* Nav + Theme Toggle */}
        <div className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === path
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}

          <button
            onClick={() => setDark(!dark)}
            className="ml-2 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="切换主题"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
