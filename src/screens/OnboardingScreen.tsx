import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_INTEREST_TAGS } from '../data/sampleData';
import {
  Sparkles,
  Check,
  ArrowRight,
  HeartHandshake,
  Compass,
  Users2,
  ArrowLeft,
  Plus,
  Flame,
  Award,
  ShieldCheck,
  Wrench,
  BookOpen,
  Music,
  Sprout
} from 'lucide-react';
import { Avatar } from '../components/common/Avatar';

const BELONGING_PRESETS = [
  'Taking space before figuring it all out. Here to learn with open hands.',
  'Work with my hands, stand on my own feet. No pedigree needed.',
  'Learning slowly, celebrating small honest steps, leaving the race behind.',
  'First in my family to walk this road. Seeking peers who understand.',
  'Here for music, wood grain, warm soup, and genuine community.',
  'Tinkering quietly at the intersection of open-source tools and ecological repair.',
];

const CRAFT_CATEGORIES = [
  { id: 'all', label: 'All Fields' },
  { id: 'trades', label: 'Trades & Hands', icon: Wrench },
  { id: 'arts', label: 'Arts & Making', icon: Sparkles },
  { id: 'earth', label: 'Earth & Food', icon: Sprout },
  { id: 'culture', label: 'Music & Culture', icon: Music },
  { id: 'mind', label: 'Learning & Code', icon: BookOpen },
];

const CATEGORY_TAG_MAP: Record<string, string[]> = {
  trades: ['Woodworking', 'Pottery & Ceramics', 'Solar & Energy', 'Metal Fabrication', 'Repair & Fix'],
  arts: ['Traditional Weaving', 'Documentary Arts', 'Natural Building', 'Pottery & Ceramics'],
  earth: ['Organic Farming', 'Sourdough & Culinary', 'Community Gardens', 'Traditional Weaving'],
  culture: ['Acoustic Music', 'First-Gen Journeys', 'Apprenticeships'],
  mind: ['Local Coding', 'First-Gen Journeys', 'Apprenticeships', 'Local Governance'],
};

const VALUE_OPTIONS = [
  'Radical Welcoming',
  'Craft Over Speed',
  'Shared Knowledge',
  'Quiet Joy',
  'Humble Mastery',
  'Zero Posturing',
  'Earth Stewardship'
];

export const OnboardingScreen: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    circles,
    toggleJoinCircle,
    setCurrentScreen,
    showToast,
    navigateBack,
    getPreviousScreenLabel,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customTagInput, setCustomTagInput] = useState('');

  // Step 1: Interests State
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentUser.interests.length > 0
      ? currentUser.interests
      : ['Woodworking', 'Pottery & Ceramics', 'Acoustic Music']
  );

  // Step 2: Belonging & Values State
  const [belongingNote, setBelongingNote] = useState(
    currentUser.belongingNote || BELONGING_PRESETS[0]
  );
  const [currentlyWorkingOn, setCurrentlyWorkingOn] = useState(
    currentUser.currentlyWorkingOn || 'Setting up a small neighborhood workspace and learning traditional joints.'
  );
  const [selectedValues, setSelectedValues] = useState<string[]>(
    currentUser.values.length > 0
      ? currentUser.values
      : ['Radical Welcoming', 'Craft Over Speed', 'Shared Knowledge']
  );

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter((t) => t !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    if (!selectedInterests.includes(trimmed)) {
      setSelectedInterests([...selectedInterests, trimmed]);
      showToast(`Added curiosity: "${trimmed}"`, 'warm');
    }
    setCustomTagInput('');
  };

  const toggleValue = (val: string) => {
    if (selectedValues.includes(val)) {
      setSelectedValues(selectedValues.filter((v) => v !== val));
    } else {
      setSelectedValues([...selectedValues, val]);
    }
  };

  const handleFinish = () => {
    updateCurrentUser({
      interests: selectedInterests,
      belongingNote,
      currentlyWorkingOn,
      values: selectedValues,
    });
    showToast(`Welcome home to The Lounge, ${currentUser.name}!`, 'warm');
    setCurrentScreen('home');
  };

  const visibleTags = activeCategory === 'all'
    ? INITIAL_INTEREST_TAGS
    : (CATEGORY_TAG_MAP[activeCategory] || INITIAL_INTEREST_TAGS);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Bar & Progress Track */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#7D756C] dark:text-[#9E958B]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (step > 1) {
                  setStep((step - 1) as 1 | 2);
                } else {
                  navigateBack();
                }
              }}
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] text-xs font-bold text-[#5B554E] dark:text-[#F7F4EF] hover:border-[#F47736] transition-colors"
              aria-label={step > 1 ? 'Previous Step' : `Back to ${getPreviousScreenLabel()}`}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F47736]" />
              <span>{step > 1 ? 'Previous Step' : `Back to ${getPreviousScreenLabel()}`}</span>
            </button>
            <span className="font-bold text-[#F47736] ml-1">Step {step} of 3</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-[#211F1D] dark:text-white hidden sm:inline">
              {step === 1 && 'Curiosities & Crafts'}
              {step === 2 && 'Belonging Philosophy & Values'}
              {step === 3 && 'Matched Guilds & Community Preview'}
            </span>
          </div>
          <button
            onClick={() => setCurrentScreen('home')}
            className="min-h-[44px] px-2 flex items-center text-xs text-[#7D756C] hover:text-[#211F1D] dark:hover:text-white transition-colors underline"
          >
            Skip to The Lounge
          </button>
        </div>

        {/* Multi-step progress bar */}
        <div className="w-full h-1.5 bg-[#E9E2D9] dark:bg-[#332F2B] rounded-full overflow-hidden flex">
          <div
            className={`h-full bg-[#F47736] transition-all duration-300 ${
              step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'
            }`}
          />
        </div>
      </div>

      {/* STEP 1: CURIOSITIES & CRAFTS */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#F47736]" />
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#211F1D] dark:text-[#F7F4EF]">
                What sparks your hands & curiosity?
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#7D756C] dark:text-[#B3ABA0] leading-relaxed">
              Select the trades, arts, or passions you practice or want to learn. We shape your Lounge feed around people, tools, and stories you cherish.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CRAFT_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`min-h-[38px] px-3.5 py-1 text-xs font-semibold rounded-xl border transition-colors shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'border-[#F47736] bg-[#F47736]/10 text-[#F47736]'
                      : 'border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF]/50 dark:bg-[#1E1C1A] text-[#5B554E] dark:text-[#B3ABA0] hover:border-[#F47736]/40'
                  }`}
                >
                  {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tag Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {visibleTags.map((tag) => {
              const isSelected = selectedInterests.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleInterest(tag)}
                  className={`min-h-[48px] p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between gap-2 transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'border-[#F47736] bg-[#F47736]/10 text-[#211F1D] dark:text-white shadow-sm'
                      : 'border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF]/40 dark:bg-[#1A1817] text-[#5B554E] dark:text-[#B3ABA0] hover:border-[#F47736]/50'
                  }`}
                >
                  <span className="truncate">{tag}</span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-[#F47736] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Tag Input */}
          <form onSubmit={handleAddCustomTag} className="flex gap-2 pt-1">
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              placeholder="Have an unlisted craft? (e.g. Dry stone walling, Letterpress, Herbalism)"
              className="flex-1 min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1A1817] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736] transition-colors"
            />
            <button
              type="submit"
              className="min-h-[44px] px-4 rounded-xl bg-white dark:bg-[#2A2724] border border-[#E9E2D9] dark:border-[#38332F] hover:border-[#F47736] text-xs font-semibold text-[#211F1D] dark:text-white flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4 text-[#F47736]" />
              <span>Add Craft</span>
            </button>
          </form>

          {/* Step 1 Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E9E2D9] dark:border-[#332F2B]">
            <span className="text-xs text-[#7D756C] dark:text-[#9E958B]">
              <strong className="text-[#F47736] font-bold">{selectedInterests.length}</strong> curiosities selected
            </span>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Next: Belonging Note</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BELONGING STATEMENT & VALUES */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#F47736]" />
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#211F1D] dark:text-[#F7F4EF]">
                Your Belonging Note & Values
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#7D756C] dark:text-[#B3ABA0] leading-relaxed">
              On LinkedOut, <strong className="text-[#211F1D] dark:text-white">“You belong before you achieve.”</strong> Share an honest grounding note that appears atop your profile for peers to see.
            </p>
          </div>

          {/* Belonging Note Input */}
          <div>
            <label htmlFor="belonging-text" className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1.5">
              Belonging Anchor Statement (Editable)
            </label>
            <textarea
              id="belonging-text"
              rows={3}
              value={belongingNote}
              onChange={(e) => setBelongingNote(e.target.value)}
              placeholder="What grounds you today?"
              className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1A1817] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736] transition-colors leading-relaxed"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <span className="block text-xs font-semibold text-[#7D756C] dark:text-[#9E958B] mb-2">
              Or pick an authentic human statement:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BELONGING_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBelongingNote(preset)}
                  className={`min-h-[44px] p-3 text-left text-xs rounded-xl border transition-colors ${
                    belongingNote === preset
                      ? 'border-[#F47736] bg-[#F47736]/10 text-[#211F1D] dark:text-white font-medium'
                      : 'border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF]/30 dark:bg-[#1E1C1A] text-[#5B554E] dark:text-[#B3ABA0] hover:border-[#F47736]/40'
                  }`}
                >
                  “{preset}”
                </button>
              ))}
            </div>
          </div>

          {/* Currently Working On */}
          <div>
            <label htmlFor="working-on-input" className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1.5">
              What are you tinkering with or learning right now?
            </label>
            <input
              id="working-on-input"
              type="text"
              value={currentlyWorkingOn}
              onChange={(e) => setCurrentlyWorkingOn(e.target.value)}
              placeholder="e.g. Restoring a vintage bandsaw or learning Japanese sashiko mending"
              className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1A1817] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736] transition-colors"
            />
          </div>

          {/* Values Chips */}
          <div>
            <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-2">
              Core Community Values You Uphold
            </label>
            <div className="flex flex-wrap gap-2">
              {VALUE_OPTIONS.map((val) => {
                const isSelected = selectedValues.includes(val);
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => toggleValue(val)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'border-[#78917C] bg-[#78917C]/15 text-[#3D5240] dark:text-[#A7C2AB]'
                        : 'border-[#E9E2D9] dark:border-[#38332F] bg-white dark:bg-[#1E1C1A] text-[#5B554E] dark:text-[#B3ABA0] hover:border-[#78917C]/50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{val}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E9E2D9] dark:border-[#332F2B]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-[44px] px-4 flex items-center gap-1.5 text-xs font-semibold text-[#7D756C] hover:text-[#211F1D] dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Crafts</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Next: Match Guilds</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: MATCHED GUILDS & COMMUNITY PREVIEW */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users2 className="w-5 h-5 text-[#F47736]" />
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#211F1D] dark:text-[#F7F4EF]">
                Your Matched Guilds & Profile
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#7D756C] dark:text-[#B3ABA0] leading-relaxed">
              Based on your crafts, we matched you with these active communities. You can join them now or adjust later.
            </p>
          </div>

          {/* Matched Circles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {circles.slice(0, 4).map((circle) => (
              <div
                key={circle.id}
                className="p-4 rounded-2xl bg-[#F7F4EF]/60 dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#332F2B] flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading font-bold text-sm text-[#211F1D] dark:text-white truncate">
                      {circle.name}
                    </span>
                    <span className="text-[11px] text-[#78917C] dark:text-[#95AF99] shrink-0 font-medium">
                      {circle.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#7D756C] dark:text-[#9E958B] line-clamp-2 mt-1 leading-relaxed">
                    {circle.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E9E2D9]/60 dark:border-[#2C2926]">
                  <span className="text-[11px] text-[#7D756C] dark:text-[#9E958B]">
                    {circle.membersCount} members
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleJoinCircle(circle.id)}
                    className={`min-h-[36px] px-3.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      circle.isJoined
                        ? 'bg-[#78917C]/20 text-[#3D5240] dark:text-[#A7C2AB]'
                        : 'bg-[#F47736] text-white hover:bg-[#E06524]'
                    }`}
                  >
                    {circle.isJoined ? 'Joined Guild' : 'Join Guild'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Profile Card Preview */}
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B] block mb-2.5">
              Live Preview: Your Community Profile
            </span>
            <div className="p-5 rounded-2xl bg-[#F7F4EF] dark:bg-[#1E1C1A] border border-[#E9E2D9] dark:border-[#38332F] flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 border-[#F47736]/40">
                <Avatar src={currentUser.avatar} name={currentUser.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading font-bold text-base text-[#211F1D] dark:text-white">
                    {currentUser.name}
                  </h3>
                  <span className="text-xs text-[#78917C] dark:text-[#95AF99] font-medium">
                    · {currentUser.role}
                  </span>
                </div>
                <p className="text-xs italic text-[#5B554E] dark:text-[#D1C9BE] line-clamp-2">
                  “{belongingNote}”
                </p>
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-[#7D756C] dark:text-[#9E958B]">
                  <span>Curiosities:</span>
                  {selectedInterests.slice(0, 3).map((t) => (
                    <span key={t} className="font-medium text-[#211F1D] dark:text-white">
                      #{t}
                    </span>
                  ))}
                  {selectedInterests.length > 3 && (
                    <span>+{selectedInterests.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E9E2D9] dark:border-[#332F2B]">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="min-h-[44px] px-4 flex items-center gap-1.5 text-xs font-semibold text-[#7D756C] hover:text-[#211F1D] dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Values</span>
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="min-h-[46px] px-8 py-2.5 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-[#F47736]/25 transition-all"
            >
              <span>Step into The Lounge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
