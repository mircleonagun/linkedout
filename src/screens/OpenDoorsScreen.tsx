import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DoorOpen, MapPin, DollarSign, BookOpen, Users, Check, ArrowRight, Plus, X, ArrowLeft } from 'lucide-react';
import { OpportunityType } from '../types';
import { Avatar } from '../components/common/Avatar';

export const OpenDoorsScreen: React.FC = () => {
  const {
    opportunities,
    toggleApplyOpportunity,
    addOpportunity,
    openProfile,
    navigateBack,
    getPreviousScreenLabel,
  } = useApp();

  const [activeType, setActiveType] = useState<'All' | OpportunityType>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<OpportunityType>('Apprenticeship');
  const [formComp, setFormComp] = useState('$24 - $30/hr');
  const [formLocation, setFormLocation] = useState('Austin, TX or Remote');
  const [formWho, setFormWho] = useState('');
  const [formLearn, setFormLearn] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const types: ('All' | OpportunityType)[] = [
    'All',
    'Apprenticeship',
    'Collaboration',
    'Freelance Gig',
    'Full-Time Role',
  ];

  const filteredOpportunities =
    activeType === 'All'
      ? opportunities
      : opportunities.filter((o) => o.type === activeType);

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    addOpportunity({
      title: formTitle.trim(),
      type: formType,
      organization: 'Independent Guild',
      compensation: formComp.trim() || 'Paid fair wage',
      location: formLocation.trim() || 'Community Local',
      isRemote: formLocation.toLowerCase().includes('remote'),
      description: formDesc.trim() || 'A hands-on opportunity focused on craftsmanship and mutual respect.',
      whoWeNeed: formWho.trim() || 'Curious makers and apprentices with dedication.',
      whatYouWillLearn: formLearn.trim() || 'Practical workshop techniques and real craft skills.',
      tags: ['Mentorship', formType],
    });

    setFormTitle('');
    setFormWho('');
    setFormLearn('');
    setFormDesc('');
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

      {/* Hero / Banner */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F47736]/15 text-[#F47736] flex items-center justify-center shrink-0">
                <DoorOpen className="w-5 h-5" />
              </div>
              <h1 className="font-heading font-extrabold text-fluid-h1 text-[#211F1D] dark:text-[#F7F4EF]">
                Open Doors
              </h1>
            </div>
            <p className="text-fluid-sub text-[#7D756C] dark:text-[#B3ABA0] mt-1.5 max-w-xl leading-relaxed">
              Authentic work opportunities, paid craft apprenticeships, and creative collaborations. No arbitrary 5-year experience gates for entry-level tasks.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-auto min-h-[44px] px-4 py-2 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-[#F47736]/20 shrink-0 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Post an Open Door</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs (Interactive Segmented Control) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {types.map((type) => {
          const isSelected = activeType === type;
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`min-h-[40px] px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                isSelected
                  ? 'bg-[#211F1D] text-white dark:bg-[#F7F4EF] dark:text-[#211F1D] shadow-sm font-semibold'
                  : 'bg-white dark:bg-[#25221F] text-[#5B554E] dark:text-[#B3ABA0] border border-[#E9E2D9] dark:border-[#332F2B] hover:text-[#211F1D] dark:hover:text-white'
              }`}
            >
              {type === 'All' ? 'All Doors' : type}
            </button>
          );
        })}
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#25221F] rounded-2xl border border-[#E9E2D9] dark:border-[#38332F] text-sm text-[#7D756C] dark:text-[#9E958B]">
            No open doors currently matching this category.
          </div>
        ) : (
          filteredOpportunities.map((opp) => (
            <article
              key={opp.id}
              className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm space-y-4 hover:border-[#F47736]/40 transition-all duration-200"
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold uppercase tracking-wider text-[#F47736]">
                      {opp.type}
                    </span>
                    <span className="text-[#7D756C] dark:text-[#9E958B]">
                      · Posted {opp.publishedAt}
                    </span>
                  </div>

                  <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#211F1D] dark:text-[#F7F4EF] mt-1">
                    {opp.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#7D756C] dark:text-[#9E958B] mt-1.5">
                    <button
                      onClick={() => openProfile(opp.creator)}
                      className="font-medium text-[#211F1D] dark:text-[#F7F4EF] hover:text-[#F47736] flex items-center gap-1.5 min-h-[36px]"
                    >
                      <Avatar
                        src={opp.creator.avatar}
                        name={opp.creator.name}
                        className="w-5 h-5 rounded-full"
                      />
                      <span>{opp.creator.name}</span>
                      {opp.organization && <span>({opp.organization})</span>}
                    </button>

                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#78917C]" />
                      <span>{opp.location}</span>
                    </span>
                  </div>
                </div>

                {/* Compensation highlight (Unboxed clean text) */}
                <div className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-[#78917C]/15 dark:bg-[#78917C]/25 text-[#3D5240] dark:text-[#A7C2AB] text-xs font-semibold flex items-center gap-1 shrink-0">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{opp.compensation}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#3E3A35] dark:text-[#D1C9BE] leading-relaxed">
                {opp.description}
              </p>

              {/* Details: Who we need / What you'll learn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-[#F7F4EF]/70 dark:bg-[#1E1C1A] border border-[#E9E2D9] dark:border-[#332F2B]">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                    <Users className="w-3.5 h-3.5 text-[#F47736]" />
                    <span>Who this is for</span>
                  </div>
                  <p className="text-xs text-[#211F1D] dark:text-[#F7F4EF] leading-relaxed">
                    {opp.whoWeNeed}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F7F4EF]/70 dark:bg-[#1E1C1A] border border-[#E9E2D9] dark:border-[#332F2B]">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#78917C]" />
                    <span>What you will learn</span>
                  </div>
                  <p className="text-xs text-[#211F1D] dark:text-[#F7F4EF] leading-relaxed">
                    {opp.whatYouWillLearn}
                  </p>
                </div>
              </div>

              {/* Tags and Action */}
              <div className="pt-2 border-t border-[#E9E2D9]/70 dark:border-[#332F2B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {opp.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-medium text-[#78917C] dark:text-[#95AF99]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[#7D756C] dark:text-[#9E958B]">
                    {opp.applicantCount} {opp.applicantCount === 1 ? 'person' : 'people'} knocked
                  </span>

                  <button
                    onClick={() => toggleApplyOpportunity(opp.id)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                      opp.hasApplied
                        ? 'bg-[#78917C]/20 text-[#3D5240] dark:text-[#A7C2AB] border border-[#78917C]/40'
                        : 'bg-[#F47736] hover:bg-[#E06524] text-white'
                    }`}
                  >
                    {opp.hasApplied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Knocked on Door</span>
                      </>
                    ) : (
                      <>
                        <span>Knock on Door</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

            </article>
          ))
        )}
      </div>

      {/* Post Open Door Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#F7F4EF] dark:bg-[#211F1D] border border-[#E9E2D9] dark:border-[#38332F] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E2D9] dark:border-[#332F2B]">
              <div className="flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-[#F47736]" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#211F1D] dark:text-[#F7F4EF]">
                  Open a Door for Someone
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

            <form onSubmit={handleCreateOpportunity} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                  Title of Role / Collaboration
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Apprentice Timber Framer or Sourdough Baker Co-Host"
                  className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                    Door Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as OpportunityType)}
                    className="w-full min-h-[44px] px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white focus:outline-none"
                  >
                    <option value="Apprenticeship">Apprenticeship</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Freelance Gig">Freelance Gig</option>
                    <option value="Full-Time Role">Full-Time Role</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                    Fair Compensation
                  </label>
                  <input
                    type="text"
                    value={formComp}
                    onChange={(e) => setFormComp(e.target.value)}
                    placeholder="e.g. $25/hr or Shared Revenue"
                    className="w-full min-h-[44px] px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Austin, TX (On-site workshop) or Remote"
                  className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                  Summary / Context
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="What is this door all about?"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                    Who We Need
                  </label>
                  <input
                    type="text"
                    value={formWho}
                    onChange={(e) => setFormWho(e.target.value)}
                    placeholder="e.g. Anyone eager to learn hand carving"
                    className="w-full min-h-[44px] px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1">
                    What You Will Learn
                  </label>
                  <input
                    type="text"
                    value={formLearn}
                    onChange={(e) => setFormLearn(e.target.value)}
                    placeholder="e.g. Mortise and tenon joinery"
                    className="w-full min-h-[44px] px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                  />
                </div>
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
                  Publish Open Door
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
