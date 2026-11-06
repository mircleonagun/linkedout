import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Sparkles,
  HeartHandshake,
  Edit3,
  Award,
  Compass,
  Check,
  Repeat2,
  Users
} from 'lucide-react';
import { SAMPLE_USERS, CURRENT_USER } from '../data/sampleData';
import { Avatar } from '../components/common/Avatar';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    posts,
    circles,
    showToast,
    setCurrentScreen,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'stories' | 'crafts' | 'circles'>('stories');

  // Edit form state
  const [editName, setEditName] = useState(currentUser.name);
  const [editHeadline, setEditHeadline] = useState(currentUser.headline);
  const [editBelonging, setEditBelonging] = useState(currentUser.belongingNote || '');
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editLocation, setEditLocation] = useState(currentUser.location);
  const [editWorkingOn, setEditWorkingOn] = useState(currentUser.currentlyWorkingOn || '');

  const userPosts = posts.filter((p) => p.author.id === currentUser.id);
  const joinedCircles = circles.filter((c) => c.isJoined);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: editName,
      headline: editHeadline,
      belongingNote: editBelonging,
      bio: editBio,
      location: editLocation,
      currentlyWorkingOn: editWorkingOn,
    });
    setIsEditing(false);
  };

  const handleSwitchPersona = (userToSwitch: typeof currentUser) => {
    updateCurrentUser({
      ...userToSwitch,
      id: CURRENT_USER.id, // keep identity root
    });
    setEditName(userToSwitch.name);
    setEditHeadline(userToSwitch.headline);
    setEditBelonging(userToSwitch.belongingNote || '');
    setEditBio(userToSwitch.bio);
    setEditLocation(userToSwitch.location);
    setEditWorkingOn(userToSwitch.currentlyWorkingOn || '');
    showToast(`Switched active view persona to ${userToSwitch.name}`, 'warm');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      
      {/* Profile Card Header */}
      <div className="bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-[#F47736]/25 via-[#78917C]/25 to-[#E9E2D9] dark:from-[#F47736]/15 dark:via-[#78917C]/15 dark:to-[#211F1D] relative p-4 flex justify-between items-start">
          <div className="px-2.5 py-1 rounded-lg bg-black/50 text-white backdrop-blur-sm text-xs font-semibold tracking-wide">
            {currentUser.role}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentScreen('onboarding')}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-black/70 hover:bg-white text-xs font-semibold text-[#78917C] dark:text-[#95AF99] flex items-center gap-1.5 shadow-sm transition-colors active:scale-98"
              title="Re-run craft interests onboarding"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Onboarding</span>
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-black/70 hover:bg-white text-xs font-semibold text-[#211F1D] dark:text-white flex items-center gap-1.5 shadow-sm transition-colors active:scale-98"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#F47736]" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 sm:p-6 -mt-16 sm:-mt-18 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="relative">
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                className="w-22 h-22 sm:w-24 sm:h-24 rounded-2xl border-4 border-white dark:border-[#25221F] shadow-md"
              />
              <span className="absolute bottom-1 right-1 text-xl drop-shadow">
                {currentUser.countryFlag}
              </span>
            </div>

            {/* Persona Quick Switcher (Prototyping helper) */}
            <div className="flex items-center gap-1.5 p-1.5 bg-[#F7F4EF] dark:bg-[#1C1A18] rounded-xl border border-[#E9E2D9] dark:border-[#332F2B] overflow-x-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D756C] px-1 shrink-0">
                Persona:
              </span>
              {[CURRENT_USER, ...SAMPLE_USERS.slice(0, 3)].map((persona) => {
                const isSelected = currentUser.name === persona.name;
                return (
                  <button
                    key={persona.handle}
                    onClick={() => handleSwitchPersona(persona)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-[#F47736] text-white'
                        : 'text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D]'
                    }`}
                  >
                    {persona.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details or Edit Form */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1A1817] text-[#211F1D] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1A1817] text-[#211F1D] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1A1817] text-[#211F1D] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                  Belonging Statement (“You belong before you achieve”)
                </label>
                <input
                  type="text"
                  value={editBelonging}
                  onChange={(e) => setEditBelonging(e.target.value)}
                  placeholder="e.g. Taking space before figuring it all out..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1A1817] text-[#211F1D] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                  Story & Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1A1817] text-[#211F1D] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                  Currently Crafting / Working On
                </label>
                <input
                  type="text"
                  value={editWorkingOn}
                  onChange={(e) => setEditWorkingOn(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1A1817] text-[#211F1D] dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-medium text-[#7D756C] dark:text-[#B3ABA0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading font-extrabold text-fluid-h1 text-[#211F1D] dark:text-[#F7F4EF]">
                    {currentUser.name}
                  </h1>
                  {currentUser.verifiedCraft && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#F47736]">
                      <Award className="w-3.5 h-3.5" />
                      <span>{currentUser.verifiedCraft}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#7D756C] dark:text-[#9E958B] mt-0.5">
                  {currentUser.handle} · Member since {currentUser.joinedYear}
                </p>

                <p className="font-heading font-medium text-fluid-h4 text-[#211F1D] dark:text-[#E9E2D9] mt-2">
                  {currentUser.headline}
                </p>

                <div className="flex items-center gap-3 text-xs text-[#7D756C] dark:text-[#9E958B] mt-2">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#78917C]" />
                    {currentUser.location}
                  </span>
                  <span>·</span>
                  <span>{currentUser.followersCount} Connections</span>
                  <span>·</span>
                  <span>{currentUser.followingCount} Following</span>
                </div>
              </div>

              {/* Belonging Philosophy */}
              {currentUser.belongingNote && (
                <div className="p-3.5 rounded-xl bg-[#F47736]/8 dark:bg-[#F47736]/10 border border-[#F47736]/20 flex items-start gap-3">
                  <HeartHandshake className="w-5 h-5 text-[#F47736] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#F47736] block">
                      Grounding Philosophy
                    </span>
                    <p className="text-xs sm:text-sm text-[#211F1D] dark:text-[#F7F4EF] italic mt-0.5">
                      “{currentUser.belongingNote}”
                    </p>
                  </div>
                </div>
              )}

              {/* Bio */}
              <p className="text-xs sm:text-sm text-[#3E3A35] dark:text-[#D1C9BE] leading-relaxed">
                {currentUser.bio}
              </p>

              {/* Currently Crafting */}
              {currentUser.currentlyWorkingOn && (
                <div className="p-4 rounded-xl bg-[#F7F4EF] dark:bg-[#1C1A18] border border-[#E9E2D9] dark:border-[#38332F]">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#78917C] dark:text-[#95AF99] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Currently Working On</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#211F1D] dark:text-[#F7F4EF]">
                    {currentUser.currentlyWorkingOn}
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Tabs: My Stories / Crafts & Skills / Joined Circles */}
      <div className="flex items-center gap-1.5 border-b border-[#E9E2D9] dark:border-[#332F2B] pb-2">
        <button
          onClick={() => setActiveTab('stories')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'stories'
              ? 'bg-[#F47736] text-white shadow-sm'
              : 'text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D]'
          }`}
        >
          My Lounge Stories ({userPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('crafts')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'crafts'
              ? 'bg-[#F47736] text-white shadow-sm'
              : 'text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D]'
          }`}
        >
          Crafts & Curiosities
        </button>
        <button
          onClick={() => setActiveTab('circles')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'circles'
              ? 'bg-[#F47736] text-white shadow-sm'
              : 'text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D]'
          }`}
        >
          Joined Circles ({joinedCircles.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'stories' && (
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#25221F] rounded-2xl border border-[#E9E2D9] dark:border-[#332F2B] text-sm text-[#7D756C] dark:text-[#9E958B]">
              You haven't posted in The Lounge yet. Share your first craft or reflection!
            </div>
          ) : (
            userPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#332F2B] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F47736]">
                    {post.mood}
                  </span>
                  <span className="text-xs text-[#7D756C] dark:text-[#9E958B]">
                    {post.createdAt}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#211F1D] dark:text-[#E9E2D9] leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post media"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                )}
                <div className="flex items-center gap-4 text-xs text-[#7D756C] dark:text-[#9E958B] pt-2 border-t border-[#E9E2D9]/70 dark:border-[#332F2B]">
                  <span>{post.cheersCount} Cheers</span>
                  <span>{post.comments.length} Reflections</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'crafts' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#332F2B] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B]">
              Practiced Crafts & Practical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentUser.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#E9E2D9]/40 dark:bg-[#2C2926] text-[#211F1D] dark:text-[#F7F4EF] border border-[#E9E2D9] dark:border-[#38332F]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B]">
              <Compass className="w-3.5 h-3.5 text-[#F47736]" />
              <span>What I am Curious to Learn Next</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentUser.curiousAbout.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#78917C]/10 dark:bg-[#78917C]/20 text-[#4D6451] dark:text-[#A7C2AB]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B]">
              Guiding Human Values
            </h3>
            <div className="flex flex-wrap gap-2 text-xs text-[#5B554E] dark:text-[#B3ABA0]">
              {currentUser.values.map((v, i) => (
                <span key={v} className="px-2.5 py-1 rounded bg-[#F7F4EF] dark:bg-[#1C1A18]">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'circles' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {joinedCircles.map((circle) => (
            <div
              key={circle.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] space-y-1"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#F47736]">
                {circle.category}
              </span>
              <h4 className="font-heading font-bold text-sm text-[#211F1D] dark:text-[#F7F4EF]">
                {circle.name}
              </h4>
              <p className="text-xs text-[#7D756C] dark:text-[#9E958B] line-clamp-1">
                {circle.tagline}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
