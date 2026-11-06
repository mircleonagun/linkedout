import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Check,
  Compass,
  Users2,
  Wrench,
  Lock,
  Mail,
  User,
  MapPin,
  Eye,
  EyeOff,
  ShieldCheck,
  Flame,
  Globe2,
  X,
  Loader2,
  ArrowLeft,
  Coffee,
  Music,
  Trees,
  Smile,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Send
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { SAMPLE_USERS, CURRENT_USER } from '../data/sampleData';

export const WelcomeScreen: React.FC = () => {
  const {
    setCurrentScreen,
    previousScreen,
    currentUser,
    switchUser,
    loginUser,
    showToast,
    navigateBack,
    getPreviousScreenLabel,
  } = useApp();

  // Active slide index for both mobile carousel and desktop highlight
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinModalTab, setJoinModalTab] = useState<'register' | 'login'>('register');

  // Touch swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Register Form State (Simple, human-first, zero resume gates)
  const [regName, setRegName] = useState(currentUser.name || 'Miracle Onagun');
  const [regHandle, setRegHandle] = useState(currentUser.handle || '@miracle_crafts');
  const [regEmail, setRegEmail] = useState('miracleonagun@gmail.com');
  const [regRole, setRegRole] = useState<UserRole>('Creator & Artist');
  const [regCity, setRegCity] = useState('Austin, TX');
  const [regPassword, setRegPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('miracleonagun@gmail.com');
  const [loginPassword, setLoginPassword] = useState('••••••••');

  // Social Auth Modal State
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [socialProvider, setSocialProvider] = useState<'google' | 'github' | 'apple'>('google');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const roleChoices: UserRole[] = [
    'Everyday Human',
    'Creator & Artist',
    'Skilled Trades',
    'Student & Learner',
    'Entrepreneur',
    'Freelancer',
    'Caregiver & Educator',
    'Technologist',
  ];

  // Story Slides matching Attachment 2 (Short onboarding — simple & minimal)
  const storySlides = [
    {
      id: 'cafe',
      title: 'Find your tribe,',
      highlight: 'right HereNow',
      description: "Connect with friends nearby and see who's around for a quick coffee or spontaneous hangout. Your social life, simplified.",
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80',
      tag: 'Friends',
      icon: Coffee,
      vibe: 'Warm Cafe & Coffee Chats'
    },
    {
      id: 'dancefloor',
      title: 'Hit the',
      highlight: 'Dancefloor',
      description: 'Find the best beats in town. From underground clubs to rooftop lounges, discover where the night is alive.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80',
      tag: 'Everyone',
      icon: Music,
      vibe: 'Live Nightlife & Acoustic Sets'
    },
    {
      id: 'park',
      title: 'Relax in',
      highlight: 'the Park',
      description: 'Fresh air, open conversations, and good food shared with welcoming souls. No status checks, just genuine company.',
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=900&q=80',
      tag: 'Access',
      icon: Trees,
      vibe: 'Park Gatherings & Craft Swaps'
    }
  ];

  // Minimum swipe distance in px
  const minSwipeDistance = 45;

  const onTouchStartHandler = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMoveHandler = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Next slide
      setCurrentSlideIndex((prev) => (prev < storySlides.length - 1 ? prev + 1 : 0));
    }
    if (isRightSwipe) {
      // Prev slide
      setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : storySlides.length - 1));
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({
      name: regName.trim() || 'Miracle Onagun',
      handle: regHandle.trim().startsWith('@') ? regHandle.trim() : `@${regHandle.trim()}`,
      role: regRole,
      location: regCity.trim() || 'Global Citizen',
      headline: `${regRole} · Community Member`,
      bio: `Here for genuine conversations, shared crafts, and human-first friendships.`,
      belongingNote: `Taking space before figuring it all out. Here with open hands.`,
      authProvider: 'email',
    });

    showToast(`Welcome to the worldwide community, ${regName.split(' ')[0]}!`, 'success');
    setIsJoinModalOpen(false);
    setCurrentScreen('onboarding');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({
      name: regName.trim() || 'Miracle Onagun',
      handle: regHandle.trim() || '@miracle_crafts',
      authProvider: 'email',
    });
    showToast(`Welcome back, ${regName.split(' ')[0]}!`, 'warm');
    setIsJoinModalOpen(false);
    setCurrentScreen('home');
  };

  const handleQuickDemoLogin = (userId: string) => {
    switchUser(userId);
    showToast('Signed in successfully! Entering The Lounge...', 'success');
    setIsJoinModalOpen(false);
    setCurrentScreen('home');
  };

  const openSocialAuth = (provider: 'google' | 'github' | 'apple') => {
    setSocialProvider(provider);
    setSocialModalOpen(true);
  };

  const executeSocialLogin = (account: { name: string; email: string; avatar?: string; role?: UserRole }) => {
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      setSocialModalOpen(false);
      setIsJoinModalOpen(false);

      const generatedHandle = '@' + account.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
      const newUser: Partial<UserProfile> = {
        name: account.name,
        handle: generatedHandle,
        avatar: account.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        role: account.role || (socialProvider === 'github' ? 'Technologist' : 'Creator & Artist'),
        headline: `${account.role || (socialProvider === 'github' ? 'Technologist' : 'Creator')} · LinkedOut Community`,
        location: 'Global / Remote',
        country: 'Global',
        countryFlag: '🌐',
        bio: `Connected directly via ${socialProvider === 'google' ? 'Google' : socialProvider === 'github' ? 'GitHub' : 'Apple'}. Here to connect human-to-human.`,
        belongingNote: `You belong before you achieve.`,
        skills: ['Creative Craft', 'Community Collaborations', 'Everyday Living'],
        interests: ['Woodworking', 'Acoustic Music', 'Coffee & Tea', 'Open Doors'],
        authProvider: socialProvider,
      };

      loginUser(newUser);
      showToast(`Welcome! Signed in via ${socialProvider === 'google' ? 'Google' : socialProvider === 'github' ? 'GitHub' : 'Apple'} (${account.email})!`, 'success');
      setCurrentScreen('onboarding');
    }, 550);
  };

  const currentSlide = storySlides[currentSlideIndex];

  return (
    <div className="w-full max-w-5xl mx-auto px-2 xs:px-3 sm:px-6 py-3 sm:py-6 space-y-6 sm:space-y-8 animate-in fade-in duration-300 overflow-x-hidden">
      
      {/* Top Header Navigation Bar - Fully Responsive */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#E9E2D9] dark:border-[#2E2B27]">
        {previousScreen ? (
          <button
            type="button"
            onClick={navigateBack}
            className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] text-xs font-bold text-[#5B554E] dark:text-[#F7F4EF] hover:border-[#F47736] transition-all shadow-xs active:scale-98 shrink-0 group"
            aria-label={`Back to ${getPreviousScreenLabel()}`}
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F47736] group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden xs:inline">Back to</span>
            <span className="truncate max-w-[120px] xs:max-w-none">{getPreviousScreenLabel()}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-[#211F1D] dark:text-white">
            <span className="w-2 h-2 rounded-full bg-[#F47736] animate-pulse" />
            <span>Welcome to LinkedOut</span>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setJoinModalTab('login');
              setIsJoinModalOpen(true);
            }}
            className="text-[11px] sm:text-xs font-bold text-[#5B554E] dark:text-[#D1C9BE] hover:text-[#F47736] transition-colors"
          >
            <span className="hidden sm:inline">Already a member? </span>
            <span className="text-[#F47736] underline">Log In</span>
          </button>
          
          <button
            type="button"
            onClick={() => setCurrentScreen('home')}
            className="h-8 px-2.5 sm:px-3 rounded-lg bg-[#F47736]/10 text-[#F47736] hover:bg-[#F47736] hover:text-white text-xs font-bold transition-all shrink-0"
          >
            Enter Lounge
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: WORLDWIDE COMMUNITY INVITATION (Attachment 1)      */}
      {/* ============================================================ */}
      <div className="relative rounded-2xl sm:rounded-3xl md:rounded-[36px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE0] dark:from-[#211E1A] dark:via-[#1D1A17] dark:to-[#171513] border border-[#E9E2D9] dark:border-[#332F2B] p-4 xs:p-6 sm:p-10 md:p-12 shadow-lg overflow-hidden text-center">
        
        {/* Soft Organic Background Glows */}
        <div className="absolute -top-24 -left-24 w-64 sm:w-80 h-64 sm:h-80 bg-[#F47736]/10 dark:bg-[#F47736]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 sm:w-80 h-64 sm:h-80 bg-amber-400/10 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl mx-auto space-y-4 sm:space-y-6 relative z-10">
          
          {/* Logo Brand Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 dark:bg-[#2A2724]/90 backdrop-blur-md border border-[#E9E2D9] dark:border-[#38332F] text-[11px] sm:text-xs font-heading font-extrabold text-[#211F1D] dark:text-[#F7F4EF] shadow-xs">
            <span>Linked</span>
            <span className="text-[#F47736]">Out</span>
            <span className="text-[10px] text-[#A8A199] font-medium ml-1">· Worldwide Community</span>
          </div>

          {/* Centerpiece: Floating Community Avatar Cluster with Hand-Drawn Doodles */}
          <div className="relative w-full max-w-[280px] h-48 sm:h-56 mx-auto my-1 sm:my-2 select-none">
            
            {/* Top Right: Yellow bubble avatar with doodle spark lines */}
            <div className="absolute top-1 right-2 sm:right-4 flex flex-col items-center animate-in zoom-in-75 duration-300">
              <div className="relative">
                <span className="absolute -top-3 -right-2 text-[#F47736] font-bold text-sm sm:text-base rotate-12 select-none pointer-events-none">
                  \ /
                </span>
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-[#FFE8A3] p-1 shadow-md border-2 border-white dark:border-[#2C2926] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                    alt="Community member"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Top Left: Teal bubble avatar with doodle crown / sparks */}
            <div className="absolute top-4 sm:top-6 left-2 sm:left-4 flex flex-col items-center animate-in zoom-in-75 duration-300 delay-100">
              <div className="relative">
                <span className="absolute -top-3.5 -left-1 text-[#3E9F8E] font-bold text-xs sm:text-sm -rotate-12 select-none pointer-events-none">
                  M
                </span>
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-[#A8E6CF] p-1 shadow-md border-2 border-white dark:border-[#2C2926] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                    alt="Community member"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Connecting whimsical curved doodle arrow */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
              viewBox="0 0 280 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 85 85 C 140 100 130 140 145 150 C 150 155 160 150 155 140 C 150 130 135 135 145 155"
                stroke="#2B2825"
                strokeWidth="2"
                strokeLinecap="round"
                className="dark:stroke-[#E9E2D9]"
              />
            </svg>

            {/* Floating Speech Bubble: Say more than "Hey" */}
            <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-20">
              <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white dark:bg-[#2A2724] border border-[#2B2825] dark:border-[#554E46] shadow-md text-[10px] sm:text-[11px] font-heading font-bold text-[#211F1D] dark:text-[#F7F4EF] whitespace-nowrap flex items-center gap-1.5">
                <Smile className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F47736]" />
                <span>Say more than “Hey”</span>
              </div>
            </div>

            {/* Center Bottom: Pink bubble avatar with headphones & mobile */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center animate-in zoom-in-75 duration-300 delay-200">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FFD1DC] p-1.5 shadow-xl border-[3px] border-white dark:border-[#2C2926] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
                  alt="Community member listening to music"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Iconic Headline with Orange Corner Brackets around People */}
          <div className="space-y-2 sm:space-y-3 pt-1">
            <h1 className="font-heading font-extrabold text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-[#211F1D] dark:text-[#F7F4EF] tracking-tight leading-tight">
              Meet and Chat to <br />
              <span className="relative inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 my-1 border-2 border-[#F47736] text-[#F47736] rounded-xl shadow-xs">
                {/* 4 Hand-drawn corner marks */}
                <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-[3px] border-l-[3px] border-[#F47736] rounded-tl-xs pointer-events-none" />
                <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-[3px] border-r-[3px] border-[#F47736] rounded-tr-xs pointer-events-none" />
                <span className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-[3px] border-l-[3px] border-[#F47736] rounded-bl-xs pointer-events-none" />
                <span className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-[3px] border-r-[3px] border-[#F47736] rounded-br-xs pointer-events-none" />
                People
              </span>{' '}
              near you
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-[#5B554E] dark:text-[#D1C9BE] max-w-md mx-auto leading-relaxed px-2">
              Go beyond your social circle, & connect with genuine people near and far. Zero resumes, zero corporate posturing.
            </p>
          </div>

          {/* Pagination Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-0.5">
            <span className="w-2 h-2 rounded-full bg-[#F47736]" />
            <span className="w-2 h-2 rounded-full bg-[#E9E2D9] dark:bg-[#3E3A35]" />
            <span className="w-2 h-2 rounded-full bg-[#E9E2D9] dark:bg-[#3E3A35]" />
          </div>

          {/* Primary Action Button (Get Started >) */}
          <div className="pt-2 max-w-sm mx-auto space-y-3 w-full">
            <button
              type="button"
              onClick={() => {
                setJoinModalTab('register');
                setIsJoinModalOpen(true);
              }}
              className="w-full h-12 sm:h-13 rounded-2xl bg-[#F47736] hover:bg-[#E06524] text-white font-heading font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#F47736]/30 transition-all active:scale-[0.98] group"
            >
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Quick 1-Click Social Sign Up Options - Highly Responsive Grid */}
            <div className="pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B] block mb-1.5">
                Instant 1-Click Social Join
              </span>
              <div className="grid grid-cols-3 gap-1.5 xs:gap-2.5 w-full">
                <button
                  type="button"
                  onClick={() => openSocialAuth('google')}
                  className="h-9 sm:h-10 px-2 sm:px-3 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-white dark:bg-[#25221F] hover:bg-[#F7F4EF] dark:hover:bg-[#2F2B27] text-[11px] sm:text-xs font-semibold text-[#211F1D] dark:text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-95"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => openSocialAuth('github')}
                  className="h-9 sm:h-10 px-2 sm:px-3 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-white dark:bg-[#25221F] hover:bg-[#F7F4EF] dark:hover:bg-[#2F2B27] text-[11px] sm:text-xs font-semibold text-[#211F1D] dark:text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-95"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() => openSocialAuth('apple')}
                  className="h-9 sm:h-10 px-2 sm:px-3 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-white dark:bg-[#25221F] hover:bg-[#F7F4EF] dark:hover:bg-[#2F2B27] text-[11px] sm:text-xs font-semibold text-[#211F1D] dark:text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-95"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.64-.78 1.08-1.86.96-2.95-1 .04-2.16.65-2.84 1.43-.59.68-1.12 1.77-.98 2.83 1.11.08 2.22-.53 2.86-1.31z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: SHORT ONBOARDING STORIES (Attachment 2)           */}
      {/* ============================================================ */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#F47736] block">
              Simple & Minimal Discovery
            </span>
            <h2 className="font-heading font-extrabold text-xl xs:text-2xl sm:text-3xl text-[#211F1D] dark:text-[#F7F4EF] tracking-tight">
              Short onboarding — made as simple and minimal as possible
            </h2>
            <p className="text-xs sm:text-sm text-[#7D756C] dark:text-[#A8A199] mt-0.5 max-w-xl">
              Explore everyday human spaces across coffee chats, late-night music, and open-air community gatherings.
            </p>
          </div>

          {/* Quick tab switcher pills for mobile navigation */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 max-w-full">
            {storySlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-7 px-2.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                  currentSlideIndex === idx
                    ? 'bg-[#F47736] text-white shadow-xs'
                    : 'bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] text-[#7D756C] dark:text-[#D1C9BE]'
                }`}
              >
                {slide.tag}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================== */}
        {/* MOBILE VIEW (< md): INTERACTIVE PHONE CARD */}
        {/* ========================================== */}
        <div className="block md:hidden">
          <div
            onTouchStart={onTouchStartHandler}
            onTouchMove={onTouchMoveHandler}
            onTouchEnd={onTouchEndHandler}
            className="rounded-3xl bg-white dark:bg-[#25221F] border-2 border-[#F47736] p-4 sm:p-5 flex flex-col justify-between shadow-xl space-y-4 animate-in fade-in duration-200"
          >
            {/* Arched Image Container */}
            <div className="space-y-3">
              <div className="relative h-64 w-full rounded-t-[44px] rounded-b-2xl overflow-hidden bg-[#EAE2D5] dark:bg-[#1E1C1A]">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Top Pill Vibe Tag */}
                <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-[11px] font-bold text-[#211F1D] dark:text-white flex items-center gap-1.5 shadow-sm">
                  {React.createElement(currentSlide.icon, { className: 'w-3.5 h-3.5 text-[#F47736]' })}
                  <span>{currentSlide.vibe}</span>
                </div>

                {/* Swipe Helper Hint */}
                <div className="absolute bottom-2.5 right-3 text-[10px] font-semibold text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
                  Swipe or tap ➔
                </div>
              </div>

              {/* Headline & Body Text */}
              <div className="space-y-1.5 pt-1 text-left">
                <h3 className="font-heading font-extrabold text-xl text-[#211F1D] dark:text-white leading-tight">
                  {currentSlide.title} <br />
                  <span className="text-[#F47736]">{currentSlide.highlight}</span>
                </h3>
                <p className="text-xs text-[#5B554E] dark:text-[#B3ABA0] leading-relaxed">
                  {currentSlide.description}
                </p>
              </div>
            </div>

            {/* Bottom Category Filter Pills & Circular Navigation Arrow (Attachment 2) */}
            <div className="pt-3 space-y-3.5 border-t border-[#E9E2D9] dark:border-[#332F2B]">
              {/* Category Pills: Friends | Everyone | Access */}
              <div className="flex items-center gap-2">
                {(['Friends', 'Everyone', 'Access'] as const).map((filter, fIdx) => {
                  const isActive = currentSlideIndex === fIdx;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setCurrentSlideIndex(fIdx)}
                      className={`h-8 px-3.5 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-[#3A2218] dark:bg-[#F47736] text-white shadow-xs'
                          : 'bg-[#F7F4EF] dark:bg-[#1C1A18] text-[#7D756C] dark:text-[#A8A199] hover:text-[#211F1D]'
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              {/* Indicator & Black Circular Arrow */}
              <div className="flex items-center justify-between pt-1">
                {/* Indicator dashes */}
                <div className="flex items-center gap-1.5">
                  {storySlides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentSlideIndex(dotIdx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        dotIdx === currentSlideIndex
                          ? 'w-6 bg-black dark:bg-white'
                          : 'w-2 bg-[#D1C9BE] dark:bg-[#554E46]'
                      }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                {/* Circular Action Arrow Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (currentSlideIndex < storySlides.length - 1) {
                      setCurrentSlideIndex(currentSlideIndex + 1);
                    } else {
                      setJoinModalTab('register');
                      setIsJoinModalOpen(true);
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* DESKTOP/TABLET VIEW (>= md): 3 PHONES SIDE-BY-SIDE */}
        {/* ================================================= */}
        <div className="hidden md:grid grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {storySlides.map((slide, idx) => {
            const isCurrent = currentSlideIndex === idx;
            const Icon = slide.icon;

            return (
              <div
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`rounded-3xl bg-white dark:bg-[#25221F] border p-5 flex flex-col justify-between transition-all duration-300 shadow-md cursor-pointer ${
                  isCurrent
                    ? 'border-[#F47736] ring-2 ring-[#F47736]/20 shadow-xl scale-[1.01]'
                    : 'border-[#E9E2D9] dark:border-[#38332F] hover:border-[#F47736]/50'
                }`}
              >
                {/* Upper Arched Image Container */}
                <div className="space-y-4">
                  <div className="relative h-60 w-full rounded-t-[44px] rounded-b-2xl overflow-hidden bg-[#EAE2D5] dark:bg-[#1E1C1A]">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Top Pill Vibe Tag */}
                    <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md text-[11px] font-bold text-[#211F1D] dark:text-white flex items-center gap-1.5 shadow-sm">
                      <Icon className="w-3.5 h-3.5 text-[#F47736]" />
                      <span>{slide.vibe}</span>
                    </div>
                  </div>

                  {/* Headline & Body Text */}
                  <div className="space-y-2 pt-1 text-left">
                    <h3 className="font-heading font-extrabold text-xl text-[#211F1D] dark:text-white leading-tight">
                      {slide.title} <br />
                      <span className="text-[#F47736]">{slide.highlight}</span>
                    </h3>
                    <p className="text-xs text-[#5B554E] dark:text-[#B3ABA0] leading-relaxed line-clamp-3">
                      {slide.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Filter Pills & Navigation Arrow (Matching Attachment 2) */}
                <div className="pt-4 space-y-4 border-t border-[#E9E2D9] dark:border-[#332F2B] mt-4">
                  {/* Category Pills: Friends | Everyone | Access */}
                  <div className="flex items-center gap-2">
                    {(['Friends', 'Everyone', 'Access'] as const).map((filter, fIdx) => {
                      const isActive = (idx === 0 && filter === 'Friends') || (idx === 1 && filter === 'Everyone') || (idx === 2 && filter === 'Access');
                      return (
                        <button
                          key={filter}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlideIndex(fIdx);
                          }}
                          className={`h-8 px-3.5 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-[#3A2218] dark:bg-[#F47736] text-white shadow-xs'
                              : 'bg-[#F7F4EF] dark:bg-[#1C1A18] text-[#7D756C] dark:text-[#A8A199] hover:text-[#211F1D]'
                          }`}
                        >
                          {filter}
                        </button>
                      );
                    })}
                  </div>

                  {/* Indicator & Black Circular Arrow */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Indicator dashes */}
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 rounded-full transition-all ${idx === 0 ? 'w-5 bg-black dark:bg-white' : 'w-1.5 bg-[#D1C9BE] dark:bg-[#554E46]'}`} />
                      <span className={`h-1.5 rounded-full transition-all ${idx === 1 ? 'w-5 bg-black dark:bg-white' : 'w-1.5 bg-[#D1C9BE] dark:bg-[#554E46]'}`} />
                      <span className={`h-1.5 rounded-full transition-all ${idx === 2 ? 'w-5 bg-black dark:bg-white' : 'w-1.5 bg-[#D1C9BE] dark:bg-[#554E46]'}`} />
                    </div>

                    {/* Circular Action Arrow Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (idx < 2) {
                          setCurrentSlideIndex(idx + 1);
                        } else {
                          setJoinModalTab('register');
                          setIsJoinModalOpen(true);
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                      aria-label="Next slide"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: COMMUNITY MANIFESTO / ETHOS PILLARS              */}
      {/* ============================================================ */}
      <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78917C] dark:text-[#95AF99]">
              Our Grounding Constitution
            </span>
            <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#211F1D] dark:text-[#F7F4EF]">
              “You belong before you achieve.”
            </h3>
          </div>
          <Sparkles className="w-5 h-5 text-[#F47736]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F7F4EF] dark:bg-[#1E1C1A] space-y-1">
            <span className="font-heading font-bold text-[#211F1D] dark:text-white block">
              1. Hands & Crafts Celebrated
            </span>
            <p className="text-xs text-[#5B554E] dark:text-[#A8A199] leading-relaxed">
              Woodworkers, electricians, potters, poets, and coders stand on equal footing.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F7F4EF] dark:bg-[#1E1C1A] space-y-1">
            <span className="font-heading font-bold text-[#211F1D] dark:text-white block">
              2. Zero Resume Posturing
            </span>
            <p className="text-xs text-[#5B554E] dark:text-[#A8A199] leading-relaxed">
              No corporate pedigree filters, no recruiter surveillance, no algorithmic hustle culture.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F7F4EF] dark:bg-[#1E1C1A] space-y-1">
            <span className="font-heading font-bold text-[#211F1D] dark:text-white block">
              3. Unhurried Humans
            </span>
            <p className="text-xs text-[#5B554E] dark:text-[#A8A199] leading-relaxed">
              Connect for real conversations, warm coffee, tool lending, and late-night music.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL: HUMAN-FIRST JOIN & LOGIN SHEET                        */}
      {/* ============================================================ */}
      {isJoinModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsJoinModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-150 my-auto shadow-2xl text-[#211F1D] dark:text-[#F7F4EF] max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E2D9] dark:border-[#332F2B]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F47736] text-white flex items-center justify-center font-heading font-extrabold text-xs">
                  LO
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#211F1D] dark:text-white leading-tight">
                    {joinModalTab === 'register' ? 'Join Worldwide Community' : 'Welcome Back'}
                  </h3>
                  <p className="text-[11px] text-[#7D756C] dark:text-[#A8A199]">
                    {joinModalTab === 'register' ? 'No resume required. Just your authentic self.' : 'Sign in to access your Lounge and chats.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#F7F4EF] dark:bg-[#1E1C1A] flex items-center justify-center text-[#7D756C] hover:text-[#211F1D] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-[#E9E2D9] dark:border-[#332F2B] gap-4 text-xs font-heading font-bold">
              <button
                type="button"
                onClick={() => setJoinModalTab('register')}
                className={`pb-2 transition-colors relative ${
                  joinModalTab === 'register' ? 'text-[#F47736]' : 'text-[#7D756C] dark:text-[#9E958B] hover:text-[#211F1D]'
                }`}
              >
                <span>Quick Join</span>
                {joinModalTab === 'register' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F47736] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setJoinModalTab('login')}
                className={`pb-2 transition-colors relative ${
                  joinModalTab === 'login' ? 'text-[#F47736]' : 'text-[#7D756C] dark:text-[#9E958B] hover:text-[#211F1D]'
                }`}
              >
                <span>Log In</span>
                {joinModalTab === 'login' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F47736] rounded-full" />
                )}
              </button>
            </div>

            {/* 1-Click Social Sign-In Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B] block">
                1-Click Automatic Connection
              </span>

              <button
                type="button"
                onClick={() => openSocialAuth('google')}
                className="w-full h-10 sm:h-11 px-4 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A] hover:bg-white dark:hover:bg-[#2A2724] text-xs font-bold text-[#211F1D] dark:text-white flex items-center justify-center gap-2.5 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => openSocialAuth('github')}
                  className="h-9 sm:h-10 px-3 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A] hover:bg-white dark:hover:bg-[#2A2724] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() => openSocialAuth('apple')}
                  className="h-9 sm:h-10 px-3 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A] hover:bg-white dark:hover:bg-[#2A2724] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.64-.78 1.08-1.86.96-2.95-1 .04-2.16.65-2.84 1.43-.59.68-1.12 1.77-.98 2.83 1.11.08 2.22-.53 2.86-1.31z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Personas (Instant Test Switch) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B] block">
                Instant Test Personas (Click to Enter)
              </span>
              <div className="grid grid-cols-2 gap-1.5 xs:gap-2">
                {SAMPLE_USERS.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(u.id)}
                    className="p-1.5 xs:p-2 rounded-xl bg-[#F7F4EF] dark:bg-[#1E1C1A] hover:border-[#F47736] border border-transparent text-left flex items-center gap-2 transition-all"
                  >
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 xs:w-7 xs:h-7 rounded-full object-cover shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold text-[10px] xs:text-[11px] block truncate">{u.name}</span>
                      <span className="text-[9px] xs:text-[10px] text-[#F47736] block truncate">{u.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Minimal Form Fallback */}
            <form onSubmit={joinModalTab === 'register' ? handleRegister : handleLogin} className="space-y-2.5 sm:space-y-3 pt-1 border-t border-[#E9E2D9] dark:border-[#332F2B]">
              <div>
                <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                  {joinModalTab === 'register' ? 'Your Name or Moniker *' : 'Email or Handle *'}
                </label>
                <input
                  type="text"
                  value={joinModalTab === 'register' ? regName : loginIdentifier}
                  onChange={(e) => joinModalTab === 'register' ? setRegName(e.target.value) : setLoginIdentifier(e.target.value)}
                  placeholder="e.g. Miracle Onagun"
                  required
                  className="w-full h-9 sm:h-10 px-3 text-xs rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                />
              </div>

              {joinModalTab === 'register' && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                    Public Handle *
                  </label>
                  <input
                    type="text"
                    value={regHandle}
                    onChange={(e) => setRegHandle(e.target.value)}
                    placeholder="@craft_handle"
                    required
                    className="w-full h-9 sm:h-10 px-3 text-xs rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full h-10 sm:h-11 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white font-heading font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F47736]/25 transition-all active:scale-[0.98]"
              >
                <span>{joinModalTab === 'register' ? 'Enter LinkedOut Worldwide' : 'Log In to The Lounge'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SOCIAL AUTH SELECTION MODAL                                  */}
      {/* ============================================================ */}
      {socialModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => !isAuthenticating && setSocialModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E2D9] dark:border-[#332F2B]">
              <span className="font-heading font-bold text-xs sm:text-sm text-[#211F1D] dark:text-white">
                Sign in with {socialProvider === 'google' ? 'Google' : socialProvider === 'github' ? 'GitHub' : 'Apple'}
              </span>
              <button
                onClick={() => setSocialModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#F7F4EF] dark:bg-[#1E1C1A] flex items-center justify-center text-[#7D756C] hover:text-[#211F1D] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] text-[#7D756C] dark:text-[#A8A199] block">
                Choose an account to connect to LinkedOut:
              </span>

              <div className="space-y-2">
                {[
                  { name: 'Miracle Onagun', email: 'miracleonagun@gmail.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80', role: 'Creator & Artist' as UserRole },
                  { name: 'Alex Rivera', email: 'alex.rivera@crafts.org', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80', role: 'Skilled Trades' as UserRole },
                ].map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={isAuthenticating}
                    onClick={() => executeSocialLogin(acc)}
                    className="w-full p-2.5 sm:p-3 rounded-2xl bg-[#F7F4EF] dark:bg-[#1E1C1A] hover:bg-[#F47736]/10 border border-[#E9E2D9] dark:border-[#38332F] flex items-center gap-3 transition-colors text-left"
                  >
                    <img src={acc.avatar} alt={acc.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-xs text-[#211F1D] dark:text-white block truncate">{acc.name}</span>
                      <span className="text-[11px] text-[#7D756C] dark:text-[#A8A199] block truncate">{acc.email}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {isAuthenticating && (
              <div className="py-2 text-center text-xs text-[#F47736] font-bold flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting securely...</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
