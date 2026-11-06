import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users2, Users, MessageSquare, Plus, Check, X, ArrowLeft } from 'lucide-react';
import { Circle } from '../types';

export const CirclesScreen: React.FC = () => {
  const { circles, openCircle, toggleJoinCircle, proposeCircle, navigateBack, getPreviousScreenLabel } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Crafts & Trades');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');

  const categories = [
    'All',
    'Crafts & Trades',
    'Trades & Infrastructure',
    'Life & Arts',
    'Community & Growth',
  ];

  const filteredCircles =
    selectedCategory === 'All'
      ? circles
      : circles.filter((c) => c.category === selectedCategory);

  const joinedCircles = circles.filter((c) => c.isJoined);

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    proposeCircle({
      name: name.trim(),
      category,
      tagline: tagline.trim() || 'A peer community for shared practice and learning.',
      description: description.trim() || 'A welcoming circle founded by members for honest craft exchange.',
      rules: [
        'Welcome all skill levels with patience.',
        'No pedigree or status hierarchy.',
        'Share what you learn openly.',
      ],
      moderators: ['Alex Rivera (Founder)'],
      recentTopic: 'Introductions & craft showcase',
      coverImage: '/src/assets/images/community_maker_space_1793790874470.jpg',
    });

    setName('');
    setTagline('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F47736]/15 text-[#F47736] flex items-center justify-center shrink-0">
              <Users2 className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-extrabold text-fluid-h1 text-[#211F1D] dark:text-[#F7F4EF]">
              Circles & Guilds
            </h1>
          </div>
          <p className="text-fluid-sub text-[#7D756C] dark:text-[#B3ABA0] mt-1.5 leading-relaxed">
            Interest spaces anchored by craft, shared curiosity, and genuine human warmth. No gatekeeping or corporate buzzwords.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto min-h-[44px] px-4 py-2 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-[#F47736]/20 shrink-0 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Propose a Circle</span>
        </button>
      </div>

      {/* Your Active Circles Strip */}
      {joinedCircles.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B]">
            Your Circles ({joinedCircles.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {joinedCircles.map((circle) => (
              <button
                key={circle.id}
                onClick={() => openCircle(circle)}
                className="p-4 rounded-2xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] text-left hover:border-[#F47736] transition-all flex items-center justify-between gap-3 group min-h-[64px]"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F47736] block">
                    {circle.category}
                  </span>
                  <h3 className="font-heading font-bold text-sm text-[#211F1D] dark:text-[#F7F4EF] group-hover:text-[#F47736] transition-colors truncate">
                    {circle.name}
                  </h3>
                  <span className="text-[11px] text-[#7D756C] dark:text-[#9E958B]">
                    {circle.membersCount.toLocaleString()} members
                  </span>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#78917C]/20 text-[#4D6451] dark:text-[#A7C2AB] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs (Segmented Control) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[40px] px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                isSelected
                  ? 'bg-[#211F1D] text-white dark:bg-[#F7F4EF] dark:text-[#211F1D] shadow-sm font-semibold'
                  : 'bg-white dark:bg-[#25221F] text-[#5B554E] dark:text-[#B3ABA0] border border-[#E9E2D9] dark:border-[#332F2B] hover:text-[#211F1D] dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCircles.map((circle) => (
          <article
            key={circle.id}
            className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm flex flex-col justify-between hover:border-[#F47736]/40 transition-all duration-200 space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F47736]">
                  {circle.category}
                </span>
                <span className="text-xs text-[#7D756C] dark:text-[#9E958B]">
                  {circle.membersCount.toLocaleString()} members
                </span>
              </div>

              <button
                onClick={() => openCircle(circle)}
                className="font-heading font-extrabold text-base sm:text-lg text-[#211F1D] dark:text-[#F7F4EF] hover:text-[#F47736] text-left transition-colors mt-1 block"
              >
                {circle.name}
              </button>

              <p className="text-xs font-medium text-[#78917C] dark:text-[#95AF99] mt-0.5">
                {circle.tagline}
              </p>

              <p className="text-xs sm:text-sm text-[#3E3A35] dark:text-[#D1C9BE] mt-2 line-clamp-2 leading-relaxed">
                {circle.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E9E2D9]/70 dark:border-[#332F2B] flex items-center justify-between gap-3">
              <button
                onClick={() => openCircle(circle)}
                className="min-h-[44px] text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>View Guidelines</span>
              </button>

              <button
                onClick={() => toggleJoinCircle(circle.id)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                  circle.isJoined
                    ? 'bg-[#78917C]/20 text-[#3D5240] dark:text-[#A7C2AB] border border-[#78917C]/40'
                    : 'bg-[#F47736] hover:bg-[#E06524] text-white'
                }`}
              >
                {circle.isJoined ? 'Joined Member' : 'Join Guild'}
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Propose Circle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#F7F4EF] dark:bg-[#211F1D] border border-[#E9E2D9] dark:border-[#38332F] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E2D9] dark:border-[#332F2B]">
              <div className="flex items-center gap-2">
                <Users2 className="w-5 h-5 text-[#F47736]" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#211F1D] dark:text-[#F7F4EF]">
                  Propose a New Circle or Guild
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#7D756C] hover:text-[#211F1D] dark:hover:text-white"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePropose} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                  Circle Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sourdough Fermentation & Heritage Grains"
                  className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white focus:outline-none"
                >
                  <option value="Crafts & Trades">Crafts & Trades</option>
                  <option value="Trades & Infrastructure">Trades & Infrastructure</option>
                  <option value="Life & Arts">Life & Arts</option>
                  <option value="Community & Growth">Community & Growth</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                  One-Line Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. For bakers, grain millers, and slow food enthusiasts"
                  className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                  Description & Community Culture
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What makes this community unique? What do you share and practice?"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E9E2D9] dark:border-[#332F2B]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 text-xs font-semibold text-[#7D756C] hover:text-[#211F1D] dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
                >
                  Found Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
