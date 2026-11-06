import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Users, ShieldCheck, MessageSquare, Sparkles } from 'lucide-react';

export const CircleDetailModal: React.FC = () => {
  const { selectedCircle, closeCircle, toggleJoinCircle, setCreatePostOpen } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCircle();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeCircle]);

  if (!selectedCircle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#F7F4EF] dark:bg-[#211F1D] border border-[#E9E2D9] dark:border-[#38332F] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="circle-title"
      >
        {/* Cover Image Banner */}
        <div className="relative h-36 sm:h-44 w-full bg-[#211F1D] overflow-hidden">
          {selectedCircle.coverImage ? (
            <img
              src={selectedCircle.coverImage}
              alt={selectedCircle.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#F47736]/30 via-[#78917C]/30 to-[#211F1D]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <button
            onClick={closeCircle}
            className="absolute top-3 right-3 min-h-[44px] min-w-[44px] rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
            aria-label="Close circle modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F47736] block mb-1">
              {selectedCircle.category}
            </span>
            <h2 id="circle-title" className="font-heading font-extrabold text-xl sm:text-2xl text-white">
              {selectedCircle.name}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-5">
          {/* Tagline & Join action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E9E2D9] dark:border-[#332F2B]">
            <div>
              <p className="text-sm font-medium text-[#211F1D] dark:text-[#F7F4EF]">
                {selectedCircle.tagline}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#7D756C] dark:text-[#9E958B] mt-1">
                <Users className="w-3.5 h-3.5 text-[#78917C]" />
                <span className="font-mono tabular-nums">{selectedCircle.membersCount.toLocaleString()}</span> members
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleJoinCircle(selectedCircle.id)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                  selectedCircle.isJoined
                    ? 'bg-[#78917C]/20 dark:bg-[#78917C]/30 text-[#4D6451] dark:text-[#A7C2AB] border border-[#78917C]/40'
                    : 'bg-[#F47736] hover:bg-[#E06524] text-white'
                }`}
              >
                {selectedCircle.isJoined ? 'Joined Member' : 'Join Circle'}
              </button>
              
              {selectedCircle.isJoined && (
                <button
                  onClick={() => {
                    closeCircle();
                    setCreatePostOpen(true);
                  }}
                  className="px-3 py-2 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-white dark:bg-[#2C2926] text-xs font-medium text-[#211F1D] dark:text-white hover:border-[#F47736]"
                >
                  Post Here
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B] mb-1.5">
              About This Space
            </h3>
            <p className="text-xs sm:text-sm text-[#3E3A35] dark:text-[#D1C9BE] leading-relaxed">
              {selectedCircle.description}
            </p>
          </div>

          {/* Active Discussion Highlight */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#2A2724] border border-[#E9E2D9] dark:border-[#38332F]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F47736] mb-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Current Circle Question</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#211F1D] dark:text-[#F7F4EF]">
              “{selectedCircle.recentTopic}”
            </p>
          </div>

          {/* Community Guidelines */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#78917C]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B]">
                Space Norms & Ethos
              </h3>
            </div>
            <ul className="space-y-1.5">
              {selectedCircle.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#5B554E] dark:text-[#B3ABA0]">
                  <span className="text-[#F47736] font-bold">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stewards */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5 text-xs text-[#7D756C] dark:text-[#9E958B]">
              <Sparkles className="w-3.5 h-3.5 text-[#F47736]" />
              <span className="font-semibold uppercase tracking-wider">Moderators / Circle Stewards:</span>
              <span>{selectedCircle.moderators.join(', ')}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
