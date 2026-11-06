import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wrench, Star, ShieldCheck, MapPin, Award, MessageSquare, CheckCircle, X, ArrowLeft } from 'lucide-react';
import { ProService } from '../types';
import { Avatar } from '../components/common/Avatar';

export const FindAProScreen: React.FC = () => {
  const {
    proServices,
    contactPro,
    openProfile,
    navigateBack,
    getPreviousScreenLabel,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inquiryPro, setInquiryPro] = useState<ProService | null>(null);
  const [inquiryText, setInquiryText] = useState('');

  const categories = [
    'All',
    'Skilled Trades',
    'Creative Arts',
    'Home & Garden',
    'Culinary',
  ];

  const filteredPros =
    selectedCategory === 'All'
      ? proServices
      : proServices.filter((p) => p.category === selectedCategory);

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryPro) return;
    contactPro(inquiryPro.id, inquiryText);
    setInquiryPro(null);
    setInquiryText('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
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

      {/* Hero */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#78917C]/15 text-[#4D6451] dark:text-[#A7C2AB] flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <h1 className="font-heading font-extrabold text-fluid-h1 text-[#211F1D] dark:text-[#F7F4EF]">
            Find a Pro: Skilled Trades & Artisans
          </h1>
        </div>
        <p className="text-fluid-sub text-[#7D756C] dark:text-[#B3ABA0] mt-1.5 max-w-xl">
          Hire independent master tradespeople, restorative carpenters, solar electricians, and craft makers directly. Zero middleman commission cuts.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                isSelected
                  ? 'bg-[#211F1D] text-white dark:bg-[#F7F4EF] dark:text-[#211F1D] shadow-sm'
                  : 'bg-white dark:bg-[#25221F] text-[#5B554E] dark:text-[#B3ABA0] border border-[#E9E2D9] dark:border-[#332F2B] hover:text-[#211F1D] dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Pro Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPros.map((service) => (
          <div
            key={service.id}
            className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm flex flex-col justify-between hover:border-[#F47736]/40 transition-all duration-200 space-y-4"
          >
            <div>
              {/* Header: Pro Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => openProfile(service.pro)}
                    className="relative shrink-0 group focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Avatar
                      src={service.pro.avatar}
                      name={service.pro.name}
                      className="w-13 h-13 rounded-2xl border border-[#E9E2D9] dark:border-[#38332F] group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs">
                      {service.pro.countryFlag}
                    </span>
                  </button>

                  <div>
                    <button
                      onClick={() => openProfile(service.pro)}
                      className="font-heading font-bold text-base text-[#211F1D] dark:text-[#F7F4EF] hover:text-[#F47736] text-left transition-colors"
                    >
                      {service.pro.name}
                    </button>
                    
                    <div className="flex items-center gap-1.5 text-xs text-[#78917C] dark:text-[#95AF99]">
                      <MapPin className="w-3 h-3" />
                      <span>{service.availableLocation}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="flex items-center gap-1 font-semibold text-[#211F1D] dark:text-[#F7F4EF]">
                        <Star className="w-3.5 h-3.5 fill-[#F47736] text-[#F47736]" />
                        <span className="font-mono tabular-nums">{service.rating}</span>
                      </span>
                      <span className="text-[#7D756C] dark:text-[#9E958B]">
                        ({service.reviewCount} client reviews)
                      </span>
                      <span className="text-[#7D756C] dark:text-[#9E958B]">·</span>
                      <span className="text-[#7D756C] dark:text-[#9E958B]">
                        {service.experienceYears}y experience
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Title */}
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#211F1D] dark:text-[#F7F4EF] mt-3">
                {service.serviceTitle}
              </h2>

              {/* Verified Credential Badge */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#78917C]/10 dark:bg-[#78917C]/20 text-[#3D5240] dark:text-[#A7C2AB] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#78917C]" />
                <span>{service.verifiedBadge}</span>
              </div>

              {/* Guarantee Note */}
              <p className="text-xs text-[#5B554E] dark:text-[#B3ABA0] mt-2 italic">
                “{service.guaranteeNote}”
              </p>
            </div>

            {/* Bottom: Rate and Inquire Button */}
            <div className="pt-3 border-t border-[#E9E2D9]/70 dark:border-[#332F2B] flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7D756C] dark:text-[#9E958B] block">
                  Fair Craft Rate
                </span>
                <span className="text-xs sm:text-sm font-heading font-bold text-[#211F1D] dark:text-white">
                  {service.rate}
                </span>
              </div>

              <button
                onClick={() => setInquiryPro(service)}
                className="px-4 py-2 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-[#F47736]/20 shrink-0"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Pro</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Inquiry Dialog Modal */}
      {inquiryPro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#F7F4EF] dark:bg-[#211F1D] border border-[#E9E2D9] dark:border-[#38332F] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar
                  src={inquiryPro.pro.avatar}
                  name={inquiryPro.pro.name}
                  className="w-10 h-10 rounded-xl"
                />
                <div>
                  <h3 className="font-heading font-bold text-sm text-[#211F1D] dark:text-[#F7F4EF]">
                    Inquire with {inquiryPro.pro.name}
                  </h3>
                  <span className="text-xs text-[#78917C]">{inquiryPro.serviceTitle}</span>
                </div>
              </div>
              <button
                onClick={() => setInquiryPro(null)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[#E9E2D9] dark:hover:bg-[#332F2B]"
                aria-label="Close inquiry"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInquiry} className="space-y-3">
              <textarea
                rows={3}
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                placeholder="Describe your project, timeline, location, or questions..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white placeholder-[#9E958B] focus:outline-none focus:border-[#F47736]"
                autoFocus
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#7D756C]">Rate: {inquiryPro.rate}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInquiryPro(null)}
                    className="px-3 py-1.5 text-xs font-medium text-[#7D756C]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#F47736] text-white text-xs font-semibold"
                  >
                    Send Direct Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
