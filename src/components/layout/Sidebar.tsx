import Link from 'next/link';
import { LayoutDashboard, Users, Settings, FolderOpen, Menu } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '#', icon: LayoutDashboard },
  { name: 'Documents', href: '#', icon: FolderOpen },
  { name: 'Team', href: '#', icon: Users },
  { name: 'Settings', href: '#', icon: Settings },
];

export function Sidebar() {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
      <div className="flex-1 flex flex-col min-h-0 bg-slate-900 dark:bg-slate-950 border-r border-slate-800">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-white text-xl font-semibold tracking-tight">ATLAS AI</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-2 flex-1 px-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-slate-800 p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs font-medium text-slate-400 group-hover:text-slate-300">View profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
