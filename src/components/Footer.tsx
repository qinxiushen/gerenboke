import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#16171d]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>&copy; {new Date().getFullYear()} 我的博客</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
