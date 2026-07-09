import { Bell, Search, Menu } from 'lucide-react';

export function Header() {
  return (
    <div className="sticky top-0 z-40 flex-shrink-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center px-4 sm:px-6 lg:px-8 md:ml-64 transition-colors duration-300">
      <div className="flex-1 flex justify-between">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
              placeholder="Search in Atlas AI..."
            />
          </div>
        </div>
        <div className="ml-4 flex items-center gap-4 md:ml-6">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 relative"
          >
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-slate-900" />
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Profile dropdown placeholder */}
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 cursor-pointer">
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">AU</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
