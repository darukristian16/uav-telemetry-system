"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Settings, TerminalSquare, BarChartHorizontal } from 'lucide-react';
import { useSession } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { name: 'Configuration', href: '/configuration', icon: Settings },
  { name: 'Terminal', href: '/terminal', icon: TerminalSquare },
  { name: 'Telemetry', href: '/telemetry', icon: BarChartHorizontal },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // If no session, don't render the sidebar
  if (!session) {
    return null;
  }

  return (
    <aside className="w-64 flex-shrink-0 overflow-y-auto bg-card">
      <nav className="flex h-full flex-col px-4 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (pathname.startsWith(item.href) && item.href !== '/dashboard');
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        isActive
                          ? 'bg-secondary text-secondary-foreground'
                          : 'text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground',
                        'group flex items-center gap-x-3 rounded-md px-3 py-2.5 text-sm font-medium'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          isActive
                            ? 'text-secondary-foreground'
                            : 'text-muted-foreground group-hover:text-secondary-foreground',
                          'h-5 w-5 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
