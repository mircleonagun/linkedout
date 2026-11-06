import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Moon,
  Calendar,
  Clock,
  MapPin,
  Users,
  Check,
  Plus,
  X,
  Search,
  SlidersHorizontal,
  Bookmark,
  Share2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Music,
  Headphones,
  Award,
  Crown,
  QrCode,
  Ticket,
  Wine,
  Volume2,
  VolumeX,
  CreditCard,
  ShieldCheck,
  Percent,
  Info,
  Flame,
  ArrowRight,
  Coins,
  Copy,
  CheckCircle2,
  Wallet,
  Building2,
  Smartphone,
  Zap,
  RefreshCw,
  Navigation,
  Play,
  Video,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Compass,
  MessageCircle,
  Send,
  Star,
  ExternalLink,
  Filter,
  Map as MapIcon,
  Radio,
  Heart,
  PhoneCall
} from 'lucide-react';
import {
  AfterHoursEvent,
  NightlifeVenue,
  EntertainerProfile,
  BookedTicket,
  EntertainmentBookingRequest,
  CurrencyMode,
  PaymentMethodType,
  CryptoNetwork,
  AfterHoursCategory
} from '../types';

export const AfterHoursScreen: React.FC = () => {
  const {
    events,
    venues,
    entertainers,
    bookedTickets,
    savedEventIds,
    bookingRequests,
    afterHoursPass,
    unlockAfterHoursPass,
    toggleSaveEvent,
    toggleSaveVenue,
    bookEventTicket,
    submitBookingRequest,
    toggleRsvpEvent,
    currentUser,
    allUsers,
    showToast,
    navigateBack,
    getPreviousScreenLabel,
    setCurrentScreen,
  } = useApp();

  // Navigation tab state inside After Hours
  type AfterHoursTab = 'discovery' | 'map' | 'entertainers' | 'secret_pass' | 'venues' | 'vip' | 'plans';
  const [activeTab, setActiveTab] = useState<AfterHoursTab>('discovery');

  // Currency mode state: default NGN (50 Naira) as requested
  const [currencyMode, setCurrencyMode] = useState<CurrencyMode>('NGN');

  // Checkout Payment Rails State
  const [selectedPaymentRail, setSelectedPaymentRail] = useState<PaymentMethodType>('naira');
  const [nairaSubMethod, setNairaSubMethod] = useState<'bank_transfer' | 'card' | 'ussd'>('bank_transfer');
  const [selectedCryptoNetwork, setSelectedCryptoNetwork] = useState<CryptoNetwork>('USDT (TRC20)');
  const [copiedBankDetails, setCopiedBankDetails] = useState(false);
  const [copiedCryptoAddress, setCopiedCryptoAddress] = useState(false);

  // Search & Filter state for Nearby Nightlife
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Areas');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('Any Date');
  const [selectedFeeFilter, setSelectedFeeFilter] = useState<string>('All');
  const [selectedAtmosphere, setSelectedAtmosphere] = useState<string>('All Vibes');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Entertainer Showcase & Roles
  const [entertainerRoleFilter, setEntertainerRoleFilter] = useState<string>('All Talent');
  const [viewingVideoTalent, setViewingVideoTalent] = useState<EntertainerProfile | null>(null);
  const [selectedEntertainerDetail, setSelectedEntertainerDetail] = useState<EntertainerProfile | null>(null);

  // After Hours Pass (Secret Hookup / VIP Unlocking) State
  const [isPassUnlockModalOpen, setIsPassUnlockModalOpen] = useState(false);
  const [unlockTierChoice, setUnlockTierChoice] = useState<'50_naira' | 'black_vip'>('50_naira');
  const [isUnlockingPass, setIsUnlockingPass] = useState(false);
  const [revealedSecretEvent, setRevealedSecretEvent] = useState<AfterHoursEvent | null>(null);

  // Interactive Nightlife Map State
  const [selectedMapVenue, setSelectedMapVenue] = useState<NightlifeVenue | null>(venues[0] || null);
  const [mapFilter, setMapFilter] = useState<'all' | 'djs_tonight' | 'open_now' | 'vip'>('all');
  const [sharingVenue, setSharingVenue] = useState<NightlifeVenue | null>(null);
  const [directionsModalVenue, setDirectionsModalVenue] = useState<NightlifeVenue | null>(null);
  const [selectedFriendsToInvite, setSelectedFriendsToInvite] = useState<string[]>(['usr_amina', 'usr_kenji']);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Selected Event Details Modal / View
  const [selectedEvent, setSelectedEvent] = useState<AfterHoursEvent | null>(null);
  const [eventDetailTab, setEventDetailTab] = useState<'About' | 'Gallery' | 'Lineup' | 'Reviews' | 'VIP'>('About');

  // Booking Flow State (Matching Right Screen in Sample)
  const [bookingEvent, setBookingEvent] = useState<AfterHoursEvent | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState<'general' | 'vip'>('general');
  const [appliedPromo, setAppliedPromo] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Entertainment Booking Request Modal State
  const [bookingEntertainer, setBookingEntertainer] = useState<EntertainerProfile | null>(null);
  const [reqDate, setReqDate] = useState('2026-02-28');
  const [reqTime, setReqTime] = useState('21:00');
  const [reqDuration, setReqDuration] = useState(3);
  const [reqType, setReqType] = useState<EntertainmentBookingRequest['eventType']>('Private After-Party');
  const [reqLocation, setReqLocation] = useState('Soho Loft & Rooftop Terrace');
  const [reqBudget, setReqBudget] = useState('₦25,000 / hr ($15 USD / 15 USDT)');
  const [reqNotes, setReqNotes] = useState('Looking for a sunset afro-house set transitioning into late night grooves.');

  // Venue Detail Modal State
  const [selectedVenue, setSelectedVenue] = useState<NightlifeVenue | null>(null);

  // Audio Mix preview mock playback
  const [playingMixId, setPlayingMixId] = useState<string | null>(null);

  // Ticket Pass View Modal State
  const [viewingTicketPass, setViewingTicketPass] = useState<BookedTicket | null>(null);

  const categoryOptions = [
    'All',
    'Nightclubs & Lounges',
    'Bars & Rooftops',
    'Live Music',
    'DJ Nights & Parties',
    'Karaoke & Comedy',
    'Beach Parties',
    'Secret After Hours'
  ];

  const genreOptions = ['All', 'Hip Hop', 'Afrobeats', 'House', 'Amapiano', 'Neo-Soul', 'Techno', 'Acoustic'];
  const locationOptions = ['All Areas', 'Central', 'Soho', 'Waterfront', 'Industrial Loft', 'Chai Wan'];
  const atmosphereOptions = ['All Vibes', 'High Energy', 'Rooftop Sunset', 'Underground Speakeasy', 'Beach Party', 'Neon Rave', 'Karaoke Jam'];

  // Price formatting helper for discovery/browsing screens
  const getEventPrice = (event: AfterHoursEvent, isVip = false) => {
    if (event.price === 0) {
      return { text: 'Free Entry', amount: 0, symbol: '' };
    }
    if (currencyMode === 'NGN') {
      const amt = isVip ? (event.vipPriceNgn || 15000) : (event.priceNgn || 50);
      return { text: `₦${amt.toLocaleString()}`, amount: amt, symbol: '₦' };
    }
    if (currencyMode === 'USD') {
      const amt = isVip ? (event.vipPriceUsd || 15) : (event.priceUsd || 1);
      return { text: `$${amt}`, amount: amt, symbol: '$' };
    }
    // CRYPTO
    const amt = isVip ? (event.vipPriceCrypto || 15) : (event.priceCrypto || 0.05);
    return { text: `${amt} USDT`, amount: amt, symbol: 'USDT' };
  };

  // Price formatting helper for checkout based on active payment rail
  const getCheckoutPrice = (event: AfterHoursEvent, isVip = false, rail: PaymentMethodType = selectedPaymentRail) => {
    if (event.price === 0) {
      return { text: 'Free Entry', amount: 0, symbol: '' };
    }
    if (rail === 'naira') {
      const amt = isVip ? (event.vipPriceNgn || 15000) : (event.priceNgn || 50);
      return { text: `₦${amt.toLocaleString()}`, amount: amt, symbol: '₦' };
    }
    if (rail === 'dollar') {
      const amt = isVip ? (event.vipPriceUsd || 15) : (event.priceUsd || 1);
      return { text: `$${amt}`, amount: amt, symbol: '$' };
    }
    // crypto
    const amt = isVip ? (event.vipPriceCrypto || 15) : (event.priceCrypto || 0.05);
    return { text: `${amt} USDT`, amount: amt, symbol: 'USDT' };
  };

  // Filtered Events with multi-dimensional criteria (Location, Genre, Date, Fee, Atmosphere)
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.venueName && e.venueName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.genreTags && e.genreTags.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      selectedCategory === 'All' ||
      e.category === selectedCategory ||
      (selectedCategory === 'Nightclubs & Lounges' && (e.category === 'Nightclubs & Lounges' || e.category === 'Clubs' || e.category === 'Bars & Lounges')) ||
      (selectedCategory === 'Secret After Hours' && e.isSecretExclusive);

    const matchesGenre =
      selectedGenre === 'All' ||
      (e.genreTags && e.genreTags.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase())));

    const matchesLocation =
      selectedLocation === 'All Areas' ||
      e.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      (e.venueAddress && e.venueAddress.toLowerCase().includes(selectedLocation.toLowerCase()));

    const matchesDate =
      selectedDateFilter === 'Any Date' ||
      (selectedDateFilter === 'Tonight' && e.date.toLowerCase().includes('tonight')) ||
      (selectedDateFilter === 'Friday' && e.date.toLowerCase().includes('fri')) ||
      (selectedDateFilter === 'Saturday' && e.date.toLowerCase().includes('sat')) ||
      (selectedDateFilter === 'Weekend' && (e.date.toLowerCase().includes('fri') || e.date.toLowerCase().includes('sat') || e.date.toLowerCase().includes('sun')));

    const matchesFee =
      selectedFeeFilter === 'All' ||
      (selectedFeeFilter === '50_naira' && e.priceNgn === 50) ||
      (selectedFeeFilter === 'free' && e.price === 0) ||
      (selectedFeeFilter === 'vip' && e.isVipAvailable);

    const matchesAtmosphere =
      selectedAtmosphere === 'All Vibes' ||
      e.atmosphere === selectedAtmosphere;

    return matchesSearch && matchesCategory && matchesGenre && matchesLocation && matchesDate && matchesFee && matchesAtmosphere;
  });

  // Filtered Venues
  const filteredVenues = venues.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vibeTags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAtmosphere =
      selectedAtmosphere === 'All Vibes' ||
      v.atmosphere === selectedAtmosphere;

    return matchesSearch && matchesAtmosphere;
  });

  // Filtered Entertainers (DJs, Hype People, MCs, Dancers, Event Hosts)
  const filteredEntertainers = entertainers.filter((ent) => {
    const matchesSearch =
      ent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ent.stageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ent.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ent.entertainmentStyles && ent.entertainmentStyles.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesRole =
      entertainerRoleFilter === 'All Talent' ||
      (entertainerRoleFilter === 'DJs' && (ent.role.includes('DJ') || ent.role.includes('Vinyl') || ent.role.includes('Electronic'))) ||
      (entertainerRoleFilter === 'Hype Men & MCs' && ent.role.includes('Hype')) ||
      (entertainerRoleFilter === 'Dancers' && ent.role.includes('Dancer')) ||
      (entertainerRoleFilter === 'Event Hosts' && ent.role.includes('Host')) ||
      (entertainerRoleFilter === 'Live Electronic' && ent.role.includes('Live'));

    return matchesSearch && matchesRole;
  });

  // Handle Ticket Booking Checkout
  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingEvent) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);

      const priceInfo = getCheckoutPrice(bookingEvent, selectedTier === 'vip', selectedPaymentRail);
      const basePrice = priceInfo.amount;
      const discount = appliedPromo ? 0.15 : 0;
      const subtotal = basePrice * ticketQuantity * (1 - discount);
      const serviceFee = subtotal * 0.08;
      const total = selectedPaymentRail === 'crypto'
        ? Number((subtotal + serviceFee).toFixed(3))
        : Math.round(subtotal + serviceFee);

      const ticketTierLabel = selectedTier === 'vip'
        ? 'VIP Mezzanine Table Pass'
        : (selectedPaymentRail === 'naira'
            ? '50 Naira General Admission + Express Door Pass'
            : 'General Admission + Express Door Pass');

      const paymentMethodNote = selectedPaymentRail === 'naira'
        ? `Naira Pay (${nairaSubMethod === 'bank_transfer' ? 'Zenith Bank Transfer' : nairaSubMethod === 'ussd' ? 'USSD Code' : 'Debit Card'})`
        : selectedPaymentRail === 'dollar'
          ? 'US Dollar (Card / Apple Pay)'
          : `Crypto (${selectedCryptoNetwork})`;

      const newTicket: BookedTicket = {
        id: 'tkt_' + Date.now(),
        eventId: bookingEvent.id,
        eventTitle: bookingEvent.title,
        venueName: bookingEvent.venueName || bookingEvent.location,
        venueAddress: bookingEvent.venueAddress || bookingEvent.location,
        date: bookingEvent.date,
        time: bookingEvent.time,
        ticketTier: ticketTierLabel,
        quantity: ticketQuantity,
        totalPaid: total,
        currency: priceInfo.symbol,
        qrCode: `LNK-AFT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        holderName: currentUser.name,
        status: 'Active Pass',
        bookingRef: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
      };

      bookEventTicket(newTicket);
      setBookingEvent(null);
      setSelectedEvent(null);
      setActiveTab('plans');
      setViewingTicketPass(newTicket);
      showToast(`Payment successful via ${paymentMethodNote}! Entry pass activated.`, 'success');
    }, 900);
  };

  // Handle Entertainment Booking Request Submission
  const handleSubmitEntertainerRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingEntertainer) return;

    submitBookingRequest({
      entertainerId: bookingEntertainer.id,
      entertainerName: bookingEntertainer.stageName,
      clientName: currentUser.name,
      clientEmail: 'miracleonagun@gmail.com',
      eventDate: reqDate,
      eventTime: reqTime,
      eventType: reqType,
      durationHours: Number(reqDuration),
      venueLocation: reqLocation,
      budgetOffer: reqBudget,
      notes: reqNotes,
    });

    setBookingEntertainer(null);
  };

  return (
    <div className="w-full min-h-screen bg-[#0C0B0A] text-[#F7F4EF] transition-colors pb-24 md:pb-12 -mx-2 sm:-mx-4 lg:-mx-6 px-3 sm:px-6 py-4 sm:py-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">

        {/* TOP BREADCRUMB & BACK NAVIGATION BAR */}
        <div className="flex items-center justify-between gap-3 pb-1">
          <button
            type="button"
            onClick={navigateBack}
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl bg-[#171513] hover:bg-[#221F1B] border border-[#2E2923] hover:border-[#F47736] text-xs font-bold text-[#F7F4EF] transition-all shadow-sm active:scale-98 group"
            aria-label={`Back to ${getPreviousScreenLabel()}`}
          >
            <ArrowLeft className="w-4 h-4 text-[#F47736] group-hover:-translate-x-1 transition-transform" />
            <span>Back to {getPreviousScreenLabel()}</span>
          </button>

          <div className="flex items-center gap-2">
            {activeTab !== 'discovery' && (
              <button
                type="button"
                onClick={() => setActiveTab('discovery')}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#171513] hover:bg-[#221F1B] border border-[#2E2923] hover:border-[#F47736]/40 text-xs font-semibold text-[#F47736] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Discovery</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setCurrentScreen('home')}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#171513] hover:bg-[#221F1B] border border-[#2E2923] hover:border-[#F47736]/40 text-xs font-semibold text-[#A8A199] hover:text-white transition-colors"
            >
              <span>The Lounge</span>
            </button>
          </div>
        </div>

        {/* TOP BAR / NAVIGATION HEADER (Dark Nightlife Treatment) */}
        <header className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#171513] border border-[#2A2621] shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Nightlife Amber Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#F47736]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#F47736]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F47736] to-[#A84510] flex items-center justify-center text-white shadow-lg shadow-[#F47736]/25 shrink-0">
                <Moon className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-extrabold text-lg sm:text-2xl text-white tracking-tight">
                    Linked<span className="text-[#F47736]">Out</span> After Hours
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F47736]/20 text-[#F47736] border border-[#F47736]/30">
                    Nightlife
                  </span>
                </div>
                <p className="text-xs text-[#A8A199] mt-0.5 leading-snug">
                  Where work stops and city night culture begins. Verified clubs, DJs, VIP passes, and spontaneous acoustics.
                </p>
              </div>
            </div>

            {/* Multi-Currency Mode Selector & Quick Ticket Pass */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center p-1 rounded-xl bg-[#221F1B] border border-[#38332C]">
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyMode('NGN');
                    setSelectedPaymentRail('naira');
                    showToast('Currency switched to Nigerian Naira (₦50 Entry Pass)', 'warm');
                  }}
                  className={`h-8 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    currencyMode === 'NGN'
                      ? 'bg-[#F47736] text-white shadow-md'
                      : 'text-[#A8A199] hover:text-white'
                  }`}
                  title="Nigerian Naira - 50 Naira Entry Ticket"
                >
                  <span>₦ NGN (₦50)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyMode('USD');
                    setSelectedPaymentRail('dollar');
                    showToast('Currency switched to US Dollar ($ USD)', 'warm');
                  }}
                  className={`h-8 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    currencyMode === 'USD'
                      ? 'bg-[#F47736] text-white shadow-md'
                      : 'text-[#A8A199] hover:text-white'
                  }`}
                  title="US Dollar"
                >
                  <span>$ USD</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyMode('CRYPTO');
                    setSelectedPaymentRail('crypto');
                    showToast('Currency switched to Crypto (USDT / BTC / ETH / SOL)', 'warm');
                  }}
                  className={`h-8 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    currencyMode === 'CRYPTO'
                      ? 'bg-[#F47736] text-white shadow-md'
                      : 'text-[#A8A199] hover:text-white'
                  }`}
                  title="Cryptocurrency (USDT / BTC / ETH / SOL)"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Crypto</span>
                </button>
              </div>

              <button
                onClick={() => setActiveTab('plans')}
                className="h-9 px-3.5 rounded-xl bg-[#221F1B] hover:bg-[#2C2823] border border-[#38332C] text-xs font-semibold text-[#F7F4EF] flex items-center gap-2 transition-colors"
              >
                <Ticket className="w-4 h-4 text-[#F47736]" />
                <span>My Plans ({bookedTickets.length})</span>
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-2 border-t border-[#26221D] scrollbar-none">
            {[
              { id: 'discovery', label: 'Nightlife Discovery', icon: Sparkles },
              { id: 'map', label: 'Live Nightlife Map', icon: Compass, badge: 'Live Radar' },
              { id: 'entertainers', label: 'DJs & Talent', icon: Headphones },
              { id: 'secret_pass', label: 'After Hours Pass', icon: Lock, badge: afterHoursPass.isUnlocked ? 'VIP Active' : 'Exclusive' },
              { id: 'venues', label: 'Clubs & Venues', icon: MapPin },
              { id: 'vip', label: 'VIP Tables', icon: Crown },
              { id: 'plans', label: `My Passes (${bookedTickets.length})`, icon: Ticket },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AfterHoursTab)}
                  className={`h-9 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-[#F47736] text-white shadow-md shadow-[#F47736]/20'
                      : 'bg-[#1F1C18] text-[#A8A199] hover:text-white hover:bg-[#28241F] border border-[#2A2621]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-black/30 text-white'
                        : tab.badge === 'VIP Active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#F47736]/20 text-[#F47736]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </header>

        {/* ============================================================ */}
        {/* TAB 1: NIGHTLIFE DISCOVERY (Matching Left Phone Screen)       */}
        {/* ============================================================ */}
        {activeTab === 'discovery' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Search, Filter Drawer Toggle, and Category Pills */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#F47736]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for clubs, rooftop bars, karaoke, DJs, or secret vibes..."
                    className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm rounded-xl bg-[#171513] border border-[#2E2923] text-white placeholder-[#78716A] focus:outline-none focus:border-[#F47736] transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                    className={`h-10 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                      isFilterDrawerOpen || selectedLocation !== 'All Areas' || selectedDateFilter !== 'Any Date' || selectedFeeFilter !== 'All' || selectedAtmosphere !== 'All Vibes'
                        ? 'bg-[#F47736]/15 border-[#F47736] text-[#F47736]'
                        : 'bg-[#171513] border-[#2E2923] text-[#A8A199] hover:text-white hover:border-[#38332C]'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters</span>
                    {(selectedLocation !== 'All Areas' || selectedDateFilter !== 'Any Date' || selectedFeeFilter !== 'All' || selectedAtmosphere !== 'All Vibes') && (
                      <span className="w-2 h-2 rounded-full bg-[#F47736]" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('map')}
                    className="h-10 px-3.5 rounded-xl bg-[#221F1B] hover:bg-[#2C2823] border border-[#38332C] text-xs font-semibold text-[#F7F4EF] flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#F47736]" />
                    <span className="hidden sm:inline">Nightlife Map</span>
                  </button>
                </div>
              </div>

              {/* Category Pills (Nightclubs, Rooftops, Live Music, DJ Nights, Karaoke & Comedy, Beach Parties, Secret After Hours) */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {categoryOptions.map((cat) => {
                  const isCatActive = selectedCategory === cat;
                  const isSecret = cat === 'Secret After Hours';
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat as any)}
                      className={`h-9 px-3.5 text-xs font-semibold rounded-xl border transition-all shrink-0 flex items-center gap-1.5 ${
                        isCatActive
                          ? isSecret
                            ? 'border-[#F47736] bg-gradient-to-r from-[#F47736] to-[#D9531E] text-white shadow-md shadow-[#F47736]/25'
                            : 'border-[#F47736] bg-[#F47736]/15 text-[#F47736]'
                          : isSecret
                            ? 'border-[#4A3B2C] bg-[#221B14] text-[#F47736] hover:border-[#F47736]'
                            : 'border-[#26221D] bg-[#171513] text-[#A8A199] hover:text-white hover:border-[#38332C]'
                      }`}
                    >
                      {isSecret && <Lock className="w-3 h-3 text-current" />}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Multi-Dimensional Filter Drawer */}
              {isFilterDrawerOpen && (
                <div className="p-4 rounded-2xl bg-[#171513] border border-[#2E2923] space-y-4 animate-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-[#26221D]">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-[#F47736]" />
                      <span className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                        Filter Nightlife By Location, Date, Fee & Vibe
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedLocation('All Areas');
                        setSelectedGenre('All');
                        setSelectedDateFilter('Any Date');
                        setSelectedFeeFilter('All');
                        setSelectedAtmosphere('All Vibes');
                      }}
                      className="text-xs text-[#F47736] hover:underline font-semibold"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Location */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#A8A199] mb-1">
                        Neighborhood / Area
                      </label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full h-8 px-2 text-xs rounded-lg bg-[#221F1B] border border-[#332E27] text-white focus:outline-none focus:border-[#F47736]"
                      >
                        {locationOptions.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#A8A199] mb-1">
                        Date & Timing
                      </label>
                      <select
                        value={selectedDateFilter}
                        onChange={(e) => setSelectedDateFilter(e.target.value)}
                        className="w-full h-8 px-2 text-xs rounded-lg bg-[#221F1B] border border-[#332E27] text-white focus:outline-none focus:border-[#F47736]"
                      >
                        <option value="Any Date">Any Date</option>
                        <option value="Tonight">Tonight</option>
                        <option value="Friday">Friday Night</option>
                        <option value="Saturday">Saturday Night</option>
                        <option value="Weekend">Full Weekend</option>
                      </select>
                    </div>

                    {/* Entrance Fee */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#A8A199] mb-1">
                        Entrance Fee
                      </label>
                      <select
                        value={selectedFeeFilter}
                        onChange={(e) => setSelectedFeeFilter(e.target.value)}
                        className="w-full h-8 px-2 text-xs rounded-lg bg-[#221F1B] border border-[#332E27] text-white focus:outline-none focus:border-[#F47736]"
                      >
                        <option value="All">All Entry Passes</option>
                        <option value="50_naira">50 Naira Entry (₦50)</option>
                        <option value="free">Free Guestlist</option>
                        <option value="vip">VIP Tables Only</option>
                      </select>
                    </div>

                    {/* Atmosphere */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#A8A199] mb-1">
                        Atmosphere & Vibe
                      </label>
                      <select
                        value={selectedAtmosphere}
                        onChange={(e) => setSelectedAtmosphere(e.target.value)}
                        className="w-full h-8 px-2 text-xs rounded-lg bg-[#221F1B] border border-[#332E27] text-white focus:outline-none focus:border-[#F47736]"
                      >
                        {atmosphereOptions.map((atm) => (
                          <option key={atm} value={atm}>{atm}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Popular Events Hero Banner (Directly Matching Left Screen Hero) */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#2E2923] shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black via-black/85 to-transparent z-10" />
              
              {/* Hero Image */}
              <img
                src="/public/assets/aistudio/a_9sZe1p8xV3c2TzGZaEe3_sZ51DUxv8pA4mn5DnlOOVAW1zUK4oQFWsATfubyvWSgN-2JPqgJUT7b8pWQXPAgBKGHdKKaviHaKDQchVUTllT7gPjSM4_oUAO6lbazeu3xwPCwdvplD211Vxp38ikgDp2uTc7K-Ozzl3ZWgmV1u17zCPAUxzikGPdew8yqip_7a35b71d.jpeg"
                alt="Where Every Night Finds Its Vibe"
                className="w-full h-64 sm:h-72 object-cover object-center transform group-hover:scale-102 transition-transform duration-500"
              />

              {/* Content Overlay */}
              <div className="absolute inset-0 z-20 p-5 sm:p-8 flex flex-col justify-between max-w-xl">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F47736] text-white text-[11px] font-bold tracking-wide shadow-sm">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>20 Slots Available · Tonight</span>
                  </span>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mt-2.5 leading-tight tracking-tight">
                    Where Every Night <br />
                    <span className="text-[#F47736]">Finds Its Vibe</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#D1C9BE] mt-1.5 leading-relaxed max-w-md">
                    Featured: Marquee Nightclub with Funktion-One acoustic stage, live guest selectors, and immersive visuals.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    onClick={() => setSelectedEvent(events[0])}
                    className="h-10 px-6 rounded-xl bg-white hover:bg-[#F7F4EF] text-[#0C0B0A] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-98"
                  >
                    <span>Explore Event</span>
                    <ArrowRight className="w-4 h-4 text-[#F47736]" />
                  </button>
                  <button
                    onClick={() => {
                      setBookingEvent(events[0]);
                      setTicketQuantity(1);
                    }}
                    className="h-10 px-5 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#F47736]/25 transition-all active:scale-98"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Book · {getEventPrice(events[0]).text}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Secret After Hours Pass Promo Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#201811] via-[#1A1410] to-[#120F0D] border border-[#F47736]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#F47736]/20 border border-[#F47736]/50 flex items-center justify-center shrink-0">
                  {afterHoursPass.isUnlocked ? (
                    <Unlock className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Lock className="w-6 h-6 text-[#F47736]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-sm sm:text-base text-white">
                      After Hours VIP Pass
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      afterHoursPass.isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#F47736]/20 text-[#F47736]'
                    }`}>
                      {afterHoursPass.isUnlocked ? 'Unlocked & Active' : '₦50 / $1 Access'}
                    </span>
                  </div>
                  <p className="text-xs text-[#A8A199] mt-0.5">
                    {afterHoursPass.isUnlocked
                      ? `Member ID: ${afterHoursPass.memberCode} · Secret Penthouse & Vault access codes unlocked below.`
                      : 'Unlock secret private invites, speakeasy door passcodes, and VIP concierge contacts.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {afterHoursPass.isUnlocked ? (
                  <button
                    onClick={() => setActiveTab('secret_pass')}
                    className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <span>View Secret Hub</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPassUnlockModalOpen(true)}
                    className="h-9 px-4 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-[#F47736]/25 active:scale-98"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock Pass (50 Naira)</span>
                  </button>
                )}
              </div>
            </div>

            {/* All Events Section Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                    Nightlife & Social Events ({filteredEvents.length})
                  </h3>
                  <p className="text-xs text-[#A8A199]">
                    Showing events for {selectedCategory} · {selectedLocation} · {selectedAtmosphere}
                  </p>
                </div>
                {(selectedCategory !== 'All' || selectedLocation !== 'All Areas' || selectedAtmosphere !== 'All Vibes') && (
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedLocation('All Areas');
                      setSelectedGenre('All');
                      setSelectedDateFilter('Any Date');
                      setSelectedFeeFilter('All');
                      setSelectedAtmosphere('All Vibes');
                    }}
                    className="text-xs text-[#F47736] hover:underline font-semibold"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map((event) => {
                  const isSaved = savedEventIds.includes(event.id);
                  const priceData = getEventPrice(event);
                  const isSecretLocked = event.isSecretExclusive && !afterHoursPass.isUnlocked;

                  return (
                    <div
                      key={event.id}
                      onClick={() => {
                        if (isSecretLocked) {
                          setIsPassUnlockModalOpen(true);
                        } else {
                          setSelectedEvent(event);
                        }
                      }}
                      className={`rounded-2xl bg-[#171513] border overflow-hidden cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-lg relative ${
                        isSecretLocked
                          ? 'border-[#875525] hover:border-[#F47736]'
                          : 'border-[#2A2621] hover:border-[#F47736]/50'
                      }`}
                    >
                      {/* Event Media Header with Overlay Badges */}
                      <div className="relative h-44 overflow-hidden bg-[#221F1B]">
                        <img
                          src={event.image || '/public/assets/aistudio/a_9sZe1p8xV3c2TzGZaEe3_sZ51DUxv8pA4mn5DnlOOVAW1zUK4oQFWsATfubyvWSgN-2JPqgJUT7b8pWQXPAgBKGHdKKaviHaKDQchVUTllT7gPjSM4_oUAO6lbazeu3xwPCwdvplD211Vxp38ikgDp2uTc7K-Ozzl3ZWgmV1u17zCPAUxzikGPdew8yqip_7a35b71d.jpeg'}
                          alt={event.title}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                            isSecretLocked ? 'blur-xs scale-105 brightness-60' : ''
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-transparent to-black/40" />

                        {/* Top Left Capacity / Secret Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          {event.isSecretExclusive ? (
                            <span className="px-2.5 py-1 rounded-lg bg-[#F47736] text-[10px] font-bold text-white shadow-md flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              <span>Secret After Hours</span>
                            </span>
                          ) : (
                            <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                              {event.slotsAvailable ? `${event.slotsAvailable} Slots Left` : `${event.attendeesCount} Joined`}
                            </div>
                          )}

                          {event.atmosphere && (
                            <span className="hidden sm:inline-block px-2 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-[#D1C9BE]">
                              {event.atmosphere}
                            </span>
                          )}
                        </div>

                        {/* Top Right Save / Heart Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveEvent(event.id);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors absolute top-3 right-3 ${
                            isSaved
                              ? 'bg-[#F47736] text-white shadow-md'
                              : 'bg-black/60 text-white/80 hover:text-white'
                          }`}
                          aria-label={isSaved ? 'Remove from saved' : 'Save event'}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>

                        {/* Secret Locked Veil Overlay */}
                        {isSecretLocked && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/60 backdrop-blur-xs">
                            <div className="w-9 h-9 rounded-full bg-[#F47736] text-white flex items-center justify-center shadow-lg mb-1">
                              <Lock className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-extrabold text-white">After Hours Pass Required</span>
                            <span className="text-[10px] text-[#F7A678] mt-0.5">Tap to unlock for 50 Naira (₦50)</span>
                          </div>
                        )}

                        {/* Bottom Genre Tags */}
                        {!isSecretLocked && event.genreTags && (
                          <div className="absolute bottom-2.5 left-3 flex gap-1.5 flex-wrap">
                            {event.genreTags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md bg-[#221F1B]/90 backdrop-blur-xs text-[10px] font-bold tracking-wider text-[#F47736] uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="font-heading font-bold text-sm text-white group-hover:text-[#F47736] transition-colors line-clamp-1">
                            {event.title}
                          </h4>
                          <p className="text-xs text-[#A8A199] flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#F47736] shrink-0" />
                            <span className="truncate">
                              {isSecretLocked ? 'Secret Location (Unlock to Reveal)' : (event.venueName || event.location)}
                            </span>
                          </p>
                          <p className="text-xs text-[#78716A] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>{event.date} · {event.time}</span>
                          </p>
                        </div>

                        {/* Secret Passcode Pill if Unlocked */}
                        {event.isSecretExclusive && afterHoursPass.isUnlocked && event.secretDoorPasscode && (
                          <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-emerald-400">
                              <Unlock className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-[11px] font-bold">Door Code:</span>
                            </div>
                            <span className="font-mono font-bold text-white text-xs tracking-wider">
                              {event.secretDoorPasscode}
                            </span>
                          </div>
                        )}

                        {/* Price & Action Row */}
                        <div className="pt-2 border-t border-[#26221D] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase text-[#78716A] block">
                              {event.isSecretExclusive ? 'VIP Exclusive' : 'Cover / Entry Pass'}
                            </span>
                            <span className="font-heading font-bold text-sm text-[#F47736]">
                              {event.isSecretExclusive ? 'Included in Pass' : priceData.text}
                            </span>
                          </div>

                          {isSecretLocked ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsPassUnlockModalOpen(true);
                              }}
                              className="h-8 px-3.5 rounded-lg bg-gradient-to-r from-[#F47736] to-[#E06524] text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
                            >
                              <Lock className="w-3 h-3" />
                              <span>Unlock (₦50)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBookingEvent(event);
                                setTicketQuantity(1);
                              }}
                              className="h-8 px-3.5 rounded-lg bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                            >
                              <span>Book</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB: LIVE INTERACTIVE NIGHTLIFE MAP                          */}
        {/* ============================================================ */}
        {activeTab === 'map' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Map Header & Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    Live Nightlife Radar & Map
                  </h3>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Beacon</span>
                  </span>
                </div>
                <p className="text-xs text-[#A8A199] mt-0.5">
                  Real-time club locations, active DJ headline sets, ETA directions, and friend invites.
                </p>
              </div>

              {/* Map Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 self-stretch sm:self-auto">
                {[
                  { id: 'all', label: 'All Hotspots' },
                  { id: 'djs_tonight', label: '🎧 DJs Tonight' },
                  { id: 'open_now', label: '⚡ Open Now' },
                  { id: 'vip', label: '👑 VIP Lounges' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setMapFilter(f.id as any)}
                    className={`h-8 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                      mapFilter === f.id
                        ? 'bg-[#F47736] border-[#F47736] text-white shadow-sm'
                        : 'bg-[#1C1A17] border-[#2E2923] text-[#A8A199] hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Nightlife Map Canvas */}
            <div className="relative w-full h-[460px] sm:h-[520px] rounded-3xl bg-[#0D0B0A] border-2 border-[#2E2923] overflow-hidden shadow-2xl select-none">
              
              {/* Stylized Urban Grid Background */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="nightGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F47736" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#nightGrid)" />
                </svg>
              </div>

              {/* Stylized Neon Street Curves & Waterfront */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                {/* Waterfront curve */}
                <path d="M 0 100 Q 250 80 500 130 T 1000 120" fill="none" stroke="#00E5FF" strokeWidth="3" strokeDasharray="6,4" />
                {/* Major Nightlife Boulevard */}
                <path d="M 50 450 Q 300 350 450 250 T 800 50" fill="none" stroke="#F47736" strokeWidth="3" opacity="0.6" />
                {/* Cross Street */}
                <path d="M 200 50 L 600 480" fill="none" stroke="#8A7A6E" strokeWidth="1.5" strokeDasharray="4,4" />
                <path d="M 100 280 L 800 280" fill="none" stroke="#8A7A6E" strokeWidth="1.5" strokeDasharray="4,4" />
              </svg>

              {/* District Watermarks */}
              <div className="absolute top-4 left-6 text-[11px] font-extrabold uppercase tracking-widest text-[#5A5147] pointer-events-none">
                HARBOUR WATERFRONT PROMENADE
              </div>
              <div className="absolute top-1/2 left-8 text-[11px] font-extrabold uppercase tracking-widest text-[#5A5147] pointer-events-none">
                CENTRAL DISTRICT
              </div>
              <div className="absolute bottom-8 right-12 text-[11px] font-extrabold uppercase tracking-widest text-[#5A5147] pointer-events-none">
                SOHO & ENTERTAINMENT STRIP
              </div>

              {/* Animated Radar Pulse at Center (User Location) */}
              <div className="absolute left-[38%] top-[52%] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                <span className="absolute w-40 h-40 rounded-full border border-[#F47736]/20 animate-ping duration-1000" />
                <span className="absolute w-20 h-20 rounded-full bg-[#F47736]/10 border border-[#F47736]/40" />
                <div className="w-4 h-4 rounded-full bg-[#F47736] border-2 border-white shadow-lg shadow-[#F47736]/50 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
                <span className="absolute top-5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-bold text-white whitespace-nowrap border border-white/20">
                  You Are Here · Central
                </span>
              </div>

              {/* Venue Interactive Markers */}
              {venues
                .filter((v) => {
                  if (mapFilter === 'djs_tonight') return Boolean(v.djTonight);
                  if (mapFilter === 'open_now') return v.status === 'Open Now';
                  if (mapFilter === 'vip') return v.vipAvailable;
                  return true;
                })
                .map((venue) => {
                  const isSelected = selectedMapVenue?.id === venue.id;
                  const x = venue.mapX ?? 50;
                  const y = venue.mapY ?? 50;

                  return (
                    <div
                      key={venue.id}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      onClick={() => setSelectedMapVenue(venue)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group z-30 ${
                        isSelected ? 'scale-115 z-40' : 'hover:scale-110'
                      }`}
                    >
                      {/* Pulse Ring when selected */}
                      {isSelected && (
                        <span className="absolute -inset-2 rounded-2xl bg-[#F47736]/30 animate-pulse" />
                      )}

                      {/* Map Pin Badge */}
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shadow-xl backdrop-blur-md transition-all ${
                          isSelected
                            ? 'bg-[#F47736] text-white border-white scale-105 shadow-2xl shadow-[#F47736]/40'
                            : 'bg-[#1C1A17]/95 text-white border-[#3E372E] group-hover:border-[#F47736]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-black/30' : 'bg-[#2E2822] text-[#F47736]'
                        }`}>
                          {venue.type.includes('Club') ? (
                            <Flame className="w-3 h-3" />
                          ) : venue.type.includes('Rooftop') ? (
                            <Wine className="w-3 h-3" />
                          ) : (
                            <Music className="w-3 h-3" />
                          )}
                        </div>

                        <div className="text-left">
                          <span className="font-heading font-extrabold text-[11px] block leading-none">
                            {venue.name}
                          </span>
                          <span className={`text-[9px] block leading-none mt-0.5 ${
                            isSelected ? 'text-white/80' : 'text-[#A8A199]'
                          }`}>
                            {venue.djTonight ? `🎧 ${venue.djTonight.split(' ')[0]}` : venue.distance}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* Map Floating Legend / Stats */}
              <div className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-[#2E2923] text-[11px] space-y-1.5 text-[#D1C9BE] hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F47736]" />
                  <span>Nightclubs & Lounges</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Open Now & Active Sets</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
                  <span>Waterfront Strip</span>
                </div>
              </div>

              {/* Bottom Selected Venue Overlay Card */}
              {selectedMapVenue ? (
                <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6 sm:max-w-xl sm:mx-auto p-4 rounded-2xl bg-[#141210]/95 backdrop-blur-xl border-2 border-[#F47736] shadow-2xl animate-in slide-in-from-bottom-4 duration-200 z-40 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={selectedMapVenue.image}
                        alt={selectedMapVenue.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-extrabold text-sm sm:text-base text-white truncate">
                            {selectedMapVenue.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 shrink-0">
                            {selectedMapVenue.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#A8A199] flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#F47736] shrink-0" />
                          <span className="truncate">{selectedMapVenue.address} · {selectedMapVenue.distance} away</span>
                        </p>
                        {selectedMapVenue.djTonight && (
                          <p className="text-[11px] text-[#F47736] font-semibold flex items-center gap-1.5 mt-0.5">
                            <Headphones className="w-3.5 h-3.5 shrink-0" />
                            <span>DJ Tonight: {selectedMapVenue.djTonight}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedMapVenue(null)}
                      className="w-7 h-7 rounded-full bg-[#221F1B] hover:bg-[#2E2822] text-[#A8A199] hover:text-white flex items-center justify-center shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Actions Row: Directions, Invite Friends, Book Passes */}
                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#26221D]">
                    <button
                      type="button"
                      onClick={() => setDirectionsModalVenue(selectedMapVenue)}
                      className="flex-1 h-9 px-3 rounded-xl bg-[#221F1B] hover:bg-[#2C2823] border border-[#3A332B] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#F47736]" />
                      <span>Directions</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSharingVenue(selectedMapVenue)}
                      className="flex-1 h-9 px-3 rounded-xl bg-[#221F1B] hover:bg-[#2C2823] border border-[#3A332B] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#F47736]" />
                      <span>Invite Friends</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const matchedEvent = events.find((e) => e.venueName === selectedMapVenue.name) || events[0];
                        setBookingEvent(matchedEvent);
                        setTicketQuantity(1);
                      }}
                      className="flex-1 h-9 px-3 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-[#F47736]/20"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Book Pass</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-3 left-4 right-4 sm:left-auto sm:right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-[#2E2923] text-xs text-[#D1C9BE] flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-[#F47736] shrink-0" />
                  <span>Tap any venue marker on the radar to see DJ lineup, ETA directions, and invite friends.</span>
                </div>
              )}
            </div>

            {/* Venues Active Tonight Carousel Cards */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-white">
                  Active Venues on Tonight's Radar
                </h4>
                <span className="text-xs text-[#A8A199]">{venues.length} venues mapped</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {venues.slice(0, 3).map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedMapVenue(v)}
                    className="p-3 rounded-xl bg-[#171513] border border-[#26221D] hover:border-[#F47736]/40 cursor-pointer flex items-center gap-3 transition-colors"
                  >
                    <img src={v.image} alt={v.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h5 className="font-heading font-bold text-xs text-white truncate">{v.name}</h5>
                      <p className="text-[11px] text-[#A8A199] truncate">{v.distance} away · {v.status}</p>
                      <p className="text-[10px] text-[#F47736] font-medium truncate">🎧 {v.djTonight || 'Resident Selectors'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: NEARBY CLUBS & VENUES                                 */}
        {/* ============================================================ */}
        {activeTab === 'venues' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                  Nearby Clubs, Speakeasies & Lounges
                </h3>
                <p className="text-xs text-[#A8A199]">
                  Verified nightlife spaces with guestlist privileges and bottle service.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredVenues.map((venue) => {
                const isSaved = venue.isSaved;
                return (
                  <div
                    key={venue.id}
                    className="rounded-2xl bg-[#171513] border border-[#2A2621] hover:border-[#F47736]/40 overflow-hidden shadow-lg p-4 space-y-3"
                  >
                    <div className="relative h-40 rounded-xl overflow-hidden bg-[#221F1B]">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-bold text-[#F47736] border border-[#F47736]/30">
                        {venue.type}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSaveVenue(venue.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-xs absolute top-2.5 right-2.5 ${
                          isSaved ? 'bg-[#F47736] text-white' : 'bg-black/60 text-white'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>

                      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="font-bold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#F47736]" />
                          {venue.distance} away
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                          {venue.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading font-bold text-base text-white">
                          {venue.name}
                        </h4>
                        <span className="text-xs font-bold text-[#F47736]">
                          ★ {venue.rating} ({venue.reviewCount})
                        </span>
                      </div>
                      <p className="text-xs text-[#A8A199]">{venue.address}</p>
                      <p className="text-xs text-[#78716A]">Hours: {venue.openingHours}</p>

                      <div className="flex gap-1.5 flex-wrap pt-1">
                        {venue.vibeTags.map((vibe) => (
                          <span
                            key={vibe}
                            className="px-2 py-0.5 rounded-md bg-[#221F1B] text-[10px] text-[#D1C9BE] font-medium"
                          >
                            {vibe}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-[#26221D] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#78716A] block">Entry Cover</span>
                        <span className="text-xs font-semibold text-white">{venue.entryCover}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          showToast(`Opened guestlist request for ${venue.name}`, 'warm');
                        }}
                        className="h-8 px-3.5 rounded-lg bg-[#221F1B] hover:bg-[#2C2823] border border-[#38332C] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                      >
                        <span>Join Guestlist</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#F47736]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: DJ & ENTERTAINER PROFILES, VIDEOS & BOOKING           */}
        {/* ============================================================ */}
        {activeTab === 'entertainers' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">
                  DJ, Hype Men & Entertainer Directory
                </h3>
                <p className="text-xs text-[#A8A199] mt-0.5">
                  Watch live performance video clips, browse upcoming appearances, and book talent for private events.
                </p>
              </div>

              {/* Role Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 self-stretch sm:self-auto">
                {['All Talent', 'DJs', 'Hype Men & MCs', 'Dancers', 'Live Electronic', 'Event Hosts'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setEntertainerRoleFilter(role as any)}
                    className={`h-8 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                      entertainerRoleFilter === role
                        ? 'bg-[#F47736] border-[#F47736] text-white shadow-sm'
                        : 'bg-[#1C1A17] border-[#2E2923] text-[#A8A199] hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEntertainers.map((dj) => {
                const isPlaying = playingMixId === dj.id;
                return (
                  <div
                    key={dj.id}
                    className="rounded-2xl bg-[#171513] border border-[#2A2621] hover:border-[#F47736]/40 p-4.5 space-y-4 shadow-lg flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-3.5">
                      {/* Avatar & Header */}
                      <div className="flex items-start gap-3">
                        <img
                          src={dj.avatar}
                          alt={dj.stageName}
                          className="w-14 h-14 rounded-2xl object-cover shrink-0 border-2 border-[#F47736]/40 shadow-md"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-heading font-bold text-base text-white truncate">
                              {dj.stageName}
                            </h4>
                            {dj.verifiedEntertainer && (
                              <Award className="w-4 h-4 text-[#F47736] shrink-0" />
                            )}
                          </div>
                          <span className="text-xs text-[#F47736] font-medium block">
                            {dj.role}
                          </span>
                          <span className="text-[11px] text-[#A8A199]">
                            ★ {dj.rating} ({dj.reviewCount} verified gigs)
                          </span>
                        </div>
                      </div>

                      {/* Performance Video Preview Launcher Button */}
                      <button
                        type="button"
                        onClick={() => setViewingVideoTalent(dj)}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#221B14] to-[#1C1713] hover:from-[#2A2016] hover:to-[#221B14] border border-[#F47736]/30 flex items-center justify-between text-xs font-semibold text-white group/vid transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#F47736] text-white flex items-center justify-center shrink-0 group-hover/vid:scale-105 transition-transform">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                          <span className="text-[11px] font-bold text-[#F7F4EF] truncate">
                            {dj.videoTitle || 'Watch Live Set Clip'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#F47736] font-mono bg-black/40 px-1.5 py-0.5 rounded">
                          {dj.videoDuration || '0:45'}
                        </span>
                      </button>

                      {/* Bio */}
                      <p className="text-xs text-[#D1C9BE] leading-relaxed line-clamp-2">
                        {dj.bio}
                      </p>

                      {/* Entertainment Styles / Vibe Badges */}
                      {dj.entertainmentStyles && (
                        <div className="flex gap-1.5 flex-wrap">
                          {dj.entertainmentStyles.map((style) => (
                            <span
                              key={style}
                              className="px-2 py-0.5 rounded-md bg-[#221F1B] border border-[#2E2923] text-[10px] font-semibold text-[#D1C9BE]"
                            >
                              ⚡ {style}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Upcoming Appearances Snippet */}
                      {dj.appearances && dj.appearances.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-[#1C1A17] border border-[#26221D] space-y-1">
                          <span className="text-[10px] text-[#78716A] uppercase font-bold tracking-wider block">
                            Upcoming Appearances
                          </span>
                          <div className="space-y-1">
                            {dj.appearances.slice(0, 2).map((app, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-white truncate">{app.venue}</span>
                                <span className="text-[#F47736] text-[10px] shrink-0 font-medium">{app.date}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Organizer Review Snippet */}
                      {dj.reviews && dj.reviews[0] && (
                        <div className="p-2.5 rounded-xl bg-[#1A1815] border border-[#26221D] text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[#F47736] font-bold text-[10px]">★ {dj.reviews[0].rating}.0 Organiser Review</span>
                            <span className="text-[#78716A] text-[9px]">{dj.reviews[0].event}</span>
                          </div>
                          <p className="text-[#A8A199] italic line-clamp-2">
                            "{dj.reviews[0].comment}"
                          </p>
                          <span className="text-[10px] text-white/60 block font-medium">— {dj.reviews[0].reviewer}</span>
                        </div>
                      )}

                      {/* Audio Mix Preview Player */}
                      <div className="p-2.5 rounded-xl bg-[#221F1B] border border-[#2E2923] flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-[#78716A] block uppercase tracking-wide">
                            Audio Mix Preview ({dj.mixDuration})
                          </span>
                          <span className="text-xs font-semibold text-white truncate block">
                            {dj.mixTitle}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPlayingMixId(isPlaying ? null : dj.id);
                            showToast(isPlaying ? 'Audio paused' : `Now streaming: ${dj.mixTitle}`, 'warm');
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isPlaying ? 'bg-[#F47736] text-white animate-pulse' : 'bg-[#332E27] text-white hover:bg-[#F47736]'
                          }`}
                        >
                          {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Booking Rate & CTA */}
                    <div className="pt-3 border-t border-[#26221D] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#78716A] block">Booking Rate</span>
                        <span className="text-xs font-bold text-[#F47736]">{dj.hourlyRate}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setBookingEntertainer(dj)}
                        className="h-8 px-3.5 rounded-lg bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <span>Book Talent</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: AFTER HOURS PASS (SECRET HOOKUP & VIP HUB)            */}
        {/* ============================================================ */}
        {activeTab === 'secret_pass' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Hero Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#22160E] via-[#1B120B] to-[#120E0B] border-2 border-[#F47736]/50 shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl space-y-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#F47736] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    <span>LinkedOut After Hours Pass</span>
                  </span>
                  {afterHoursPass.isUnlocked && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      ✓ Pass Active · {afterHoursPass.memberCode}
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white leading-tight">
                  Premium VIP Access & Exclusive Experiences
                </h3>

                <p className="text-xs sm:text-sm text-[#D1C9BE] leading-relaxed">
                  Unlock secret speakeasy passcodes, private penthouse invitations, VIP lounge access, and direct host concierge connections. A verified, consent-based private nightlife community.
                </p>

                <p className="text-[11px] text-[#A8A199] italic">
                  Illustrative concept — actual access, table packages, and door privileges are confirmed by venue management and private hosts.
                </p>
              </div>
            </div>

            {/* If Unlocked: Show Active Pass & Secret Locations */}
            {afterHoursPass.isUnlocked ? (
              <div className="space-y-6">
                {/* Active Membership Badge Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#191612] border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Unlock className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-base text-white">Your After Hours Pass is Active</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          {afterHoursPass.tier === 'black_vip' ? 'LinkedOut Black Card' : '50 Naira Night Pass'}
                        </span>
                      </div>
                      <p className="text-xs text-[#A8A199] mt-0.5">
                        Member ID: <span className="text-white font-mono font-semibold">{afterHoursPass.memberCode}</span> · Valid for tonight's late night events and speakeasies.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('VIP Concierge hotline copied to clipboard: +234-800-LINKEDOUT-VIP', 'success')}
                    className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-colors self-end sm:self-auto"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Concierge</span>
                  </button>
                </div>

                {/* Secret Locations & Passcodes Grid */}
                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-base text-white">
                    Secret Nightlife Locations & Live Door Codes
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Secret Spot 1 */}
                    <div className="p-5 rounded-2xl bg-[#171513] border-2 border-[#F47736]/40 space-y-4 shadow-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] text-[#F47736] font-bold uppercase tracking-wider block">
                            Private Penthouse · Soho
                          </span>
                          <h5 className="font-heading font-extrabold text-lg text-white mt-1">
                            The Soho Penthouse 779
                          </h5>
                          <p className="text-xs text-[#A8A199]">18 Wyndham St, Top Floor Private Elevator</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#F47736]/20 text-[#F47736] text-[10px] font-bold">
                          Private Invite Only
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0F0E0C] border border-[#2E2923] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#A8A199]">Secret Door Keypad Code:</span>
                          <span className="font-mono font-extrabold text-sm text-[#F47736] bg-[#221B14] px-2.5 py-1 rounded border border-[#F47736]/30">
                            PENTHOUSE-779-ORANGE
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#D1C9BE]">
                          <span>Host Contact:</span>
                          <span className="font-semibold text-white">Direct Line +234-800-VIP</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#D1C9BE]">
                        Atmosphere: Rooftop Sunset, Deep House & Afrobeats, Private Bar, Curated Guestlist.
                      </p>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => showToast('Door passcode PENTHOUSE-779-ORANGE copied!', 'warm')}
                          className="flex-1 h-9 rounded-xl bg-[#221F1B] hover:bg-[#2C2823] border border-[#38332C] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5 text-[#F47736]" />
                          <span>Copy Passcode</span>
                        </button>
                        <button
                          onClick={() => {
                            const matched = events.find((e) => e.id === 'secret_penthouse') || events[0];
                            setSelectedEvent(matched);
                          }}
                          className="flex-1 h-9 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>View Event Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Secret Spot 2 */}
                    <div className="p-5 rounded-2xl bg-[#171513] border-2 border-[#F47736]/40 space-y-4 shadow-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] text-[#F47736] font-bold uppercase tracking-wider block">
                            Underground Speakeasy · Central
                          </span>
                          <h5 className="font-heading font-extrabold text-lg text-white mt-1">
                            The Vault Society
                          </h5>
                          <p className="text-xs text-[#A8A199]">Behind Barber Shop Antique Mirror, Central</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#F47736]/20 text-[#F47736] text-[10px] font-bold">
                          Password Required
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0F0E0C] border border-[#2E2923] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#A8A199]">Spoken Door Password:</span>
                          <span className="font-mono font-extrabold text-sm text-[#F47736] bg-[#221B14] px-2.5 py-1 rounded border border-[#F47736]/30">
                            VAULT-WHISKY-992
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#D1C9BE]">
                          <span>Concierge Telegram:</span>
                          <span className="font-semibold text-white">@linkedout_vip_host</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#D1C9BE]">
                        Atmosphere: Underground Velvet Lounge, Vinyl Selectors, Single Malts, Intimate Seating.
                      </p>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => showToast('Door password VAULT-WHISKY-992 copied!', 'warm')}
                          className="flex-1 h-9 rounded-xl bg-[#221F1B] hover:bg-[#2C2823] border border-[#38332C] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5 text-[#F47736]" />
                          <span>Copy Password</span>
                        </button>
                        <button
                          onClick={() => {
                            const matched = events.find((e) => e.id === 'secret_vault_society') || events[0];
                            setSelectedEvent(matched);
                          }}
                          className="flex-1 h-9 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>View Event Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* If Locked: Pass Purchase Cards (50 Naira / $1 / Crypto) */
              <div className="space-y-6">
                {/* 4 Core Perks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { title: 'Private Invitations', desc: 'Direct invites to secret rooftop after-parties and closed loft sessions.' },
                    { title: 'Secret Door Codes', desc: 'Real-time keypad passcodes and speakeasy hidden bookcase entrances.' },
                    { title: 'VIP Host Concierge', desc: 'Direct WhatsApp line for bottle service reservation and guestlist assistance.' },
                    { title: 'Consent-Based Safe Socials', desc: 'Curated adult networking and nightlife connections with safety rules.' },
                  ].map((perk, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#171513] border border-[#2E2923] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#F47736]" />
                        <h5 className="font-heading font-bold text-xs text-white">{perk.title}</h5>
                      </div>
                      <p className="text-[11px] text-[#A8A199] leading-relaxed">{perk.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Pricing Tiers to Unlock */}
                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-base text-white">
                    Select Your After Hours Pass
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Tier 1: 50 Naira Entry Pass (Default / Most Popular) */}
                    <div className="p-5 rounded-2xl bg-[#1A1612] border-2 border-[#F47736] space-y-4 shadow-xl relative flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-[#F47736] text-white text-[10px] font-bold uppercase tracking-wider">
                            Most Popular · Instant Unlock
                          </span>
                          <Lock className="w-4 h-4 text-[#F47736]" />
                        </div>
                        <h5 className="font-heading font-extrabold text-lg text-white">
                          50 Naira Night Pass
                        </h5>
                        <p className="text-xs text-[#D1C9BE]">
                          Full one-night access to secret speakeasies, door passcodes, and late night event entries.
                        </p>
                        <div className="pt-2">
                          <span className="font-heading font-extrabold text-2xl text-[#F47736] block">
                            ₦50 Naira
                          </span>
                          <span className="text-[10px] text-[#A8A199]">
                            Pay via Zenith Bank Transfer, USSD (*966#), or Debit Card
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsPassUnlockModalOpen(true)}
                        className="w-full h-10 mt-3 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#F47736]/25 transition-all"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock for 50 Naira (₦50)</span>
                      </button>
                    </div>

                    {/* Tier 2: $1 Dollar Standard Pass */}
                    <div className="p-5 rounded-2xl bg-[#171513] border border-[#2E2923] hover:border-[#F47736]/40 space-y-4 shadow-lg flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] text-[#A8A199] font-bold uppercase tracking-wider block">
                          International Pass
                        </span>
                        <h5 className="font-heading font-extrabold text-lg text-white">
                          $1 USD Standard
                        </h5>
                        <p className="text-xs text-[#D1C9BE]">
                          Access for international visitors using Visa, Mastercard, or Apple Pay.
                        </p>
                        <div className="pt-2">
                          <span className="font-heading font-extrabold text-2xl text-white block">
                            $1.00 USD
                          </span>
                          <span className="text-[10px] text-[#A8A199]">
                            Instant charge via Stripe / Apple Pay
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsPassUnlockModalOpen(true)}
                        className="w-full h-10 mt-3 rounded-xl bg-[#221F1B] hover:bg-[#2C2823] border border-[#38332C] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-[#F47736]" />
                        <span>Unlock with Card ($1)</span>
                      </button>
                    </div>

                    {/* Tier 3: Crypto 0.05 USDT */}
                    <div className="p-5 rounded-2xl bg-[#171513] border border-[#2E2923] hover:border-[#F47736]/40 space-y-4 shadow-lg flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] text-[#A8A199] font-bold uppercase tracking-wider block">
                          Web3 / Crypto
                        </span>
                        <h5 className="font-heading font-extrabold text-lg text-white">
                          0.05 USDT Crypto Pass
                        </h5>
                        <p className="text-xs text-[#D1C9BE]">
                          Decentralized nightlife pass via Polygon, Arbitrum, or Solana.
                        </p>
                        <div className="pt-2">
                          <span className="font-heading font-extrabold text-2xl text-white block">
                            0.05 USDT
                          </span>
                          <span className="text-[10px] text-[#A8A199]">
                            Scan QR code or connect Web3 wallet
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsPassUnlockModalOpen(true)}
                        className="w-full h-10 mt-3 rounded-xl bg-[#221F1B] hover:bg-[#2C2823] border border-[#38332C] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5 text-[#F47736]" />
                        <span>Unlock with Crypto</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB: VIP & EXCLUSIVE EXPERIENCES                             */}
        {/* ============================================================ */}
        {activeTab === 'vip' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#221B14] via-[#1B1612] to-[#120F0D] border border-[#F47736]/30 shadow-2xl relative overflow-hidden">
              <div className="max-w-xl space-y-2 relative z-10">
                <span className="px-2.5 py-1 rounded-full bg-[#F47736] text-white text-[10px] font-bold uppercase tracking-wider">
                  LinkedOut Black Card Experience
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-white">
                  VIP Bottle Service & Private Vaults
                </h3>
                <p className="text-xs text-[#D1C9BE] leading-relaxed">
                  Dedicated hostess, skip-the-line escort, reserved elevated booths, and premium artisan spirits across top partner venues.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  tier: 'Silver Mezzanine Table',
                  venue: 'Boomerang Nightclub',
                  priceNgn: 15000,
                  priceUsd: 15,
                  priceCrypto: 15,
                  guests: 'Up to 4 Guests',
                  perks: ['1 Premium Spirit Bottle + Mixers', 'Express Entry Pass', 'Dedicated Table Server'],
                  eventId: 'event_marquee',
                },
                {
                  tier: 'Harbour Sunset Cabana',
                  venue: 'Horizon Sky Lounge',
                  priceNgn: 22000,
                  priceUsd: 22,
                  priceCrypto: 22,
                  guests: 'Up to 6 Guests',
                  perks: ['2 Bottles Champagne', 'Chef Charcuterie Platter', 'Panoramic View Guarantee'],
                  eventId: 'event_velvet_rooftop',
                },
                {
                  tier: 'Secret Vault & Speakeasy Room',
                  venue: 'Blind Tiger Speakeasy',
                  priceNgn: 30000,
                  priceUsd: 30,
                  priceCrypto: 30,
                  guests: 'Up to 8 Guests',
                  perks: ['Rare Single Malt Flight', 'Private Bartender for 3 Hours', 'Hidden Bookcase Access'],
                  eventId: 'event_underground_jazz',
                },
              ].map((vip) => {
                const formattedPrice = currencyMode === 'NGN'
                  ? `₦${vip.priceNgn.toLocaleString()}`
                  : currencyMode === 'USD'
                    ? `$${vip.priceUsd}`
                    : `${vip.priceCrypto} USDT`;

                return (
                  <div
                    key={vip.tier}
                    className="rounded-2xl bg-[#171513] border border-[#2E2923] p-5 space-y-4 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#F47736] font-bold uppercase tracking-wider">
                          {vip.venue}
                        </span>
                        <Crown className="w-4 h-4 text-[#F47736]" />
                      </div>
                      <h4 className="font-heading font-extrabold text-lg text-white">
                        {vip.tier}
                      </h4>
                      <span className="text-xs text-[#A8A199] block font-medium">
                        {vip.guests}
                      </span>
                      <span className="font-heading font-extrabold text-xl text-[#F47736] block">
                        {formattedPrice}
                      </span>

                      <div className="space-y-1.5 pt-2 border-t border-[#26221D]">
                        {vip.perks.map((p) => (
                          <div key={p} className="flex items-center gap-2 text-xs text-[#D1C9BE]">
                            <Check className="w-3.5 h-3.5 text-[#F47736] shrink-0" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const matched = events.find((e) => e.id === vip.eventId) || events[0];
                        setBookingEvent(matched);
                        setSelectedTier('vip');
                        setTicketQuantity(1);
                      }}
                      className="w-full h-10 mt-2 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#F47736]/20"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>Reserve VIP ({formattedPrice})</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: SAVED EVENTS & MY PASSES (QR CODES)                   */}
        {/* ============================================================ */}
        {activeTab === 'plans' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                My Booked Nightlife Passes & Saved Events
              </h3>
              <p className="text-xs text-[#A8A199]">
                Show your active digital QR pass at venue door for express admission.
              </p>
            </div>

            {/* Booked Passes List */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F47736] block">
                Active Door Passes ({bookedTickets.length})
              </span>

              {bookedTickets.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#171513] border border-[#2A2621] text-center space-y-2">
                  <Ticket className="w-8 h-8 text-[#78716A] mx-auto" />
                  <p className="text-sm font-semibold text-white">No active passes yet</p>
                  <p className="text-xs text-[#A8A199]">Book tickets from the Nightlife Discovery tab to get instant QR door passes.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookedTickets.map((tkt) => (
                    <div
                      key={tkt.id}
                      onClick={() => setViewingTicketPass(tkt)}
                      className="p-4.5 rounded-2xl bg-gradient-to-br from-[#1C1915] to-[#141210] border border-[#F47736]/40 shadow-xl space-y-3 cursor-pointer hover:border-[#F47736] transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                            {tkt.status}
                          </span>
                          <h4 className="font-heading font-bold text-base text-white mt-1 group-hover:text-[#F47736] transition-colors">
                            {tkt.eventTitle}
                          </h4>
                          <p className="text-xs text-[#A8A199]">{tkt.venueName}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center">
                          <QrCode className="w-8 h-8 text-black" />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#0C0B0A] border border-[#26221D] flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-[#78716A] block">Date & Time</span>
                          <span className="font-semibold text-white">{tkt.date} · {tkt.time}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#78716A] block">Pass & Paid</span>
                          <span className="font-semibold text-[#F47736]">{tkt.quantity} Pass ({tkt.currency} {tkt.totalPaid})</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#78716A] pt-1">
                        <span>Ref: {tkt.bookingRef}</span>
                        <span className="text-[#F47736] font-semibold flex items-center gap-1 group-hover:underline">
                          View Door Pass <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Bookmarks */}
            <div className="space-y-3 pt-4 border-t border-[#26221D]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A8A199] block">
                Saved Nightlife Events ({savedEventIds.length})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {events
                  .filter((e) => savedEventIds.includes(e.id))
                  .map((e) => (
                    <div
                      key={e.id}
                      className="p-3.5 rounded-xl bg-[#171513] border border-[#2A2621] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <h5 className="font-heading font-bold text-xs text-white truncate">{e.title}</h5>
                        <p className="text-[11px] text-[#A8A199] truncate">{e.venueName || e.location} · {e.date}</p>
                      </div>
                      <button
                        onClick={() => {
                          setBookingEvent(e);
                          setTicketQuantity(1);
                        }}
                        className="h-8 px-3 rounded-lg bg-[#F47736] text-white text-xs font-semibold shrink-0"
                      >
                        Book
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* SCREEN 2 MODAL: EVENT DETAILS & TICKETS (Center Phone View)  */}
      {/* ============================================================ */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-lg bg-[#141210] border border-[#2E2923] rounded-3xl overflow-hidden shadow-2xl space-y-0 animate-in zoom-in-95 duration-150 my-auto text-[#F7F4EF]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Hero Image Container matching Center Screen */}
            <div className="relative h-60 sm:h-72 w-full bg-black">
              <img
                src={selectedEvent.image || '/public/assets/aistudio/a_9sZe1p8xV3c2TzGZaEe3_sZ51DUxv8pA4mn5DnlOOVAW1zUK4oQFWsATfubyvWSgN-2JPqgJUT7b8pWQXPAgBKGHdKKaviHaKDQchVUTllT7gPjSM4_oUAO6lbazeu3xwPCwdvplD211Vxp38ikgDp2uTc7K-Ozzl3ZWgmV1u17zCPAUxzikGPdew8yqip_7a35b71d.jpeg'}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/30 to-black/60" />

              {/* Top Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSaveEvent(selectedEvent.id)}
                    className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${savedEventIds.includes(selectedEvent.id) ? 'fill-[#F47736] text-[#F47736]' : ''}`} />
                  </button>
                  <button
                    onClick={() => showToast('Event link copied to clipboard', 'warm')}
                    className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Genre Badges on Hero */}
              <div className="absolute bottom-4 left-5 flex gap-2">
                {(selectedEvent.genreTags || ['HIP HOP', 'HOUSE']).map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 rounded-md bg-[#221F1B]/90 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-[#F47736]"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Event Body Content */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[50vh] overflow-y-auto">
              <div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  {selectedEvent.title}
                </h3>
                <p className="text-xs text-[#A8A199] mt-1">
                  Experience unforgettable parties at {selectedEvent.venueName || selectedEvent.location}.
                </p>
              </div>

              {/* Boomerang & Schedule Interactive Rows (Directly Matching Center Screen) */}
              <div className="space-y-2">
                {/* Location Row */}
                <div
                  onClick={() => showToast(`Opening map location for ${selectedEvent.venueName || selectedEvent.location}`, 'warm')}
                  className="p-3.5 rounded-xl bg-[#1C1A17] border border-[#2E2923] hover:border-[#F47736]/40 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#28241F] flex items-center justify-center text-[#F47736]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-xs text-white block">
                        {selectedEvent.venueName || selectedEvent.location}
                      </span>
                      <span className="text-[11px] text-[#A8A199]">
                        {selectedEvent.venueAddress || 'View interactive venue map'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#78716A]" />
                </div>

                {/* Schedule Row */}
                <div className="p-3.5 rounded-xl bg-[#1C1A17] border border-[#2E2923] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#28241F] flex items-center justify-center text-[#F47736]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-xs text-white block">
                        {selectedEvent.date}, {selectedEvent.time}
                      </span>
                      <span className="text-[11px] text-[#A8A199]">
                        View full schedule & timeline
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#78716A]" />
                </div>
              </div>

              {/* Sub-Tabs: About, Lineup, VIP */}
              <div className="flex border-b border-[#26221D] gap-4 text-xs font-semibold">
                {(['About', 'Lineup', 'VIP'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setEventDetailTab(tab)}
                    className={`pb-2 transition-colors relative ${
                      eventDetailTab === tab ? 'text-[#F47736]' : 'text-[#A8A199] hover:text-white'
                    }`}
                  >
                    {tab}
                    {eventDetailTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F47736] rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {eventDetailTab === 'About' && (
                <div className="space-y-2 text-xs text-[#D1C9BE] leading-relaxed">
                  <p>{selectedEvent.description}</p>
                  <p className="text-[11px] text-[#A8A199]">
                    Dress code: Smart casual / evening nightlife chic. Must be 18+ with valid photo ID.
                  </p>
                </div>
              )}

              {eventDetailTab === 'Lineup' && (
                <div className="space-y-2">
                  <span className="text-[11px] text-[#78716A] uppercase font-bold tracking-wider">
                    Resident & Guest Selectors
                  </span>
                  {(selectedEvent.djLineup || ['DJ Luna Ray', 'Guest Rapper (Live)']).map((dj) => (
                    <div key={dj} className="p-2.5 rounded-lg bg-[#1C1A17] flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{dj}</span>
                      <span className="text-[#F47736] text-[11px]">Headline Set</span>
                    </div>
                  ))}
                </div>
              )}

              {eventDetailTab === 'VIP' && (
                <div className="p-3 rounded-xl bg-[#221B14] border border-[#F47736]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-white">VIP Booth Package</span>
                    <span className="font-bold text-xs text-[#F47736]">{getEventPrice(selectedEvent, true).text}</span>
                  </div>
                  <ul className="text-[11px] text-[#D1C9BE] space-y-1">
                    {(selectedEvent.vipPerks || ['Private booth', 'Bottle service', 'Queue skip']).map((p) => (
                      <li key={p} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#F47736]" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Sticky Action Bar (Directly Matching Center Screen) */}
            <div className="p-4 sm:p-5 bg-[#171513] border-t border-[#26221D] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#78716A] block uppercase tracking-wider">Total Cover Price</span>
                <span className="font-heading font-extrabold text-xl text-white">
                  {getEventPrice(selectedEvent).text}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBookingEvent(selectedEvent);
                  setTicketQuantity(1);
                }}
                className="h-11 px-6 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white font-heading font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#F47736]/25 transition-all active:scale-98"
              >
                <span>Book Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCREEN 3 MODAL: BOOKING & CHECKOUT (Right Phone Screen)      */}
      {/* ============================================================ */}
      {bookingEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => !isProcessingPayment && setBookingEvent(null)}
        >
          <div
            className="w-full max-w-md bg-[#141210] border border-[#2E2923] rounded-3xl overflow-hidden shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150 my-auto text-[#F7F4EF]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header: Back arrow, Booking Title, Info icon */}
            <div className="flex items-center justify-between pb-2 border-b border-[#26221D]">
              <button
                onClick={() => setBookingEvent(null)}
                className="w-8 h-8 rounded-full bg-[#1F1C18] flex items-center justify-center text-white hover:bg-[#28241F]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="font-heading font-bold text-base text-white">Booking</h3>
              <button
                onClick={() => showToast('All bookings protected by LinkedOut Nightlife Guarantee', 'warm')}
                className="w-8 h-8 rounded-full bg-[#1F1C18] flex items-center justify-center text-[#A8A199] hover:text-white"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Venue Summary Mini-Card (Directly Matching Right Screen) */}
            <div className="p-3 rounded-2xl bg-[#1C1A17] border border-[#2E2923] flex items-center gap-3">
              <img
                src={bookingEvent.image || '/public/assets/aistudio/a_9sZe1p8xV3c2TzGZaEe3_sZ51DUxv8pA4mn5DnlOOVAW1zUK4oQFWsATfubyvWSgN-2JPqgJUT7b8pWQXPAgBKGHdKKaviHaKDQchVUTllT7gPjSM4_oUAO6lbazeu3xwPCwdvplD211Vxp38ikgDp2uTc7K-Ozzl3ZWgmV1u17zCPAUxzikGPdew8yqip_7a35b71d.jpeg'}
                alt={bookingEvent.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-heading font-bold text-xs text-white truncate">
                  {bookingEvent.title}
                </h4>
                <p className="text-[11px] text-[#A8A199] truncate">
                  {bookingEvent.venueName || bookingEvent.location}
                </p>
              </div>
            </div>

            {/* Ticket Summary Section */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716A] block">
                Ticket Summary
              </span>

              <div className="p-3.5 rounded-2xl bg-[#1C1A17] border border-[#2E2923] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#78716A] block">Date and Time</span>
                    <span className="font-semibold text-white">{bookingEvent.date} {bookingEvent.time}</span>
                  </div>
                  <Info className="w-3.5 h-3.5 text-[#78716A]" />
                </div>

                {/* Ticket Quantity Stepper */}
                <div className="flex items-center justify-between pt-2 border-t border-[#26221D]">
                  <div>
                    <span className="text-xs font-semibold text-white block">Number of Tickets</span>
                    <span className="text-[10px] text-[#A8A199]">
                      {selectedTier === 'vip' ? 'VIP Booth Admission' : 'General Admission Entry'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={ticketQuantity <= 1}
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      className="w-7 h-7 rounded-lg bg-[#28241F] text-white flex items-center justify-center font-bold text-sm disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-heading font-bold text-sm text-white">
                      {ticketQuantity}
                    </span>
                    <button
                      type="button"
                      disabled={ticketQuantity >= 8}
                      onClick={() => setTicketQuantity(Math.min(8, ticketQuantity + 1))}
                      className="w-7 h-7 rounded-lg bg-[#28241F] text-white flex items-center justify-center font-bold text-sm disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tier Switcher with dynamic pricing */}
                {bookingEvent.isVipAvailable && (
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedTier('general')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        selectedTier === 'general'
                          ? 'border-[#F47736] bg-[#F47736]/15 text-[#F47736]'
                          : 'border-[#2E2923] text-[#A8A199]'
                      }`}
                    >
                      General ({getCheckoutPrice(bookingEvent, false, selectedPaymentRail).text})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTier('vip')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        selectedTier === 'vip'
                          ? 'border-[#F47736] bg-[#F47736]/15 text-[#F47736]'
                          : 'border-[#2E2923] text-[#A8A199]'
                      }`}
                    >
                      VIP Booth ({getCheckoutPrice(bookingEvent, true, selectedPaymentRail).text})
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* PAYMENT CURRENCY & METHOD SELECTION */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716A] block">
                  Select Payment Currency
                </span>
                <span className="text-[10px] text-[#F47736] font-semibold">
                  {selectedPaymentRail === 'naira' ? '50 Naira General Pass' : selectedPaymentRail === 'dollar' ? '$1 USD' : '0.05 USDT'}
                </span>
              </div>

              {/* Currency Rails Switcher */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#1C1A17] border border-[#2E2923]">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPaymentRail('naira');
                    setCurrencyMode('NGN');
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                    selectedPaymentRail === 'naira'
                      ? 'bg-[#F47736] text-white shadow-md'
                      : 'text-[#A8A199] hover:text-white'
                  }`}
                >
                  <span className="font-heading font-extrabold text-sm leading-tight">₦ Naira</span>
                  <span className="text-[9px] opacity-90">50 Naira (NGN)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPaymentRail('dollar');
                    setCurrencyMode('USD');
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                    selectedPaymentRail === 'dollar'
                      ? 'bg-[#F47736] text-white shadow-md'
                      : 'text-[#A8A199] hover:text-white'
                  }`}
                >
                  <span className="font-heading font-extrabold text-sm leading-tight">$ Dollar</span>
                  <span className="text-[9px] opacity-90">USD / Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPaymentRail('crypto');
                    setCurrencyMode('CRYPTO');
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                    selectedPaymentRail === 'crypto'
                      ? 'bg-[#F47736] text-white shadow-md'
                      : 'text-[#A8A199] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1 font-heading font-extrabold text-sm leading-tight">
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Crypto</span>
                  </div>
                  <span className="text-[9px] opacity-90">USDT / BTC / SOL</span>
                </button>
              </div>

              {/* RAIL 1: NAIRA PAYMENT FLOW (50 NAIRA) */}
              {selectedPaymentRail === 'naira' && (
                <div className="p-3.5 rounded-2xl bg-[#1C1A17] border border-[#2E2923] space-y-3 animate-in fade-in duration-150">
                  {/* Naira Sub-methods */}
                  <div className="flex gap-1.5 p-0.5 rounded-lg bg-[#221F1B] border border-[#2E2923]">
                    <button
                      type="button"
                      onClick={() => setNairaSubMethod('bank_transfer')}
                      className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        nairaSubMethod === 'bank_transfer'
                          ? 'bg-[#F47736] text-white'
                          : 'text-[#A8A199] hover:text-white'
                      }`}
                    >
                      Bank Transfer
                    </button>
                    <button
                      type="button"
                      onClick={() => setNairaSubMethod('card')}
                      className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        nairaSubMethod === 'card'
                          ? 'bg-[#F47736] text-white'
                          : 'text-[#A8A199] hover:text-white'
                      }`}
                    >
                      Debit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setNairaSubMethod('ussd')}
                      className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        nairaSubMethod === 'ussd'
                          ? 'bg-[#F47736] text-white'
                          : 'text-[#A8A199] hover:text-white'
                      }`}
                    >
                      USSD (*737#)
                    </button>
                  </div>

                  {nairaSubMethod === 'bank_transfer' && (
                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-[#24201B] border border-[#3D352B] space-y-2">
                        <div className="flex items-center justify-between text-[#A8A199]">
                          <span>Bank Name</span>
                          <span className="font-semibold text-white">Zenith Bank Plc / Kuda</span>
                        </div>
                        <div className="flex items-center justify-between text-[#A8A199]">
                          <span>Account Name</span>
                          <span className="font-semibold text-white">LinkedOut Nightlife Ltd</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-[#332C24]">
                          <span className="text-[#A8A199]">Account Number</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white text-sm">1029384756</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText('1029384756');
                                setCopiedBankDetails(true);
                                setTimeout(() => setCopiedBankDetails(false), 2000);
                              }}
                              className="px-2 py-0.5 rounded bg-[#F47736]/20 text-[#F47736] hover:bg-[#F47736]/30 text-[10px] font-bold flex items-center gap-1 transition-colors"
                            >
                              {copiedBankDetails ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedBankDetails ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[#A8A199]">
                          <span>Exact Amount</span>
                          <span className="font-bold text-[#F47736] font-mono text-sm">
                            {selectedTier === 'vip' ? '₦15,000.00' : '₦50.00'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#A8A199] leading-snug">
                        Transfer the exact amount from any Nigerian banking app. Door scanner pass will generate immediately once confirmed.
                      </p>
                    </div>
                  )}

                  {nairaSubMethod === 'card' && (
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="text-[10px] text-[#A8A199] block mb-1">Card Number (Verve, Mastercard, Visa)</label>
                        <input
                          type="text"
                          defaultValue="5399 4120 8891 0024"
                          placeholder="0000 0000 0000 0000"
                          className="w-full h-8 px-2.5 rounded-lg bg-[#24201B] border border-[#3D352B] text-white text-xs font-mono focus:outline-none focus:border-[#F47736]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-[#A8A199] block mb-1">Expires</label>
                          <input
                            type="text"
                            defaultValue="08/28"
                            placeholder="MM/YY"
                            className="w-full h-8 px-2.5 rounded-lg bg-[#24201B] border border-[#3D352B] text-white text-xs font-mono focus:outline-none focus:border-[#F47736]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#A8A199] block mb-1">CVV</label>
                          <input
                            type="password"
                            defaultValue="392"
                            placeholder="123"
                            maxLength={3}
                            className="w-full h-8 px-2.5 rounded-lg bg-[#24201B] border border-[#3D352B] text-white text-xs font-mono focus:outline-none focus:border-[#F47736]"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Secured by Nigerian Central Bank 3D-Secure 2.0</span>
                      </div>
                    </div>
                  )}

                  {nairaSubMethod === 'ussd' && (
                    <div className="space-y-2 text-xs">
                      <span className="text-[10px] text-[#A8A199] block">Choose your bank to dial directly:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { bank: 'GTBank', code: '*737*50*1029384756#' },
                          { bank: 'Zenith Bank', code: '*966*50*1029384756#' },
                          { bank: 'UBA', code: '*919*50*1029384756#' },
                          { bank: 'Access Bank', code: '*901*50*1029384756#' },
                        ].map((u) => (
                          <button
                            key={u.bank}
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(u.code);
                              showToast(`Dial string ${u.code} copied to phone dialer!`, 'warm');
                            }}
                            className="p-2 rounded-lg bg-[#24201B] border border-[#3D352B] hover:border-[#F47736]/40 text-left transition-colors"
                          >
                            <span className="font-bold text-white text-[11px] block">{u.bank}</span>
                            <span className="font-mono text-[#F47736] text-[10px]">{u.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RAIL 2: US DOLLAR PAYMENT FLOW */}
              {selectedPaymentRail === 'dollar' && (
                <div className="p-3.5 rounded-2xl bg-[#1C1A17] border border-[#2E2923] space-y-3 animate-in fade-in duration-150">
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] text-[#A8A199] block mb-1">Card Number</label>
                      <input
                        type="text"
                        defaultValue="4242 •••• •••• 4242"
                        className="w-full h-8 px-2.5 rounded-lg bg-[#24201B] border border-[#3D352B] text-white text-xs font-mono focus:outline-none focus:border-[#F47736]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#A8A199] block mb-1">MM / YY</label>
                        <input
                          type="text"
                          defaultValue="12/27"
                          className="w-full h-8 px-2.5 rounded-lg bg-[#24201B] border border-[#3D352B] text-white text-xs font-mono focus:outline-none focus:border-[#F47736]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#A8A199] block mb-1">CVC</label>
                        <input
                          type="password"
                          defaultValue="884"
                          className="w-full h-8 px-2.5 rounded-lg bg-[#24201B] border border-[#3D352B] text-white text-xs font-mono focus:outline-none focus:border-[#F47736]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#26221D] text-[11px] text-[#A8A199]">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#F47736]" />
                      <span>Apple Pay / Google Pay supported</span>
                    </div>
                    <span className="font-semibold text-white">Instant Clearance</span>
                  </div>
                </div>
              )}

              {/* RAIL 3: CRYPTO PAYMENT FLOW (USDT / BTC / ETH / SOL) */}
              {selectedPaymentRail === 'crypto' && (
                <div className="p-3.5 rounded-2xl bg-[#1C1A17] border border-[#2E2923] space-y-3 animate-in fade-in duration-150">
                  {/* Network Selector */}
                  <div>
                    <label className="text-[10px] text-[#A8A199] block mb-1">Select Network</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['USDT (TRC20)', 'USDT (ERC20)', 'SOL', 'BTC', 'ETH'] as const).map((net) => (
                        <button
                          key={net}
                          type="button"
                          onClick={() => setSelectedCryptoNetwork(net as CryptoNetwork)}
                          className={`py-1 px-1.5 text-[10px] font-bold rounded-md border text-center transition-colors truncate ${
                            selectedCryptoNetwork === net
                              ? 'border-[#F47736] bg-[#F47736]/20 text-white'
                              : 'border-[#2E2923] bg-[#24201B] text-[#A8A199] hover:text-white'
                          }`}
                        >
                          {net}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wallet address & QR */}
                  <div className="p-3 rounded-xl bg-[#24201B] border border-[#3D352B] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#A8A199]">Deposit Network</span>
                      <span className="font-bold text-amber-400 font-mono text-xs">{selectedCryptoNetwork}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#A8A199]">Exact Amount</span>
                      <span className="font-bold text-white font-mono">
                        {selectedTier === 'vip' ? '15.00 USDT' : '0.05 USDT'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#332C24]">
                      <span className="text-[10px] text-[#A8A199] block mb-1">Nightlife Vault Deposit Address:</span>
                      <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[#141210] border border-[#2E2923]">
                        <span className="font-mono text-[10px] text-white truncate">
                          {selectedCryptoNetwork === 'SOL'
                            ? '7xKXtg2CW87d97TXLinkedOutNightlifeSolVault'
                            : selectedCryptoNetwork === 'BTC'
                              ? 'bc1qnightlife05nairalinkedoutexpressvault'
                              : 'TXYZ984LinkedOutNightlifeTRC20OfficialWallet'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText('TXYZ984LinkedOutNightlifeTRC20OfficialWallet');
                            setCopiedCryptoAddress(true);
                            setTimeout(() => setCopiedCryptoAddress(false), 2000);
                          }}
                          className="px-2 py-0.5 rounded bg-[#F47736]/20 text-[#F47736] hover:bg-[#F47736]/30 text-[10px] font-bold flex items-center gap-1 shrink-0 transition-colors"
                        >
                          {copiedCryptoAddress ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCryptoAddress ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                    <span>Auto-scans mempool for instant confirmation.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Offers Section (Matching Right Screen) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716A] block">
                Offers & Discounts
              </span>

              <div
                onClick={() => setAppliedPromo(!appliedPromo)}
                className="p-3 rounded-xl bg-[#1C1A17] border border-[#2E2923] hover:border-[#F47736]/40 cursor-pointer flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#F47736]/15 text-[#F47736] flex items-center justify-center">
                    <Percent className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">
                      {appliedPromo ? 'Early Bird Promo: 15% OFF applied' : 'View all events offers'}
                    </span>
                    <span className="text-[10px] text-[#A8A199]">
                      {appliedPromo
                        ? (selectedPaymentRail === 'naira' ? 'Saved ₦7.50' : selectedPaymentRail === 'dollar' ? 'Saved $0.15' : 'Saved 0.0075 USDT')
                        : 'Tap to apply member coupon'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#78716A]" />
              </div>
            </div>

            {/* Payment Summary (Matching Right Screen) */}
            {(() => {
              const priceInfo = getCheckoutPrice(bookingEvent, selectedTier === 'vip', selectedPaymentRail);
              const basePrice = priceInfo.amount;
              const discount = appliedPromo ? 0.15 : 0;
              const subtotal = basePrice * ticketQuantity * (1 - discount);
              const serviceFee = subtotal * 0.08;
              const rawTotal = subtotal + serviceFee;
              const total = selectedPaymentRail === 'crypto'
                ? Number(rawTotal.toFixed(3))
                : Math.round(rawTotal);

              const formattedSubtotal = selectedPaymentRail === 'crypto'
                ? subtotal.toFixed(3)
                : subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

              const formattedFee = selectedPaymentRail === 'crypto'
                ? serviceFee.toFixed(3)
                : serviceFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

              const formattedTotal = selectedPaymentRail === 'crypto'
                ? total.toFixed(3)
                : total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

              return (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716A] block">
                    Payment Summary ({selectedPaymentRail === 'naira' ? '₦ Nigerian Naira' : selectedPaymentRail === 'dollar' ? '$ US Dollar' : '⚡ Crypto USDT'})
                  </span>

                  <div className="p-3.5 rounded-2xl bg-[#1C1A17] border border-[#2E2923] space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#A8A199]">
                      <span>Subtotal ({ticketQuantity} ticket{ticketQuantity > 1 ? 's' : ''})</span>
                      <span className="font-semibold text-white font-mono">
                        {priceInfo.symbol} {formattedSubtotal}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#A8A199]">
                      <span>Service Charge (8%)</span>
                      <span className="font-semibold text-white font-mono">
                        {priceInfo.symbol} {formattedFee}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-[#26221D] font-bold text-white text-sm">
                      <span>Total Due</span>
                      <span className="text-[#F47736] font-mono text-base">
                        {priceInfo.symbol} {formattedTotal}
                      </span>
                    </div>
                  </div>

                  {/* Pay Now Button (Directly Matching Right Screen) */}
                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={handleCompleteBooking}
                    className="w-full h-12 mt-2 rounded-2xl bg-[#F47736] hover:bg-[#E06524] text-white font-heading font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#F47736]/25 transition-all active:scale-98 disabled:opacity-60"
                  >
                    {isProcessingPayment ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Confirming {selectedPaymentRail === 'naira' ? '50 Naira' : selectedPaymentRail === 'dollar' ? 'Dollar' : 'Crypto'} Payment...</span>
                      </div>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>
                          {selectedPaymentRail === 'naira'
                            ? `Pay ${priceInfo.symbol} ${formattedTotal} via Naira`
                            : selectedPaymentRail === 'dollar'
                              ? `Pay ${priceInfo.symbol} ${formattedTotal} via Card / Apple Pay`
                              : `Verify & Pay ${priceInfo.symbol} ${formattedTotal}`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ENTERTAINMENT BOOKING REQUEST MODAL (Hire a DJ / Live Performer) */}
      {/* ============================================================ */}
      {bookingEntertainer && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setBookingEntertainer(null)}
        >
          <div
            className="w-full max-w-lg bg-[#141210] border border-[#2E2923] rounded-3xl p-5 space-y-4 animate-in zoom-in-95 duration-150 my-auto text-[#F7F4EF]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#26221D]">
              <div className="flex items-center gap-2.5">
                <Headphones className="w-5 h-5 text-[#F47736]" />
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Request Entertainment Booking
                  </h3>
                  <p className="text-xs text-[#A8A199]">
                    Book {bookingEntertainer.stageName} for private after-parties or venues.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBookingEntertainer(null)}
                className="w-7 h-7 rounded-lg bg-[#221F1B] flex items-center justify-center text-[#A8A199] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitEntertainerRequest} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A8A199] mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={reqDate}
                    onChange={(e) => setReqDate(e.target.value)}
                    required
                    className="w-full h-9 px-3 text-xs rounded-xl bg-[#1C1A17] border border-[#2E2923] text-white focus:outline-none focus:border-[#F47736]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#A8A199] mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={reqTime}
                    onChange={(e) => setReqTime(e.target.value)}
                    required
                    className="w-full h-9 px-3 text-xs rounded-xl bg-[#1C1A17] border border-[#2E2923] text-white focus:outline-none focus:border-[#F47736]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A8A199] mb-1">
                    Duration (Hours)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={reqDuration}
                    onChange={(e) => setReqDuration(Number(e.target.value))}
                    className="w-full h-9 px-3 text-xs rounded-xl bg-[#1C1A17] border border-[#2E2923] text-white focus:outline-none focus:border-[#F47736]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#A8A199] mb-1">
                    Budget Offer
                  </label>
                  <input
                    type="text"
                    value={reqBudget}
                    onChange={(e) => setReqBudget(e.target.value)}
                    placeholder="e.g. ₦25,000 / $20 / 20 USDT"
                    className="w-full h-9 px-3 text-xs rounded-xl bg-[#1C1A17] border border-[#2E2923] text-white focus:outline-none focus:border-[#F47736]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A8A199] mb-1">
                  Venue Location & Setup
                </label>
                <input
                  type="text"
                  value={reqLocation}
                  onChange={(e) => setReqLocation(e.target.value)}
                  placeholder="e.g. Central Rooftop Terrace / Private Club Lounge"
                  required
                  className="w-full h-9 px-3 text-xs rounded-xl bg-[#1C1A17] border border-[#2E2923] text-white focus:outline-none focus:border-[#F47736]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A8A199] mb-1">
                  Vibe & Music Notes for DJ
                </label>
                <textarea
                  rows={2}
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  placeholder="Describe your crowd, preferred music journey, and sound equipment."
                  className="w-full p-2.5 text-xs rounded-xl bg-[#1C1A17] border border-[#2E2923] text-white focus:outline-none focus:border-[#F47736]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#F47736]/25 transition-all"
              >
                <span>Send Booking Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DIGITAL QR ENTRY PASS MODAL                                 */}
      {/* ============================================================ */}
      {viewingTicketPass && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setViewingTicketPass(null)}
        >
          <div
            className="w-full max-w-sm bg-gradient-to-b from-[#1C1915] to-[#12100E] border-2 border-[#F47736] rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#2E2923]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F47736]">
                LinkedOut Door Pass
              </span>
              <button
                onClick={() => setViewingTicketPass(null)}
                className="w-7 h-7 rounded-full bg-[#28241F] flex items-center justify-center text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-lg text-white">
                {viewingTicketPass.eventTitle}
              </h3>
              <p className="text-xs text-[#A8A199]">{viewingTicketPass.venueName}</p>
              <p className="text-xs font-bold text-[#F47736]">{viewingTicketPass.date} · {viewingTicketPass.time}</p>
            </div>

            {/* QR Code Graphic */}
            <div className="p-4 bg-white rounded-2xl mx-auto w-48 h-48 flex flex-col items-center justify-center shadow-lg">
              <QrCode className="w-40 h-40 text-black" />
            </div>

            <div className="space-y-1">
              <span className="font-mono text-xs text-[#D1C9BE] tracking-wider block">
                {viewingTicketPass.qrCode}
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                ✓ Ready for Door Scanner & Hostess Check-in
              </span>
              <span className="text-[10px] text-[#A8A199] block font-medium">
                Paid: {viewingTicketPass.currency} {viewingTicketPass.totalPaid} · Ref: {viewingTicketPass.bookingRef}
              </span>
              <span className="text-[10px] text-[#78716A] block">
                Holder: {viewingTicketPass.holderName} · {viewingTicketPass.ticketTier}
              </span>
            </div>

            <button
              onClick={() => {
                showToast('Pass saved to Apple Wallet / Google Pay format', 'success');
              }}
              className="w-full h-10 rounded-xl bg-white hover:bg-[#F7F4EF] text-black text-xs font-bold transition-colors"
            >
              Add to Mobile Wallet
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: PERFORMANCE VIDEO CLIP PLAYER                       */}
      {/* ============================================================ */}
      {viewingVideoTalent && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setViewingVideoTalent(null)}
        >
          <div
            className="w-full max-w-lg bg-[#141210] border-2 border-[#F47736] rounded-3xl overflow-hidden shadow-2xl space-y-0 animate-in zoom-in-95 duration-150 my-auto text-[#F7F4EF]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Video Simulated Stage Header */}
            <div className="relative h-64 sm:h-72 w-full bg-black overflow-hidden flex items-center justify-center group">
              <img
                src={viewingVideoTalent.avatar}
                alt={viewingVideoTalent.stageName}
                className="w-full h-full object-cover scale-105 filter brightness-75 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/30 to-black/60" />

              {/* Animated Sound Equalizer Waves */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between pointer-events-none opacity-80">
                <div className="flex items-end gap-1 h-12">
                  <span className="w-1.5 h-6 bg-[#F47736] rounded-full animate-bounce" />
                  <span className="w-1.5 h-10 bg-[#F47736] rounded-full animate-pulse" />
                  <span className="w-1.5 h-4 bg-white rounded-full animate-bounce" />
                  <span className="w-1.5 h-12 bg-[#F47736] rounded-full animate-pulse" />
                  <span className="w-1.5 h-8 bg-white rounded-full animate-bounce" />
                  <span className="w-1.5 h-11 bg-[#F47736] rounded-full animate-pulse" />
                  <span className="w-1.5 h-5 bg-[#F47736] rounded-full animate-bounce" />
                </div>
                <div className="px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>Live Stage Capture</span>
                </div>
              </div>

              {/* Play / Pause Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#F47736]/90 text-white flex items-center justify-center shadow-2xl shadow-[#F47736]/50 group-hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
              </div>

              {/* Top Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-xs font-bold text-white border border-white/10">
                  <Video className="w-3.5 h-3.5 text-[#F47736]" />
                  <span>{viewingVideoTalent.stageName} · Live Performance</span>
                </div>
                <button
                  onClick={() => setViewingVideoTalent(null)}
                  className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white hover:bg-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Body Content */}
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-heading font-extrabold text-lg text-white">
                    {viewingVideoTalent.videoTitle || `${viewingVideoTalent.stageName} - Live Headline Performance`}
                  </h4>
                  <p className="text-xs text-[#A8A199] mt-0.5">
                    Recorded live in 4K stereo at Boomerang Main Room · Duration: {viewingVideoTalent.videoDuration || '2:30'}
                  </p>
                </div>

                <button
                  onClick={() => showToast('Applause sent to DJ! +1 crowd love', 'warm')}
                  className="h-9 px-3 rounded-xl bg-[#221F1B] hover:bg-[#2C2823] border border-[#38332C] text-xs font-semibold text-[#F7F4EF] flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <Flame className="w-3.5 h-3.5 text-[#F47736] fill-current" />
                  <span>1.4k Cheers</span>
                </button>
              </div>

              {/* Performance Styles Badges */}
              {viewingVideoTalent.entertainmentStyles && (
                <div className="flex gap-1.5 flex-wrap">
                  {viewingVideoTalent.entertainmentStyles.map((style) => (
                    <span
                      key={style}
                      className="px-2.5 py-1 rounded-lg bg-[#1C1A17] border border-[#2E2923] text-[11px] font-semibold text-[#D1C9BE]"
                    >
                      ⚡ {style}
                    </span>
                  ))}
                </div>
              )}

              {/* Verified Organizer Endorsement */}
              {viewingVideoTalent.reviews?.[0] && (
                <div className="p-3 rounded-xl bg-[#1A1815] border border-[#26221D] text-xs space-y-1">
                  <span className="text-[10px] text-[#F47736] font-bold uppercase tracking-wider block">
                    Verified Host Endorsement
                  </span>
                  <p className="text-[#D1C9BE] italic">
                    "{viewingVideoTalent.reviews[0].comment}"
                  </p>
                  <span className="text-[10px] text-[#A8A199] block font-medium">
                    — {viewingVideoTalent.reviews[0].reviewer} ({viewingVideoTalent.reviews[0].event})
                  </span>
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setBookingEntertainer(viewingVideoTalent);
                    setViewingVideoTalent(null);
                  }}
                  className="flex-1 h-11 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#F47736]/25 transition-all"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Book {viewingVideoTalent.stageName} ({viewingVideoTalent.hourlyRate})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingVideoTalent(null)}
                  className="h-11 px-4 rounded-xl bg-[#221F1B] hover:bg-[#2C2823] border border-[#38332C] text-xs font-semibold text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: INVITE FRIENDS & SHARE NIGHTLIFE PLAN               */}
      {/* ============================================================ */}
      {sharingVenue && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSharingVenue(null)}
        >
          <div
            className="w-full max-w-md bg-[#141210] border border-[#2E2923] rounded-3xl p-5 space-y-4 animate-in zoom-in-95 duration-150 my-auto text-[#F7F4EF]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#26221D]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F47736]/20 text-[#F47736] flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Invite Friends to Night Out
                  </h3>
                  <p className="text-xs text-[#A8A199] truncate">
                    {sharingVenue.name} · {sharingVenue.distance} away
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSharingVenue(null)}
                className="w-7 h-7 rounded-lg bg-[#221F1B] flex items-center justify-center text-[#A8A199] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Friend Invites Checklist */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716A] block">
                Select Friends on LinkedOut
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {[
                  { name: 'Chidi Okafor', handle: '@chidi_ok', active: 'Online now' },
                  { name: 'Sarah Vance', handle: '@sarahv', active: 'At Central' },
                  { name: 'Alex Rivera', handle: '@arivera', active: '15m ago' },
                  { name: 'David Chen', handle: '@dchen', active: 'In Soho' },
                  { name: 'Ngozi Obi', handle: '@ngozi_tech', active: 'Online now' },
                ].map((friend) => (
                  <label
                    key={friend.handle}
                    className="p-2.5 rounded-xl bg-[#1C1A17] hover:bg-[#221F1B] border border-[#26221D] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#F47736]/20 text-[#F47736] font-heading font-bold text-xs flex items-center justify-center">
                        {friend.name[0]}
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-white block">{friend.name}</span>
                        <span className="text-[10px] text-[#A8A199]">{friend.handle} · {friend.active}</span>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded accent-[#F47736]" />
                  </label>
                ))}
              </div>
            </div>

            {/* Social Share One-Click Buttons */}
            <div className="space-y-2 pt-1 border-t border-[#26221D]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716A] block">
                Share via External Apps
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(`Hey! Join me at ${sharingVenue.name} tonight! DJ ${sharingVenue.djTonight || 'Headline Set'} is performing. Cover is ₦50 on LinkedOut After Hours!`);
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                  className="h-10 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(`Nightlife plan: ${sharingVenue.name} tonight. RSVP with 50 Naira on LinkedOut After Hours!`);
                    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`, '_blank');
                  }}
                  className="h-10 rounded-xl bg-sky-600/90 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </button>
              </div>

              {/* Copy Invite Link Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value={`https://linkedout.club/after-hours/venue/${sharingVenue.id}?ref=tonight`}
                  className="flex-1 h-9 px-3 text-[11px] rounded-xl bg-[#1C1A17] border border-[#2E2923] text-[#A8A199] font-mono"
                />
                <button
                  type="button"
                  onClick={() => showToast('Nightlife plan invite link copied to clipboard!', 'success')}
                  className="h-9 px-3.5 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                showToast(`Invites sent to selected friends for ${sharingVenue.name}!`, 'success');
                setSharingVenue(null);
              }}
              className="w-full h-10 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-bold transition-all"
            >
              Send LinkedOut Group Invite
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: DIRECTIONS & ROUTING                                */}
      {/* ============================================================ */}
      {directionsModalVenue && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setDirectionsModalVenue(null)}
        >
          <div
            className="w-full max-w-md bg-[#141210] border border-[#2E2923] rounded-3xl p-5 space-y-4 animate-in zoom-in-95 duration-150 my-auto text-[#F7F4EF]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#26221D]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F47736]/20 text-[#F47736] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Directions to Venue
                  </h3>
                  <p className="text-xs text-[#A8A199]">
                    {directionsModalVenue.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDirectionsModalVenue(null)}
                className="w-7 h-7 rounded-lg bg-[#221F1B] flex items-center justify-center text-[#A8A199] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ETA Summary Pill Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#1C1A17] border border-[#2E2923] text-center">
                <span className="text-[10px] text-[#78716A] uppercase font-bold tracking-wider block">
                  Walking Distance
                </span>
                <span className="font-heading font-extrabold text-base text-white mt-0.5 block">
                  6 Mins · 420m
                </span>
                <span className="text-[10px] text-emerald-400">Fastest through Lan Kwai Fong</span>
              </div>

              <div className="p-3 rounded-xl bg-[#1C1A17] border border-[#2E2923] text-center">
                <span className="text-[10px] text-[#78716A] uppercase font-bold tracking-wider block">
                  Taxi / Ride
                </span>
                <span className="font-heading font-extrabold text-base text-white mt-0.5 block">
                  3 Mins · Drop-off at Door
                </span>
                <span className="text-[10px] text-[#A8A199]">Valet Available</span>
              </div>
            </div>

            {/* Turn-by-Turn Route Steps */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716A] block">
                Turn-by-Turn Route Preview
              </span>
              <div className="p-3.5 rounded-2xl bg-[#171513] border border-[#26221D] space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#F47736] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Start at Central MTR Station / Queen's Road</span>
                    <span className="text-[11px] text-[#A8A199]">Head northeast on D'Aguilar Street towards Wellington St (150m)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#2E2822] text-[#F47736] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Turn right onto Wyndham Street</span>
                    <span className="text-[11px] text-[#A8A199]">Continue past the pedestrian nightlife crosswalk (220m)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Arrive at {directionsModalVenue.name}</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">{directionsModalVenue.address} · Look for LinkedOut Hostess</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  showToast(`Opening Google Maps navigation to ${directionsModalVenue.name}...`, 'success');
                  window.open(`https://maps.google.com/?q=${encodeURIComponent(directionsModalVenue.name + ' ' + directionsModalVenue.address)}`, '_blank');
                }}
                className="flex-1 h-10 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </button>
              <button
                type="button"
                onClick={() => setDirectionsModalVenue(null)}
                className="h-10 px-4 rounded-xl bg-[#221F1B] hover:bg-[#2C2823] border border-[#38332C] text-xs font-semibold text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: AFTER HOURS VIP PASS UNLOCK MODAL                   */}
      {/* ============================================================ */}
      {isPassUnlockModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsPassUnlockModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-gradient-to-b from-[#1C1612] to-[#120F0D] border-2 border-[#F47736] rounded-3xl p-6 space-y-4 animate-in zoom-in-95 duration-150 my-auto text-[#F7F4EF] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#2E2923]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F47736] text-white flex items-center justify-center shadow-md">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white">
                    Unlock After Hours Pass
                  </h3>
                  <p className="text-xs text-[#F47736] font-semibold">
                    Instant VIP & Secret Passcode Access
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPassUnlockModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#28241F] flex items-center justify-center text-[#A8A199] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Currency / Rail Selector */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#0D0B0A] border border-[#2E2923]">
              <button
                type="button"
                onClick={() => setSelectedPaymentRail('naira')}
                className={`py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center transition-all ${
                  selectedPaymentRail === 'naira'
                    ? 'bg-[#F47736] text-white shadow-md'
                    : 'text-[#A8A199] hover:text-white'
                }`}
              >
                <span>₦50 Naira</span>
                <span className="text-[9px] opacity-80">Zenith / Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentRail('dollar')}
                className={`py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center transition-all ${
                  selectedPaymentRail === 'dollar'
                    ? 'bg-[#F47736] text-white shadow-md'
                    : 'text-[#A8A199] hover:text-white'
                }`}
              >
                <span>$1 USD</span>
                <span className="text-[9px] opacity-80">Apple / Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentRail('crypto')}
                className={`py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center transition-all ${
                  selectedPaymentRail === 'crypto'
                    ? 'bg-[#F47736] text-white shadow-md'
                    : 'text-[#A8A199] hover:text-white'
                }`}
              >
                <span>0.05 USDT</span>
                <span className="text-[9px] opacity-80">Polygon / Web3</span>
              </button>
            </div>

            {/* Unlocked Benefits Summary */}
            <div className="p-3.5 rounded-2xl bg-[#171310] border border-[#3E3228] space-y-2 text-xs">
              <span className="text-[10px] text-[#F47736] font-bold uppercase tracking-wider block">
                What Your Pass Unlocks Tonight:
              </span>
              <div className="space-y-1.5 text-[#D1C9BE]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#F47736] shrink-0" />
                  <span>The Soho Penthouse 779 keypad door code</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#F47736] shrink-0" />
                  <span>The Vault Society spoken speakeasy password</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#F47736] shrink-0" />
                  <span>Direct WhatsApp line to VIP nightlife host concierge</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#F47736] shrink-0" />
                  <span>Consent-based adult social gathering invitations</span>
                </div>
              </div>
            </div>

            {/* Payment Details Info */}
            <div className="p-3 rounded-xl bg-[#0D0B0A] border border-[#2E2923] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#78716A] block">Due Amount</span>
                <span className="font-heading font-extrabold text-base text-white">
                  {selectedPaymentRail === 'naira' ? '₦50.00 NGN' : selectedPaymentRail === 'dollar' ? '$1.00 USD' : '0.05 USDT'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                Instant Auto-Activation
              </span>
            </div>

            {/* Confirm Unlock Button */}
            <button
              type="button"
              onClick={() => {
                unlockAfterHoursPass('50_naira');
                setIsPassUnlockModalOpen(false);
                setActiveTab('secret_pass');
              }}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#F47736] to-[#E06524] hover:brightness-110 text-white font-heading font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#F47736]/30 transition-all active:scale-98"
            >
              <Unlock className="w-4 h-4" />
              <span>
                Confirm & Unlock Pass ({selectedPaymentRail === 'naira' ? '₦50' : selectedPaymentRail === 'dollar' ? '$1' : '0.05 USDT'})
              </span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
