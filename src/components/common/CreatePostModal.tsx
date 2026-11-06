import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Image as ImageIcon, Sparkles, Hash } from 'lucide-react';
import { PostMood } from '../../types';
import { Avatar } from './Avatar';

const SAMPLE_PHOTO_PRESETS = [
  {
    name: 'Artisan Workshop & Pottery',
    url: '/src/assets/images/craft_potter_hands_1793790873698.jpg',
  },
  {
    name: 'Makerspace Collaboration',
    url: '/src/assets/images/community_maker_space_1793790874470.jpg',
  },
  {
    name: 'Rooftop Solar & Trades',
    url: '/src/assets/images/solar_tradesperson_rooftop_1793790875758.jpg',
  },
  {
    name: 'After Hours Acoustic Session',
    url: '/src/assets/images/acoustic_music_evening_1793790875564.jpg',
  },
];

const AVAILABLE_MOODS: PostMood[] = [
  'Showcasing a Craft',
  'Celebrating Progress',
  'Seeking Advice',
  'Open to Collaborate',
  'Life & Musings',
  'Apprenticeship & Learning',
];

export const CreatePostModal: React.FC = () => {
  const { isCreatePostOpen, setCreatePostOpen, createPost, currentUser } = useApp();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<PostMood>('Showcasing a Craft');
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [customTagInput, setCustomTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Crafts', 'Learning']);
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCreatePostOpen(false);
    };
    if (isCreatePostOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreatePostOpen, setCreatePostOpen]);

  if (!isCreatePostOpen) return null;

  const handleAddTag = () => {
    const trimmed = customTagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setCustomTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createPost(content.trim(), mood, tags, selectedImage);
    setContent('');
    setSelectedImage(undefined);
    setTags(['Crafts', 'Learning']);
    setShowImagePicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#F7F4EF] dark:bg-[#211F1D] border border-[#E9E2D9] dark:border-[#38332F] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E9E2D9] dark:border-[#332F2B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F47736]" />
            <h2 id="modal-title" className="font-heading font-bold text-base sm:text-lg text-[#211F1D] dark:text-[#F7F4EF]">
              Share with The Lounge
            </h2>
          </div>
          <button
            onClick={() => setCreatePostOpen(false)}
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#7D756C] hover:text-[#211F1D] dark:hover:text-white hover:bg-[#E9E2D9]/60 dark:hover:bg-[#332F2B] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* Author info & ethos notice */}
          <div className="flex items-center gap-3">
            <Avatar
              src={currentUser.avatar}
              name={currentUser.name}
              className="w-10 h-10 rounded-full border border-[#E9E2D9] dark:border-[#38332F]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-semibold text-sm text-[#211F1D] dark:text-[#F7F4EF]">
                  {currentUser.name}
                </span>
                <span className="text-xs text-[#78917C] dark:text-[#95AF99]">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-[11px] text-[#7D756C] dark:text-[#9E958B]">
                “You belong before you achieve.”
              </p>
            </div>
          </div>

          {/* Mood selection */}
          <div>
            <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0] mb-1.5">
              What kind of moment is this?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_MOODS.map((m) => {
                const isSelected = mood === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#F47736] text-white shadow-sm'
                        : 'bg-white dark:bg-[#2C2926] text-[#5B554E] dark:text-[#B3ABA0] border border-[#E9E2D9] dark:border-[#38332F] hover:border-[#F47736]/40'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are you creating, learning, wrestling with, or appreciating today? Honest works-in-progress are celebrated here..."
              className="w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-[#1A1817] text-[#211F1D] dark:text-[#F7F4EF] placeholder-[#9E958B] border border-[#E9E2D9] dark:border-[#38332F] focus:outline-none focus:ring-2 focus:ring-[#F47736]/30 focus:border-[#F47736] transition-colors resize-none"
              autoFocus
            />
          </div>

          {/* Image Preview if selected */}
          {selectedImage && (
            <div className="relative rounded-xl overflow-hidden border border-[#E9E2D9] dark:border-[#38332F]">
              <img
                src={selectedImage}
                alt="Selected preview"
                className="w-full h-44 object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(undefined)}
                className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Photo Picker Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowImagePicker(!showImagePicker)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E9E2D9] dark:border-[#38332F] bg-white dark:bg-[#2C2926] text-xs font-medium text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#F47736]" />
              <span>{selectedImage ? 'Change Photo' : 'Attach Craft Photo'}</span>
            </button>

            {showImagePicker && (
              <div className="mt-2.5 p-3 rounded-xl bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] space-y-2">
                <span className="text-[11px] font-medium text-[#7D756C] dark:text-[#9E958B] block">
                  Select a workshop / craft documentary visual:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_PHOTO_PRESETS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        setSelectedImage(preset.url);
                        setShowImagePicker(false);
                      }}
                      className="group relative rounded-lg overflow-hidden border border-[#E9E2D9] dark:border-[#38332F] text-left hover:border-[#F47736] transition-all"
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-18 object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-black/75 px-1.5 py-1 text-[10px] text-white font-medium truncate block">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#5B554E] dark:text-[#B3ABA0]">
              Topic Tags
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#E9E2D9]/60 dark:bg-[#2C2926] text-[#211F1D] dark:text-[#E9E2D9]"
                >
                  <Hash className="w-3 h-3 text-[#78917C]" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}

              <div className="inline-flex items-center gap-1">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag..."
                  className="px-2.5 py-1 text-xs rounded-md bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] focus:outline-none focus:border-[#F47736] w-24 text-[#211F1D] dark:text-white"
                />
                {customTagInput && (
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="text-xs px-2 py-1 rounded bg-[#F47736] text-white font-medium"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-between border-t border-[#E9E2D9] dark:border-[#332F2B]">
            <div className="flex items-center gap-1.5 text-xs text-[#78917C] dark:text-[#95AF99]">
              <Sparkles className="w-3.5 h-3.5 text-[#F47736]" />
              <span className="hidden sm:inline">No algorithm gaming. Pure human connection.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCreatePostOpen(false)}
                className="min-h-[44px] px-4 py-2 text-xs font-medium text-[#7D756C] dark:text-[#B3ABA0] hover:text-[#211F1D] dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!content.trim()}
                className="min-h-[44px] px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#F47736] hover:bg-[#E06524] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all"
              >
                Publish to Lounge
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
