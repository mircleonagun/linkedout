import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, Sun, Moon, Shield, Eye, Bell, Heart, RefreshCw, Sparkles, Check, ArrowLeft } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, showToast, setCurrentScreen, navigateBack, getPreviousScreenLabel } = useApp();

  const [privacyPublicCrafts, setPrivacyPublicCrafts] = useState(true);
  const [privacyOpenCollabs, setPrivacyOpenCollabs] = useState(true);
  const [privacyDirectMessages, setPrivacyDirectMessages] = useState(true);
  const [notificationsLounge, setNotificationsLounge] = useState(true);

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean, label: string) => {
    setter(!current);
    showToast(`${label} ${!current ? 'enabled' : 'disabled'}`, 'info');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Back Button */}
      <div>
        <button
          type="button"
          onClick={navigateBack}
          className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] text-xs font-bold text-[#5B554E] dark:text-[#F7F4EF] hover:border-[#F47736] transition-all shadow-xs active:scale-98 group"
          aria-label={`Back to ${getPreviousScreenLabel()}`}
        >
          <ArrowLeft className="w-4 h-4 text-[#F47736] group-hover:-translate-x-1 transition-transform" />
          <span>Back to {getPreviousScreenLabel()}</span>
        </button>
      </div>

      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-[#F47736]" />
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#211F1D] dark:text-[#F7F4EF]">
            Settings & Privacy
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#7D756C] dark:text-[#B3ABA0] mt-1">
          Customize your sensory preferences, visibility, and review the LinkedOut ethos.
        </p>
      </div>

      {/* Theme Selection Section */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-base text-[#211F1D] dark:text-[#F7F4EF]">
              Color Atmosphere & Theme
            </h2>
            <p className="text-xs text-[#7D756C] dark:text-[#B3ABA0] mt-0.5">
              Hand-tuned palette designed for reading comfort and natural earthy warmth.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Light Warm Ivory */}
          <button
            onClick={() => {
              if (theme !== 'light') toggleTheme();
            }}
            className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
              theme === 'light'
                ? 'border-[#F47736] bg-[#F7F4EF] shadow-md'
                : 'border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Sun className="w-5 h-5 text-[#F47736]" />
              {theme === 'light' && (
                <span className="w-5 h-5 rounded-full bg-[#F47736] text-white flex items-center justify-center text-xs">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <h3 className="font-heading font-bold text-sm text-[#211F1D]">Warm Ivory</h3>
            <p className="text-[11px] text-[#7D756C] mt-0.5">
              Soft cream canvas (#F7F4EF) with terracotta & sage
            </p>
          </button>

          {/* Dark Charcoal */}
          <button
            onClick={() => {
              if (theme !== 'dark') toggleTheme();
            }}
            className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
              theme === 'dark'
                ? 'border-[#F47736] bg-[#211F1D] shadow-md'
                : 'border-[#E9E2D9] dark:border-[#38332F] bg-[#211F1D] opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Moon className="w-5 h-5 text-[#F47736]" />
              {theme === 'dark' && (
                <span className="w-5 h-5 rounded-full bg-[#F47736] text-white flex items-center justify-center text-xs">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <h3 className="font-heading font-bold text-sm text-[#F7F4EF]">Warm Charcoal</h3>
            <p className="text-[11px] text-[#B3ABA0] mt-0.5">
              Deep matte charcoal (#211F1D) with gentle amber glow
            </p>
          </button>
        </div>
      </div>

      {/* Privacy & Safety Controls */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#78917C]" />
          <h2 className="font-heading font-bold text-base text-[#211F1D] dark:text-[#F7F4EF]">
            Privacy & Human Sovereignty
          </h2>
        </div>

        <div className="divide-y divide-[#E9E2D9]/60 dark:divide-[#332F2B]">
          
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <span className="font-heading font-semibold text-xs sm:text-sm text-[#211F1D] dark:text-[#F7F4EF] block">
                Show my crafts publicly in The Lounge
              </span>
              <span className="text-[11px] text-[#7D756C] dark:text-[#9E958B]">
                Allows everyone across the global community to discover your projects.
              </span>
            </div>
            <button
              role="switch"
              aria-checked={privacyPublicCrafts}
              aria-label="Show my crafts publicly in The Lounge"
              onClick={() => handleToggle(setPrivacyPublicCrafts, privacyPublicCrafts, 'Public crafts')}
              className="min-h-[44px] min-w-[48px] flex items-center justify-center transition-colors shrink-0"
            >
              <div
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  privacyPublicCrafts ? 'bg-[#F47736]' : 'bg-[#E9E2D9] dark:bg-[#38332F]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    privacyPublicCrafts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <span className="font-heading font-semibold text-xs sm:text-sm text-[#211F1D] dark:text-[#F7F4EF] block">
                Open to new collaborations & apprenticeships
              </span>
              <span className="text-[11px] text-[#7D756C] dark:text-[#9E958B]">
                Signals to mentors and collaborators that you welcome outreach.
              </span>
            </div>
            <button
              role="switch"
              aria-checked={privacyOpenCollabs}
              aria-label="Open to new collaborations & apprenticeships"
              onClick={() => handleToggle(setPrivacyOpenCollabs, privacyOpenCollabs, 'Collaboration openness')}
              className="min-h-[44px] min-w-[48px] flex items-center justify-center transition-colors shrink-0"
            >
              <div
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  privacyOpenCollabs ? 'bg-[#F47736]' : 'bg-[#E9E2D9] dark:bg-[#38332F]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    privacyOpenCollabs ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <span className="font-heading font-semibold text-xs sm:text-sm text-[#211F1D] dark:text-[#F7F4EF] block">
                Allow direct messages from non-connections
              </span>
              <span className="text-[11px] text-[#7D756C] dark:text-[#9E958B]">
                Permit other makers to send questions or workshop invitations.
              </span>
            </div>
            <button
              role="switch"
              aria-checked={privacyDirectMessages}
              aria-label="Allow direct messages from non-connections"
              onClick={() => handleToggle(setPrivacyDirectMessages, privacyDirectMessages, 'Direct messages')}
              className="min-h-[44px] min-w-[48px] flex items-center justify-center transition-colors shrink-0"
            >
              <div
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  privacyDirectMessages ? 'bg-[#F47736]' : 'bg-[#E9E2D9] dark:bg-[#38332F]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    privacyDirectMessages ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Account & Onboarding Shortcuts */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm space-y-4">
        <div>
          <h2 className="font-heading font-bold text-base text-[#211F1D] dark:text-[#F7F4EF]">
            Account & Onboarding Flows
          </h2>
          <p className="text-xs text-[#7D756C] dark:text-[#B3ABA0] mt-0.5">
            Switch your community persona, register a new account, or re-run the interest onboarding experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setCurrentScreen('welcome')}
            className="min-h-[48px] p-3 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF]/50 dark:bg-[#1E1C1A] hover:border-[#F47736] text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="font-heading font-bold text-xs text-[#211F1D] dark:text-white block">
                Log In & Account Switcher
              </span>
              <span className="text-[11px] text-[#7D756C] dark:text-[#9E958B]">
                Register or test community profiles
              </span>
            </div>
            <Sparkles className="w-4 h-4 text-[#F47736]" />
          </button>

          <button
            onClick={() => setCurrentScreen('onboarding')}
            className="min-h-[48px] p-3 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF]/50 dark:bg-[#1E1C1A] hover:border-[#78917C] text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="font-heading font-bold text-xs text-[#211F1D] dark:text-white block">
                Re-run Onboarding & Interests
              </span>
              <span className="text-[11px] text-[#7D756C] dark:text-[#9E958B]">
                Re-tune curiosities, belonging note & guilds
              </span>
            </div>
            <RefreshCw className="w-4 h-4 text-[#78917C]" />
          </button>
        </div>
      </div>

      {/* The LinkedOut Brand Manifesto */}
      <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#F47736]/10 dark:bg-[#F47736]/15 border border-[#F47736]/25 space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#F47736]" />
          <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#211F1D] dark:text-[#F7F4EF]">
            The LinkedOut Promise
          </h2>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-[#3E3A35] dark:text-[#E9E2D9] leading-relaxed">
          <p className="font-medium text-[#F47736]">
            “People first. Possibilities everywhere.” · “You belong before you achieve.”
          </p>
          <p>
            We built LinkedOut because we were tired of social platforms that reduced living, breathing humans to corporate credentials, algorithmic engagement bait, and resume flexing.
          </p>
          <p>
            Whether you are an apprentice electrician in Lagos, a self-taught woodworker in Kyoto, a first-gen student in Prague, or an everyday human seeking neighborly camaraderie—you have inherent worth right now.
          </p>
        </div>
      </div>

    </div>
  );
};
