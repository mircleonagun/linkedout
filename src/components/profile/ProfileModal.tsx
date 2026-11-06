import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, MapPin, Sparkles, MessageCircle, UserPlus, UserCheck, Award, HeartHandshake, Compass } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const ProfileModal: React.FC = () => {
  const {
    selectedProfile,
    closeProfile,
    toggleFollowUser,
    startConversationWithUser,
    currentUser,
  } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProfile();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeProfile]);

  if (!selectedProfile) return null;

  const isSelf = selectedProfile.id === currentUser.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#F7F4EF] dark:bg-[#211F1D] border border-[#E9E2D9] dark:border-[#38332F] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
      >
        {/* Cover / Header Banner */}
        <div className="relative h-28 sm:h-36 bg-gradient-to-r from-[#F47736]/20 via-[#78917C]/20 to-[#E9E2D9] dark:from-[#F47736]/15 dark:via-[#78917C]/15 dark:to-[#2A2724] p-4 flex justify-end items-start">
          <button
            onClick={closeProfile}
            className="min-h-[44px] min-w-[44px] rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            aria-label="Close profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content Body */}
        <div className="p-5 sm:p-7 -mt-14 sm:-mt-16 flex-1 overflow-y-auto space-y-6">
          
          {/* Avatar & Key Action Buttons */}
          <div className="flex items-end justify-between gap-4">
            <div className="relative">
              <Avatar
                src={selectedProfile.avatar}
                name={selectedProfile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-[#F7F4EF] dark:border-[#211F1D] shadow-md"
              />
              <span className="absolute bottom-1 right-1 text-lg sm:text-xl drop-shadow" title={selectedProfile.country}>
                {selectedProfile.countryFlag}
              </span>
            </div>

            {!isSelf && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startConversationWithUser(selectedProfile)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#2C2926] border border-[#E9E2D9] dark:border-[#38332F] text-xs sm:text-sm font-semibold text-[#211F1D] dark:text-[#F7F4EF] hover:border-[#F47736] flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-[#F47736]" />
                  <span>Message</span>
                </button>

                <button
                  onClick={() => toggleFollowUser(selectedProfile.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                    selectedProfile.isFollowing
                      ? 'bg-[#78917C]/15 dark:bg-[#78917C]/25 text-[#4D6451] dark:text-[#A7C2AB] border border-[#78917C]/30'
                      : 'bg-[#F47736] hover:bg-[#E06524] text-white'
                  }`}
                >
                  {selectedProfile.isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Name & Headline */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="profile-title" className="font-heading font-extrabold text-fluid-h1 text-[#211F1D] dark:text-[#F7F4EF]">
                {selectedProfile.name}
              </h2>
              {selectedProfile.verifiedCraft && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#F47736]">
                  <Award className="w-3.5 h-3.5" />
                  <span>{selectedProfile.verifiedCraft}</span>
                </span>
              )}
            </div>

            <p className="text-xs text-[#7D756C] dark:text-[#9E958B] mt-0.5">
              {selectedProfile.handle} · Member since {selectedProfile.joinedYear}
            </p>

            <p className="font-heading font-medium text-fluid-h4 text-[#211F1D] dark:text-[#E9E2D9] mt-2">
              {selectedProfile.headline}
            </p>

            <div className="flex items-center gap-3 text-xs text-[#7D756C] dark:text-[#9E958B] mt-2">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#78917C]" />
                {selectedProfile.location}
              </span>
              <span>·</span>
              <span>{selectedProfile.followersCount} Connections</span>
              <span>·</span>
              <span>{selectedProfile.followingCount} Following</span>
            </div>
          </div>

          {/* Belonging Note: "You belong before you achieve" */}
          {selectedProfile.belongingNote && (
            <div className="p-3.5 rounded-xl bg-[#F47736]/8 dark:bg-[#F47736]/10 border border-[#F47736]/20 flex items-start gap-3">
              <HeartHandshake className="w-5 h-5 text-[#F47736] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-[#F47736] block">
                  Grounding Philosophy
                </span>
                <p className="text-xs sm:text-sm text-[#211F1D] dark:text-[#F7F4EF] italic mt-0.5">
                  “{selectedProfile.belongingNote}”
                </p>
              </div>
            </div>
          )}

          {/* Bio */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B] mb-1.5">
              Story & Background
            </h3>
            <p className="text-xs sm:text-sm text-[#3E3A35] dark:text-[#D1C9BE] leading-relaxed whitespace-pre-line">
              {selectedProfile.bio}
            </p>
          </div>

          {/* Currently Working On */}
          {selectedProfile.currentlyWorkingOn && (
            <div className="p-4 rounded-xl bg-white dark:bg-[#2A2724] border border-[#E9E2D9] dark:border-[#38332F]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#78917C] dark:text-[#95AF99] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Currently Crafting & Exploring</span>
              </div>
              <p className="text-xs sm:text-sm text-[#211F1D] dark:text-[#F7F4EF]">
                {selectedProfile.currentlyWorkingOn}
              </p>
            </div>
          )}

          {/* Skills & Crafts */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B] mb-2">
              Practiced Crafts & Practical Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedProfile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#2C2926] text-[#211F1D] dark:text-[#F7F4EF] border border-[#E9E2D9] dark:border-[#38332F]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* What I'm Curious About */}
          {selectedProfile.curiousAbout && selectedProfile.curiousAbout.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Compass className="w-3.5 h-3.5 text-[#F47736]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B]">
                  Curiosities & What I Want to Learn
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedProfile.curiousAbout.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-[#78917C]/10 dark:bg-[#78917C]/20 text-[#4D6451] dark:text-[#A7C2AB]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Core Values */}
          {selectedProfile.values && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B] mb-2">
                Guiding Human Values
              </h3>
              <div className="flex flex-wrap gap-2 text-xs text-[#5B554E] dark:text-[#B3ABA0]">
                {selectedProfile.values.map((v, i) => (
                  <React.Fragment key={v}>
                    <span>{v}</span>
                    {i < selectedProfile.values.length - 1 && <span aria-hidden="true">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
