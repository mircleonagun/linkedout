import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Repeat2,
  MessageCircle,
  Share2,
  Sparkles,
  Send,
  PlusCircle,
  MapPin,
  DoorOpen,
  Moon,
  Users2,
  Check,
  ArrowRight,
  Calendar,
  Clock,
  DollarSign
} from 'lucide-react';
import { Post, PostMood } from '../types';
import { Avatar } from '../components/common/Avatar';

export const LoungeScreen: React.FC = () => {
  const {
    posts,
    toggleCheerPost,
    toggleResonatePost,
    addComment,
    openProfile,
    setCreatePostOpen,
    currentUser,
    allUsers,
    showToast,
    opportunities,
    toggleApplyOpportunity,
    events,
    toggleRsvpEvent,
    circles,
    openCircle,
    toggleJoinCircle,
    setCurrentScreen,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | PostMood>('all');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    post_1: true,
  });
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const filterOptions: { id: 'all' | PostMood; label: string }[] = [
    { id: 'all', label: 'All Stories' },
    { id: 'Showcasing a Craft', label: 'Crafts & Trades' },
    { id: 'Celebrating Progress', label: 'Wins & Progress' },
    { id: 'Life & Musings', label: 'Reflections' },
    { id: 'Open to Collaborate', label: 'Collaborations' },
    { id: 'Apprenticeship & Learning', label: 'Apprenticeship' },
  ];

  const filteredPosts =
    activeFilter === 'all'
      ? posts
      : posts.filter((p) => p.mood === activeFilter);

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (text && text.trim()) {
      addComment(postId, text);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      setExpandedComments((prev) => ({ ...prev, [postId]: true }));
    }
  };

  const featuredOpportunity = opportunities[0];
  const featuredEvent = events[0];
  const spotlightCircles = circles.slice(0, 2);

  return (
    <div className="w-full max-w-6xl mx-auto px-1.5 xs:px-2.5 sm:px-4 py-3 sm:py-6 min-w-0">
      
      {/* Responsive Grid: Feed Container (Cols 1-7 or 1-8) & Associated Sidebar Widgets (Cols 8-12 or 9-12) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-start w-full min-w-0">
        
        {/* Main Feed Column */}
        <section className="md:col-span-7 lg:col-span-8 space-y-4 sm:space-y-5 min-w-0 w-full" aria-label="Social Feed">
          
          {/* Human Manifesto Greeting */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#332F2B] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-heading font-extrabold text-fluid-h2 text-[#211F1D] dark:text-[#F7F4EF]">
                    The Lounge
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-md bg-[#78917C]/10 dark:bg-[#78917C]/20 text-[#4D6451] dark:text-[#A7C2AB]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#78917C] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#78917C]" />
                    </span>
                    <span className="text-[11px] font-semibold tracking-wide">
                      Live Feed
                    </span>
                  </div>
                </div>
                <p className="text-fluid-sub text-[#7D756C] dark:text-[#B3ABA0] mt-1 leading-relaxed">
                  “People first. Possibilities everywhere.” You belong before you achieve.
                </p>
              </div>

              <button
                onClick={() => setCreatePostOpen(true)}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-[#F47736]/20 shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Share Story</span>
              </button>
            </div>
          </div>

          {/* Onboarding & Welcome Quick-Access Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F47736]/10 via-[#F7F4EF] to-[#78917C]/10 dark:from-[#F47736]/15 dark:via-[#211F1D] dark:to-[#78917C]/15 border border-[#F47736]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F47736] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-heading font-bold text-xs sm:text-sm text-[#211F1D] dark:text-white block">
                  New to LinkedOut or want to personalize your craft feed?
                </span>
                <p className="text-xs text-[#5B554E] dark:text-[#B3ABA0] leading-snug">
                  Explore our 3-step Onboarding walkthrough or sign in to switch craft personas.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => setCurrentScreen('onboarding')}
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <span>Start Onboarding</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentScreen('welcome')}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white dark:bg-[#2A2724] border border-[#E9E2D9] dark:border-[#38332F] text-xs font-semibold text-[#211F1D] dark:text-white hover:border-[#F47736] transition-colors"
              >
                Log In / Register
              </button>
            </div>
          </div>

          {/* Community Moments (Horizontal Carousel) */}
          <div className="space-y-1.5 sm:space-y-2 w-full min-w-0">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B]">
                Community Moments
              </span>
              <span className="text-[11px] text-[#78917C] dark:text-[#95AF99]">
                Makers worldwide
              </span>
            </div>

            <div className="w-full min-w-0 flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-1 overscroll-x-contain">
              {/* User's own moment starter */}
              <button
                onClick={() => setCreatePostOpen(true)}
                className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none min-w-[60px]"
              >
                <div className="relative w-15 h-15 sm:w-17 sm:h-17 rounded-2xl p-0.5 border-2 border-dashed border-[#F47736] flex items-center justify-center bg-white dark:bg-[#25221F] group-hover:bg-[#F47736]/10 transition-colors">
                  <Avatar
                    src={currentUser.avatar}
                    name={currentUser.name}
                    className="w-full h-full rounded-xl opacity-85"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#F47736] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    +
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#211F1D] dark:text-[#F7F4EF] truncate w-15 sm:w-17 text-center">
                  Your Story
                </span>
              </button>

              {/* Other community members */}
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => openProfile(user)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none min-w-[60px]"
                >
                  <div className="relative w-15 h-15 sm:w-17 sm:h-17 rounded-2xl p-0.5 border-2 border-[#78917C]/40 hover:border-[#F47736] transition-colors bg-white dark:bg-[#25221F]">
                    <Avatar
                      src={user.avatar}
                      name={user.name}
                      className="w-full h-full rounded-xl"
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs">
                      {user.countryFlag}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#5B554E] dark:text-[#B3ABA0] group-hover:text-[#F47736] truncate w-15 sm:w-17 text-center transition-colors">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="w-full min-w-0 flex items-center gap-1.5 overflow-x-auto pb-1.5 overscroll-x-contain">
            {filterOptions.map((opt) => {
              const isActive = activeFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveFilter(opt.id)}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#211F1D] text-white dark:bg-[#F7F4EF] dark:text-[#211F1D] shadow-sm'
                      : 'bg-white dark:bg-[#25221F] text-[#5B554E] dark:text-[#B3ABA0] border border-[#E9E2D9] dark:border-[#332F2B] hover:text-[#211F1D] dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Feed Post List */}
          <div className="space-y-4 sm:space-y-5 w-full min-w-0">
            {filteredPosts.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#25221F] rounded-2xl sm:rounded-3xl border border-[#E9E2D9] dark:border-[#332F2B] text-sm text-[#7D756C] dark:text-[#9E958B]">
                No stories matching this filter yet. Be the first to share one!
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isCommentsOpen = !!expandedComments[post.id];
                const currentCommentText = commentInputs[post.id] || '';

                return (
                  <article
                    key={post.id}
                    className="bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#332F2B] rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden transition-all duration-200 w-full min-w-0"
                  >
                    {/* Post Header */}
                    <div className="p-3.5 sm:p-5 pb-2.5 sm:pb-3 flex flex-col xs:flex-row xs:items-start justify-between gap-2.5 sm:gap-3">
                      <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => openProfile(post.author)}
                          className="relative shrink-0 focus:outline-none group min-h-[44px] min-w-[44px] flex items-center justify-center"
                          aria-label={`View ${post.author.name}'s profile`}
                        >
                          <Avatar
                            src={post.author.avatar}
                            name={post.author.name}
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute -bottom-1 -right-1 text-xs">
                            {post.author.countryFlag}
                          </span>
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <button
                              onClick={() => openProfile(post.author)}
                              className="font-heading font-bold text-fluid-h4 text-[#211F1D] dark:text-[#F7F4EF] hover:text-[#F47736] text-left transition-colors truncate max-w-full"
                            >
                              {post.author.name}
                            </button>
                            <span className="text-[11px] sm:text-xs text-[#78917C] dark:text-[#95AF99] truncate">
                              {post.author.verifiedCraft || post.author.role}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-[#7D756C] dark:text-[#9E958B] mt-0.5">
                            <span>{post.author.location}</span>
                            <span aria-hidden="true">·</span>
                            <span>{post.createdAt}</span>
                            {post.circleName && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-[#F47736] font-medium truncate max-w-[140px] sm:max-w-none">
                                  in {post.circleName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Mood Tag */}
                      <div className="shrink-0 self-start xs:self-auto pl-13 xs:pl-0">
                        <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#E9E2D9]/50 dark:bg-[#2E2B27] text-[#5B554E] dark:text-[#B3ABA0] whitespace-nowrap">
                          {post.mood}
                        </span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="px-3.5 sm:px-5 pb-3">
                      <p className="text-fluid-body text-[#211F1D] dark:text-[#E9E2D9] leading-relaxed whitespace-pre-line break-words">
                        {post.content}
                      </p>

                      {/* Topic Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5 sm:mt-3">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] font-medium text-[#78917C] dark:text-[#95AF99]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Image Asset */}
                    {post.image && (
                      <div className="w-full max-h-[300px] sm:max-h-[460px] overflow-hidden bg-[#1A1817]">
                        <img
                          src={post.image}
                          alt={post.imageAlt || 'Post photography'}
                          className="w-full h-auto object-cover max-h-[300px] sm:max-h-[460px] hover:scale-[1.01] transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Post Interaction Bar (Cheers, Resonate, Comments, Share) */}
                    <div className="px-3 sm:px-5 py-2 sm:py-2.5 border-t border-[#E9E2D9]/80 dark:border-[#332F2B] flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 xs:gap-3 sm:gap-6 min-w-0">
                        {/* Cheers Button */}
                        <button
                          onClick={() => toggleCheerPost(post.id)}
                          className={`min-h-[40px] px-1.5 xs:px-2 py-1 rounded-lg flex items-center gap-1 sm:gap-1.5 transition-colors ${
                            post.isCheered
                              ? 'text-[#F47736] font-semibold bg-[#F47736]/10'
                              : 'text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#F47736]'
                          }`}
                          aria-label="Cheer post"
                        >
                          <Heart
                            className={`w-4 h-4 shrink-0 ${
                              post.isCheered ? 'fill-[#F47736] text-[#F47736]' : ''
                            }`}
                          />
                          <span className="hidden xs:inline">Cheers</span>
                          <span className="font-mono tabular-nums text-[11px] sm:text-xs">
                            ({post.cheersCount})
                          </span>
                        </button>

                        {/* Resonate Button */}
                        <button
                          onClick={() => toggleResonatePost(post.id)}
                          className={`min-h-[40px] px-1.5 xs:px-2 py-1 rounded-lg flex items-center gap-1 sm:gap-1.5 transition-colors ${
                            post.isResonated
                              ? 'text-[#78917C] dark:text-[#95AF99] font-semibold bg-[#78917C]/10'
                              : 'text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#78917C]'
                          }`}
                          aria-label="Resonate post"
                        >
                          <Repeat2 className="w-4 h-4 shrink-0" />
                          <span className="hidden xs:inline">Resonate</span>
                          <span className="font-mono tabular-nums text-[11px] sm:text-xs">
                            ({post.resonatesCount})
                          </span>
                        </button>

                        {/* Comments Toggle */}
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="min-h-[40px] px-1.5 xs:px-2 py-1 rounded-lg flex items-center gap-1 sm:gap-1.5 text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white transition-colors"
                          aria-label="View reflections"
                        >
                          <MessageCircle className="w-4 h-4 shrink-0" />
                          <span className="hidden xs:inline">Reflections</span>
                          <span className="font-mono tabular-nums text-[11px] sm:text-xs">
                            ({post.comments.length})
                          </span>
                        </button>
                      </div>

                      <button
                        onClick={() => showToast('Story link copied to clipboard', 'warm')}
                        className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-[#7D756C] dark:text-[#9E958B] hover:text-[#211F1D] dark:hover:text-white shrink-0"
                        title="Share Story"
                        aria-label="Share story"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Comments Section */}
                    {isCommentsOpen && (
                      <div className="bg-[#F7F4EF]/50 dark:bg-[#1E1C1A] border-t border-[#E9E2D9] dark:border-[#332F2B] p-3 sm:p-5 space-y-2.5 sm:space-y-3">
                        
                        {/* Existing Comments */}
                        {post.comments.length > 0 ? (
                          <div className="space-y-2">
                            {post.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] text-xs sm:text-sm space-y-1"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Avatar
                                      src={comment.authorAvatar}
                                      name={comment.authorName}
                                      className="w-6 h-6 rounded-md shrink-0"
                                    />
                                    <span className="font-heading font-semibold text-[#211F1D] dark:text-[#F7F4EF] truncate">
                                      {comment.authorName}
                                    </span>
                                    <span className="text-[10px] sm:text-[11px] text-[#78917C] dark:text-[#95AF99] truncate hidden xs:inline">
                                      {comment.authorRole}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-[#7D756C] dark:text-[#9E958B] shrink-0 font-mono">
                                    {comment.createdAt}
                                  </span>
                                </div>
                                <p className="text-[#3E3A35] dark:text-[#D1C9BE] pl-8 break-words text-[12px] sm:text-xs">
                                  {comment.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#7D756C] dark:text-[#9E958B] italic">
                            No reflections yet. Add a kind thought or craft insight below.
                          </p>
                        )}

                        {/* Inline Comment Composer */}
                        <form
                          onSubmit={(e) => handleCommentSubmit(post.id, e)}
                          className="flex items-center gap-2 pt-1 w-full min-w-0"
                        >
                          <Avatar
                            src={currentUser.avatar}
                            name={currentUser.name}
                            className="w-7 h-7 rounded-lg shrink-0 hidden xs:block"
                          />
                          <input
                            type="text"
                            value={currentCommentText}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            placeholder="Add a reflection or question..."
                            className="flex-1 min-w-0 px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white placeholder-[#9E958B] focus:outline-none focus:border-[#F47736] min-h-[40px]"
                          />
                          <button
                            type="submit"
                            disabled={!currentCommentText.trim()}
                            className="min-h-[40px] min-w-[40px] rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center justify-center shadow-sm"
                            aria-label="Send reflection"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>

                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>

        </section>

        {/* Associated Companion Sidebar Widgets Column (Adjusts dynamically across mobile, tablet, and desktop) */}
        <aside className="md:col-span-5 lg:col-span-4 space-y-4 min-w-0 w-full md:sticky md:top-20" aria-label="Community Highlights">
          
          {/* Widget 1: Door of the Day (Open Doors Highlight) */}
          {featuredOpportunity && (
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#F47736]">
                  <DoorOpen className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Door of the Day
                  </span>
                </div>
                <button
                  onClick={() => setCurrentScreen('opendoors')}
                  className="text-xs font-semibold text-[#7D756C] hover:text-[#F47736] transition-colors"
                >
                  All ({opportunities.length})
                </button>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78917C] dark:text-[#95AF99]">
                  {featuredOpportunity.type}
                </span>
                <h4 className="font-heading font-bold text-sm text-[#211F1D] dark:text-[#F7F4EF] mt-0.5 line-clamp-2">
                  {featuredOpportunity.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-[#7D756C] dark:text-[#9E958B] mt-1.5">
                  <Avatar
                    src={featuredOpportunity.creator.avatar}
                    name={featuredOpportunity.creator.name}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="truncate">{featuredOpportunity.creator.name}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F7F4EF] dark:bg-[#1C1A18] border border-[#E9E2D9] dark:border-[#332F2B] text-xs font-semibold text-[#3D5240] dark:text-[#A7C2AB] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{featuredOpportunity.compensation}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => toggleApplyOpportunity(featuredOpportunity.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                    featuredOpportunity.hasApplied
                      ? 'bg-[#78917C]/20 text-[#3D5240] dark:text-[#A7C2AB] border border-[#78917C]/40'
                      : 'bg-[#F47736] hover:bg-[#E06524] text-white'
                  }`}
                >
                  {featuredOpportunity.hasApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Knocked</span>
                    </>
                  ) : (
                    <>
                      <span>Knock on Door</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCurrentScreen('opendoors')}
                  className="px-3 py-2 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-white dark:bg-[#25221F] text-xs font-medium text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white"
                >
                  Details
                </button>
              </div>
            </div>
          )}

          {/* Widget 2: Upcoming After Hours Gathering */}
          {featuredEvent && (
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#78917C] dark:text-[#95AF99]">
                  <Moon className="w-4 h-4 text-[#F47736]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    After Hours Tonight
                  </span>
                </div>
                <button
                  onClick={() => setCurrentScreen('afterhours')}
                  className="text-xs font-semibold text-[#7D756C] hover:text-[#F47736] transition-colors"
                >
                  Events ({events.length})
                </button>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#F47736]">
                  {featuredEvent.category}
                </span>
                <h4 className="font-heading font-bold text-sm text-[#211F1D] dark:text-[#F7F4EF] mt-0.5 line-clamp-1">
                  {featuredEvent.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#7D756C] dark:text-[#9E958B] mt-1">
                  <Calendar className="w-3.5 h-3.5 text-[#F47736]" />
                  <span>{featuredEvent.date}</span>
                  <span>·</span>
                  <Clock className="w-3.5 h-3.5 text-[#78917C]" />
                  <span>{featuredEvent.time}</span>
                </div>
              </div>

              <button
                onClick={() => toggleRsvpEvent(featuredEvent.id)}
                className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                  featuredEvent.hasRsvpd
                    ? 'bg-[#78917C]/20 text-[#3D5240] dark:text-[#A7C2AB] border border-[#78917C]/40'
                    : 'bg-[#F47736]/10 hover:bg-[#F47736]/20 text-[#F47736] border border-[#F47736]/30'
                }`}
              >
                {featuredEvent.hasRsvpd ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Attending ({featuredEvent.attendeesCount})</span>
                  </>
                ) : (
                  <>
                    <span>RSVP Gathering ({featuredEvent.attendeesCount})</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Widget 3: Guilds & Circles Spotlight */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#211F1D] dark:text-[#F7F4EF]">
                <Users2 className="w-4 h-4 text-[#F47736]" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Community Guilds
                </span>
              </div>
              <button
                onClick={() => setCurrentScreen('circles')}
                className="text-xs font-semibold text-[#7D756C] hover:text-[#F47736] transition-colors"
              >
                Explore All
              </button>
            </div>

            <div className="space-y-2.5">
              {spotlightCircles.map((circle) => (
                <div
                  key={circle.id}
                  className="p-2.5 rounded-xl bg-[#F7F4EF]/60 dark:bg-[#1E1C1A] border border-[#E9E2D9] dark:border-[#332F2B] flex items-center justify-between gap-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#F47736] block">
                      {circle.category}
                    </span>
                    <button
                      onClick={() => openCircle(circle)}
                      className="font-heading font-bold text-xs text-[#211F1D] dark:text-[#F7F4EF] hover:text-[#F47736] text-left transition-colors truncate block max-w-full"
                    >
                      {circle.name}
                    </button>
                    <span className="text-[10px] text-[#7D756C] dark:text-[#9E958B]">
                      {circle.membersCount.toLocaleString()} members
                    </span>
                  </div>

                  <button
                    onClick={() => toggleJoinCircle(circle.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                      circle.isJoined
                        ? 'bg-[#78917C]/20 text-[#3D5240] dark:text-[#A7C2AB]'
                        : 'bg-[#F47736] text-white hover:bg-[#E06524]'
                    }`}
                  >
                    {circle.isJoined ? 'Joined' : 'Join'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 4: Grounding Values Pledge */}
          <div className="p-4 rounded-2xl bg-[#78917C]/10 dark:bg-[#78917C]/15 border border-[#78917C]/25 text-xs text-[#3E5343] dark:text-[#A7C2AB] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
              <Sparkles className="w-3.5 h-3.5 text-[#F47736]" />
              <span>Grounding Promise</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              LinkedOut is free from resume posturing. Whether learning your first weld or baking sourdough, you belong here today.
            </p>
          </div>

        </aside>

      </div>

    </div>
  );
};
