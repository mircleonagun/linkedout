import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { CreatePostModal } from './components/common/CreatePostModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { CircleDetailModal } from './components/circles/CircleDetailModal';

// Screens
import { LoungeScreen } from './screens/LoungeScreen';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { CirclesScreen } from './screens/CirclesScreen';
import { MessagesScreen } from './screens/MessagesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { OpenDoorsScreen } from './screens/OpenDoorsScreen';
import { FindAProScreen } from './screens/FindAProScreen';
import { AfterHoursScreen } from './screens/AfterHoursScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { WorkplaceScreen } from './screens/WorkplaceScreen';

// Desktop Sidebar Icons
import {
  Compass,
  Users2,
  DoorOpen,
  Wrench,
  Moon,
  Settings,
  Sparkles,
  HeartHandshake,
  MessageSquare,
  Briefcase
} from 'lucide-react';
import { ScreenId } from './types';

const MainLayout: React.FC = () => {
  const { currentScreen, setCurrentScreen, opportunities, events, openProfile } = useApp();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <LoungeScreen />;
      case 'discover':
        return <DiscoverScreen />;
      case 'circles':
        return <CirclesScreen />;
      case 'messages':
        return <MessagesScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'opendoors':
        return <OpenDoorsScreen />;
      case 'findapro':
        return <FindAProScreen />;
      case 'afterhours':
        return <AfterHoursScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'welcome':
        return <WelcomeScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'unfiltered':
        return <WorkplaceScreen />;
      default:
        return <LoungeScreen />;
    }
  };

  const desktopNavItems: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'The Lounge', icon: Sparkles },
    { id: 'unfiltered', label: 'Unfiltered Workplace', icon: Briefcase },
    { id: 'welcome', label: 'Log In / Register', icon: HeartHandshake },
    { id: 'onboarding', label: 'Onboarding & Vibe', icon: Sparkles },
    { id: 'discover', label: 'Discover People', icon: Compass },
    { id: 'circles', label: 'Circles & Guilds', icon: Users2 },
    { id: 'opendoors', label: 'Open Doors', icon: DoorOpen },
    { id: 'findapro', label: 'Find a Pro', icon: Wrench },
    { id: 'afterhours', label: 'After Hours', icon: Moon },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings & Privacy', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF] dark:bg-[#1C1A18] text-[#211F1D] dark:text-[#F7F4EF] transition-colors duration-200 flex flex-col font-sans">
      {/* Top Header */}
      <Header />

      {/* Main Responsive Grid Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 flex gap-6 pb-24 sm:pb-28 md:pb-8">
        
        {/* Desktop Left Rail Navigation (visible on xl/lg screens when authenticated / past welcome screen) */}
        {currentScreen !== 'welcome' && (
          <aside className="hidden lg:block w-56 shrink-0 py-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#332F2B] shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B] px-3 pb-2 block">
                Spaces & Network
              </span>
              {desktopNavItems.map((item) => {
                const isActive = currentScreen === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentScreen(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#F47736] text-white shadow-sm'
                        : 'text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white hover:bg-[#F7F4EF] dark:hover:bg-[#2C2926]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Ethos Card */}
            <div className="mt-4 p-4 rounded-2xl bg-[#78917C]/10 dark:bg-[#78917C]/15 border border-[#78917C]/25 text-xs text-[#3E5343] dark:text-[#A7C2AB] space-y-1">
              <span className="font-bold block uppercase tracking-wider text-[10px]">
                Grounding Ethos
              </span>
              <p className="text-[11px] leading-relaxed">
                “You belong before you achieve.” Take off the corporate armor and connect human to human.
              </p>
            </div>
          </aside>
        )}

        {/* Center Main Stage */}
        <main className="flex-1 min-w-0 w-full overflow-x-hidden">
          {renderActiveScreen()}
        </main>

        {/* Desktop Right Aside Widget (Only on screens without integrated sidebars) */}
        {currentScreen !== 'home' && currentScreen !== 'messages' && currentScreen !== 'welcome' && currentScreen !== 'onboarding' && (
          <aside className="hidden xl:block w-72 shrink-0 py-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto space-y-4">
            
            {/* Featured Open Door */}
            {opportunities.length > 0 && (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#332F2B] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F47736]">
                    Door of the Day
                  </span>
                  <button
                    onClick={() => setCurrentScreen('opendoors')}
                    className="text-[11px] font-medium text-[#7D756C] hover:text-[#F47736]"
                  >
                    All ({opportunities.length})
                  </button>
                </div>

                <h4 className="font-heading font-bold text-xs text-[#211F1D] dark:text-[#F7F4EF] line-clamp-1">
                  {opportunities[0].title}
                </h4>
                <p className="text-[11px] text-[#7D756C] dark:text-[#9E958B]">
                  {opportunities[0].compensation}
                </p>
                <button
                  onClick={() => setCurrentScreen('opendoors')}
                  className="w-full py-1.5 rounded-lg bg-[#F7F4EF] dark:bg-[#1E1C1A] border border-[#E9E2D9] dark:border-[#38332F] text-[11px] font-semibold text-[#211F1D] dark:text-white hover:border-[#F47736] transition-colors"
                >
                  View Opportunity
                </button>
              </div>
            )}

            {/* Upcoming After Hours Event */}
            {events.length > 0 && (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78917C] dark:text-[#95AF99]">
                    After Hours Tonight
                  </span>
                  <button
                    onClick={() => setCurrentScreen('afterhours')}
                    className="text-[11px] font-medium text-[#7D756C] hover:text-[#F47736]"
                  >
                    Events ({events.length})
                  </button>
                </div>

                <h4 className="font-heading font-bold text-xs text-[#211F1D] dark:text-[#F7F4EF] line-clamp-1">
                  {events[0].title}
                </h4>
                <p className="text-[11px] text-[#7D756C] dark:text-[#9E958B]">
                  {events[0].date} · {events[0].time}
                </p>
                <button
                  onClick={() => setCurrentScreen('afterhours')}
                  className="w-full py-1.5 rounded-lg bg-[#F47736]/10 text-[#F47736] text-[11px] font-semibold hover:bg-[#F47736]/20 transition-colors"
                >
                  RSVP Gathering
                </button>
              </div>
            )}

            {/* Quick Manifesto Footer */}
            <div className="px-2 text-[11px] text-[#9E958B] dark:text-[#7D756C] space-y-1">
              <p>© LinkedOut · Built for real people everywhere.</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentScreen('welcome')} className="hover:underline">Manifesto</button>
                <span>·</span>
                <button onClick={() => setCurrentScreen('settings')} className="hover:underline">Privacy</button>
                <span>·</span>
                <button onClick={() => setCurrentScreen('circles')} className="hover:underline">Guilds</button>
              </div>
            </div>

          </aside>
        )}

      </div>

      {/* iPhone-Friendly Bottom Navigation (Mobile & Tablet) */}
      {currentScreen !== 'welcome' && <BottomNav />}

      {/* Global Modals & Feedback Toasts */}
      <CreatePostModal />
      <ProfileModal />
      <CircleDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
