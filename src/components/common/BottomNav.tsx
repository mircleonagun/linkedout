import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Compass, Users2, MessageSquare, User } from 'lucide-react';
import { ScreenId } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, conversations } = useApp();

  const unreadMessagesCount = conversations.reduce(
    (acc, curr) => acc + (curr.unreadCount || 0),
    0
  );

  const tabs: {
    id: ScreenId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'circles', label: 'Circles', icon: Users2 },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F7F4EF]/95 dark:bg-[#1C1A18]/95 backdrop-blur-lg border-t border-[#E9E2D9] dark:border-[#2E2B27] pb-safe shadow-lg transition-colors duration-200"
      aria-label="Bottom Navigation"
    >
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentScreen(tab.id)}
              className="relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] h-full py-1 text-center transition-colors group focus:outline-none"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative flex items-center justify-center w-7 h-7">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-[#F47736] scale-110 stroke-[2.4]'
                      : 'text-[#7D756C] dark:text-[#9E958B] group-hover:text-[#211F1D] dark:group-hover:text-white stroke-[1.8]'
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#F47736] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#F7F4EF] dark:border-[#1C1A18]">
                    {tab.badge}
                  </span>
                ) : null}
              </div>

              <span
                className={`text-[11px] font-medium tracking-tight mt-0.5 leading-none transition-colors ${
                  isActive
                    ? 'text-[#F47736] font-semibold'
                    : 'text-[#7D756C] dark:text-[#9E958B] group-hover:text-[#211F1D] dark:group-hover:text-white'
                }`}
              >
                {tab.label}
              </span>

              {/* Active Dot Anchor */}
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1 bg-[#F47736] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
