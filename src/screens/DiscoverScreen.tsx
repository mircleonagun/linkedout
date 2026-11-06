import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, UserPlus, UserCheck, MessageCircle, Award, Compass, Filter } from 'lucide-react';
import { UserRole } from '../types';
import { Avatar } from '../components/common/Avatar';

export const DiscoverScreen: React.FC = () => {
  const {
    allUsers,
    openProfile,
    toggleFollowUser,
    startConversationWithUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'All' | UserRole>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  const roleOptions: ('All' | UserRole)[] = [
    'All',
    'Skilled Trades',
    'Creator & Artist',
    'Student & Learner',
    'Everyday Human',
    'Caregiver & Educator',
  ];

  const uniqueCountries = ['All', ...Array.from(new Set(allUsers.map((u) => u.country)))];

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    const matchesCountry = selectedCountry === 'All' || user.country === selectedCountry;

    return matchesSearch && matchesRole && matchesCountry;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      
      {/* Title & Human Vision */}
      <div>
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#F47736]" />
          <h1 className="font-heading font-extrabold text-fluid-h1 text-[#211F1D] dark:text-[#F7F4EF]">
            Discover People
          </h1>
        </div>
        <p className="text-fluid-sub text-[#7D756C] dark:text-[#B3ABA0] mt-1">
          Connect with real makers, trades, learners, and everyday creators across the globe. No corporate hierarchy.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#7D756C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, craft, skill (e.g. Pottery, Solar, Rust, Weaving)..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] text-xs sm:text-sm text-[#211F1D] dark:text-white placeholder-[#9E958B] focus:outline-none focus:ring-2 focus:ring-[#F47736]/30 focus:border-[#F47736] transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7D756C] hover:text-[#211F1D] dark:hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filters: Role & Country */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-[#7D756C] dark:text-[#9E958B] font-semibold uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter by Calling / Role:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {roleOptions.map((role) => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#F47736] text-white shadow-sm'
                    : 'bg-white dark:bg-[#25221F] text-[#5B554E] dark:text-[#B3ABA0] border border-[#E9E2D9] dark:border-[#332F2B] hover:text-[#211F1D] dark:hover:text-white'
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>

        {/* Country Filter dropdown */}
        <div className="flex items-center gap-2 pt-1 text-xs text-[#7D756C] dark:text-[#9E958B]">
          <span>Location:</span>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#332F2B] text-[#211F1D] dark:text-white focus:outline-none"
          >
            {uniqueCountries.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? '🌍 Everywhere (All Countries)' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white dark:bg-[#25221F] rounded-2xl border border-[#E9E2D9] dark:border-[#332F2B] text-sm text-[#7D756C] dark:text-[#9E958B]">
            No members found matching your search. Try adjusting the filter.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#332F2B] shadow-sm flex flex-col justify-between hover:border-[#F47736]/40 transition-all duration-200"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => openProfile(user)}
                      className="relative shrink-0 focus:outline-none group min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Avatar
                        src={user.avatar}
                        name={user.name}
                        className="w-13 h-13 rounded-2xl border border-[#E9E2D9] dark:border-[#38332F] group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute -bottom-1 -right-1 text-xs">
                        {user.countryFlag}
                      </span>
                    </button>

                    <div>
                      <button
                        onClick={() => openProfile(user)}
                        className="font-heading font-bold text-sm sm:text-base text-[#211F1D] dark:text-[#F7F4EF] hover:text-[#F47736] text-left transition-colors"
                      >
                        {user.name}
                      </button>
                      
                      <div className="flex items-center gap-1.5 text-xs text-[#78917C] dark:text-[#95AF99]">
                        <span>{user.role}</span>
                        {user.verifiedCraft && (
                          <>
                            <span>·</span>
                            <span className="text-[#F47736] font-medium flex items-center gap-0.5">
                              <Award className="w-3 h-3" />
                              {user.verifiedCraft}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-[#7D756C] dark:text-[#9E958B] mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{user.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Headline & Belonging Quote */}
                <p className="text-xs sm:text-sm font-medium text-[#211F1D] dark:text-[#E9E2D9] mt-3 line-clamp-2">
                  {user.headline}
                </p>

                {user.belongingNote && (
                  <p className="text-[11px] italic text-[#78917C] dark:text-[#A7C2AB] mt-1.5 line-clamp-2">
                    “{user.belongingNote}”
                  </p>
                )}

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {user.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#E9E2D9]/40 dark:bg-[#2C2926] text-[#5B554E] dark:text-[#B3ABA0]"
                    >
                      {skill}
                    </span>
                  ))}
                  {user.skills.length > 3 && (
                    <span className="text-[11px] text-[#7D756C] dark:text-[#9E958B] self-center">
                      +{user.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-[#E9E2D9]/70 dark:border-[#332F2B] flex items-center justify-between gap-2">
                <button
                  onClick={() => openProfile(user)}
                  className="text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white"
                >
                  View Profile
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => startConversationWithUser(user)}
                    className="p-2 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-white dark:bg-[#2C2926] text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#F47736] hover:border-[#F47736] transition-colors"
                    title="Send Message"
                    aria-label={`Message ${user.name}`}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleFollowUser(user.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      user.isFollowing
                        ? 'bg-[#78917C]/15 dark:bg-[#78917C]/25 text-[#4D6451] dark:text-[#A7C2AB] border border-[#78917C]/30'
                        : 'bg-[#F47736] hover:bg-[#E06524] text-white shadow-sm'
                    }`}
                  >
                    {user.isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
