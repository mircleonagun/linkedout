import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
  DoorOpen,
  Wrench,
  Users2,
  Settings,
  HeartHandshake,
  Compass,
  User,
  LogIn,
  LogOut,
  ArrowLeft,
  Briefcase
} from 'lucide-react';
import { ScreenId } from '../../types';
import { Avatar } from './Avatar';

export const Header: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    previousScreen,
    navigateBack,
    getPreviousScreenLabel,
    theme,
    toggleTheme,
    setCreatePostOpen,
    currentUser,
    logoutUser,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const navLinks: { id: ScreenId; label: string }[] = [
    { id: 'home', label: 'The Lounge' },
    { id: 'unfiltered', label: 'Unfiltered' },
    { id: 'opendoors', label: 'Open Doors' },
    { id: 'findapro', label: 'Find a Pro' },
    { id: 'afterhours', label: 'After Hours' },
    { id: 'circles', label: 'Circles' },
  ];

  const allSpaces: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: 'unfiltered', label: 'The Unfiltered Workplace', icon: Briefcase, desc: 'Why I left, interview chronicles, and salary reality' },
    { id: 'welcome', label: 'Log In / Create Account', icon: LogIn, desc: 'Sign in, register, or switch community persona' },
    { id: 'onboarding', label: 'Onboarding & Interests', icon: Sparkles, desc: 'Customize craft curiosities, belonging note & guilds' },
    { id: 'home', label: 'The Lounge', icon: Sparkles, desc: 'Stories, works-in-progress, and reflections' },
    { id: 'discover', label: 'Discover People', icon: Compass, desc: 'Global makers, students, and trades' },
    { id: 'opendoors', label: 'Open Doors', icon: DoorOpen, desc: 'Apprenticeships, gigs, and collaborations' },
    { id: 'findapro', label: 'Find a Pro', icon: Wrench, desc: 'Independent craftspeople and skilled trades' },
    { id: 'afterhours', label: 'After Hours', icon: Moon, desc: 'Acoustic jams, food, and culture' },
    { id: 'circles', label: 'Circles & Guilds', icon: Users2, desc: 'Community interest pods and workshops' },
    { id: 'settings', label: 'Settings & Privacy', icon: Settings, desc: 'Themes, visibility, and notification controls' },
  ];

  const handleMobileNav = (id: ScreenId) => {
    setCurrentScreen(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#F7F4EF]/95 dark:bg-[#1C1A18]/95 backdrop-blur-md border-b border-[#E9E2D9] dark:border-[#2E2B27] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 h-12 sm:h-14 md:h-16 flex items-center justify-between gap-1.5 sm:gap-3 md:gap-6">
          
          {/* Zone 1: Wordmark, Back Button & Mobile Menu Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Back to Previous Page Button (Visible when not on 'home' and not on 'welcome') */}
            {currentScreen !== 'home' && currentScreen !== 'welcome' && (
              <button
                onClick={navigateBack}
                className="flex items-center gap-1 sm:gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-lg bg-[#E9E2D9]/70 dark:bg-[#2A2724] hover:bg-[#F47736]/15 hover:text-[#F47736] text-[#5B554E] dark:text-[#D1C9BE] text-xs font-bold transition-all border border-transparent hover:border-[#F47736]/30 active:scale-95 shrink-0 shadow-xs"
                title={`Back to ${getPreviousScreenLabel()}`}
                aria-label={`Back to ${getPreviousScreenLabel()}`}
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F47736]" />
                <span className="hidden xs:inline sm:inline">Back</span>
              </button>
            )}

            {/* Mobile Menu Button (Only when past welcome screen) */}
            {currentScreen !== 'welcome' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white transition-colors"
                aria-label={mobileMenuOpen ? 'Close navigation spaces' : 'Open navigation spaces'}
              >
                {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            )}

            {/* Brand Logo & Wordmark */}
            <button
              onClick={() => setCurrentScreen('welcome')}
              className="flex items-center gap-1.5 sm:gap-2 group text-left focus:outline-none"
              aria-label="LinkedOut Welcome"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg bg-[#F47736] flex items-center justify-center text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
                <span className="font-heading font-extrabold text-xs sm:text-sm md:text-base tracking-tighter">LO</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-sm sm:text-base md:text-lg lg:text-xl tracking-tight text-[#211F1D] dark:text-[#F7F4EF] transition-colors leading-none">
                  Linked<span className="text-[#F47736]">Out</span>
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop & Tablet - Only visible when past welcome screen) */}
          {currentScreen !== 'welcome' && (
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = currentScreen === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setCurrentScreen(link.id)}
                    className={`h-9 px-3 py-1.5 text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap shrink-0 transition-colors rounded-lg flex items-center ${
                      isActive
                        ? 'text-[#F47736] bg-[#F47736]/10 dark:bg-[#F47736]/15 font-semibold'
                        : 'text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-[#F7F4EF] hover:bg-[#E9E2D9]/40 dark:hover:bg-[#2A2724]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Zone 3: Actions (Theme Toggle, Onboarding, Log In, Share, Avatar) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Theme Toggle - Proportional on mobile */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#E9E2D9] dark:border-[#2E2B27] flex items-center justify-center text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white hover:bg-white dark:hover:bg-[#2A2724] transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F47736]" />
              )}
            </button>

            {/* Direct Onboarding Screen Link (Desktop & Tablet) */}
            <button
              onClick={() => setCurrentScreen('onboarding')}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 h-8 sm:h-9 text-xs font-semibold rounded-lg border transition-colors ${
                currentScreen === 'onboarding'
                  ? 'bg-[#78917C] text-white border-[#78917C]'
                  : 'text-[#78917C] dark:text-[#95AF99] border-[#78917C]/30 hover:bg-[#78917C]/10'
              }`}
              title="Personalize Interests & Onboarding"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Onboarding</span>
            </button>

            {/* Direct Log In / Register Screen Link (Desktop only to prevent clutter) */}
            <button
              onClick={() => setCurrentScreen('welcome')}
              className={`hidden lg:flex items-center gap-1.5 px-3 h-9 text-xs font-semibold rounded-lg border transition-colors ${
                currentScreen === 'welcome'
                  ? 'bg-[#F47736] text-white border-[#F47736]'
                  : 'text-[#F47736] border-[#F47736]/30 hover:bg-[#F47736]/10'
              }`}
              title="Log In or Create an Account"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In / Sign Up</span>
            </button>

            {/* Share Post Button - Compact icon on mobile, with text on sm+ */}
            <button
              onClick={() => setCreatePostOpen(true)}
              className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 rounded-lg bg-[#F47736] hover:bg-[#E06524] active:scale-[0.98] text-white text-xs font-semibold tracking-tight flex items-center justify-center gap-1.5 shadow-xs shadow-[#F47736]/20 transition-all duration-150"
              aria-label="Share a story or craft"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* User Avatar & Menu Popover */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-transform active:scale-95"
                title={`Account: ${currentUser.name}`}
                aria-label="User Account Menu"
                aria-expanded={userMenuOpen}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border transition-colors ${
                  currentScreen === 'profile' || userMenuOpen
                    ? 'border-[#F47736]'
                    : 'border-transparent hover:border-[#E9E2D9] dark:hover:border-[#38332F]'
                }`}>
                  <Avatar
                    src={currentUser.avatar}
                    name={currentUser.name}
                    className="w-full h-full rounded-md object-cover"
                  />
                </div>
              </button>

              {/* Account Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 p-1.5 bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  {/* User snippet */}
                  <div className="px-3 py-2 border-b border-[#E9E2D9] dark:border-[#332F2B]">
                    <span className="font-heading font-bold text-xs text-[#211F1D] dark:text-white block truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[11px] text-[#78917C] dark:text-[#95AF99] block truncate">
                      {currentUser.role}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentScreen('profile');
                      setUserMenuOpen(false);
                    }}
                    className="w-full h-9 px-3 rounded-lg flex items-center gap-2.5 text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white hover:bg-[#F7F4EF] dark:hover:bg-[#2C2926] transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-[#F47736]" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentScreen('unfiltered');
                      setUserMenuOpen(false);
                    }}
                    className="w-full h-9 px-3 rounded-lg flex items-center gap-2.5 text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white hover:bg-[#F7F4EF] dark:hover:bg-[#2C2926] transition-colors text-left"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-[#F47736]" />
                    <span>Unfiltered Workplace</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentScreen('welcome');
                      setUserMenuOpen(false);
                    }}
                    className="w-full h-9 px-3 rounded-lg flex items-center gap-2.5 text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white hover:bg-[#F7F4EF] dark:hover:bg-[#2C2926] transition-colors text-left"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#F47736]" />
                    <span>Log In / Create Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentScreen('onboarding');
                      setUserMenuOpen(false);
                    }}
                    className="w-full h-9 px-3 rounded-lg flex items-center gap-2.5 text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white hover:bg-[#F7F4EF] dark:hover:bg-[#2C2926] transition-colors text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#78917C]" />
                    <span>Onboarding & Interests</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentScreen('settings');
                      setUserMenuOpen(false);
                    }}
                    className="w-full h-9 px-3 rounded-lg flex items-center gap-2.5 text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white hover:bg-[#F7F4EF] dark:hover:bg-[#2C2926] transition-colors text-left"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#7D756C]" />
                    <span>Settings & Privacy</span>
                  </button>

                  <div className="pt-1 mt-1 border-t border-[#E9E2D9] dark:border-[#332F2B]">
                    <button
                      onClick={() => {
                        logoutUser();
                        setUserMenuOpen(false);
                      }}
                      className="w-full h-9 px-3 rounded-lg flex items-center gap-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out & Exit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Mobile Spaces Menu Drawer - Refined, sleek, proportionate */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 flex flex-col justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full bg-[#F7F4EF] dark:bg-[#211F1D] border-t border-[#E9E2D9] dark:border-[#38332F] rounded-t-2xl max-h-[80vh] overflow-y-auto p-4 pb-safe space-y-3 shadow-xl animate-in slide-in-from-bottom-5 duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-8 h-1 bg-[#D1C9BE] dark:bg-[#38332F] rounded-full mx-auto" />

            <div className="flex items-center justify-between pb-1.5 border-b border-[#E9E2D9] dark:border-[#332F2B]">
              <div>
                <h3 className="font-heading font-extrabold text-sm text-[#211F1D] dark:text-[#F7F4EF]">
                  Explore LinkedOut Spaces
                </h3>
                <p className="text-[11px] text-[#7D756C] dark:text-[#9E958B]">
                  Every corner of our community, open to everyone.
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-[#7D756C] hover:text-[#211F1D] dark:hover:text-white rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {allSpaces.map((space) => {
                const isActive = currentScreen === space.id;
                const Icon = space.icon;
                return (
                  <button
                    key={space.id}
                    onClick={() => handleMobileNav(space.id)}
                    className={`p-2.5 rounded-xl flex items-center gap-2.5 text-left transition-colors ${
                      isActive
                        ? 'bg-[#F47736] text-white shadow-xs'
                        : 'bg-white dark:bg-[#2A2724] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-[#F7F4EF]'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#F47736]/10 text-[#F47736]'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-heading font-bold text-xs block leading-tight">
                        {space.label}
                      </span>
                      <span className={`text-[10px] block truncate ${
                        isActive ? 'text-white/80' : 'text-[#7D756C] dark:text-[#9E958B]'
                      }`}>
                        {space.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
