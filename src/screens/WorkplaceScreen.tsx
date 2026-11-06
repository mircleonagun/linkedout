import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  File,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  X,
  Send,
  Sparkles,
  Lock,
  EyeOff,
  Eye,
  SlidersHorizontal,
  Flame,
  Award,
  ThumbsUp,
  MessageSquare,
  HelpCircle,
  CornerDownRight
} from 'lucide-react';
import {
  WorkplacePost,
  WorkplaceCategory,
  WorkplaceComment,
  WorkplaceAttachment
} from '../types';

export const WorkplaceScreen: React.FC = () => {
  const {
    workplacePosts,
    toggleLikeWorkplacePost,
    addWorkplaceComment,
    toggleLikeWorkplaceComment,
    createWorkplacePost,
    reportWorkplacePost,
    submitEmployerResponse,
    currentUser,
    navigateBack,
    getPreviousScreenLabel,
    showToast,
  } = useApp();

  // Active Main Category Tab
  const [activeCategory, setActiveCategory] = useState<'All' | WorkplaceCategory | 'Documents'>('All');

  // Secondary search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<'All' | 'Engineering' | 'Design & Creative' | 'Operations' | 'Verified Responses'>('All');

  // Modals & Active Thread State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedPostIdForDetail, setSelectedPostIdForDetail] = useState<string | null>(null);
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [employerResponsePostId, setEmployerResponsePostId] = useState<string | null>(null);

  // Active Comment Input per post
  const [commentInput, setCommentInput] = useState('');
  const [commentIsAnonymous, setCommentIsAnonymous] = useState(true);
  const [replyingToAuthor, setReplyingToAuthor] = useState<string | null>(null);

  // Composer Form State
  const [compTitle, setCompTitle] = useState('');
  const [compContent, setCompContent] = useState('');
  const [compCategory, setCompCategory] = useState<WorkplaceCategory>('Why I Left');
  const [compCompany, setCompCompany] = useState('');
  const [compIndustry, setCompIndustry] = useState('Technology & Software');
  const [compRole, setCompRole] = useState('');
  const [compStatus, setCompStatus] = useState<'Former Employee' | 'Current Employee' | 'Interviewee' | 'Contractor'>('Former Employee');
  const [compTenure, setCompTenure] = useState('');
  const [compIsAnonymous, setCompIsAnonymous] = useState(true);
  const [compAnonymousAlias, setCompAnonymousAlias] = useState('Anonymous Contributor');
  const [compDepartment, setCompDepartment] = useState('');
  const [compCultureRating, setCompCultureRating] = useState(3.0);
  const [compMgmtRating, setCompMgmtRating] = useState(3.0);
  const [compWorkLifeRating, setCompWorkLifeRating] = useState(3.0);
  const [compCompRating, setCompCompRating] = useState(3.0);
  const [compSeverance, setCompSeverance] = useState('');
  const [compInterviewRounds, setCompInterviewRounds] = useState<number | ''>('');
  const [compSalaryRange, setCompSalaryRange] = useState('');
  const [compNoticeGiven, setCompNoticeGiven] = useState('');
  const [compHasPdfAttachment, setCompHasPdfAttachment] = useState(false);
  const [compPdfTitle, setCompPdfTitle] = useState('');

  // Report Form State
  const [reportReason, setReportReason] = useState<
    'Doxxing / Personal Identifiable Info' | 'Defamation / Fabricated Facts' | 'Harassment or Threats' | 'Proprietary Code / Trade Secret' | 'Spam'
  >('Doxxing / Personal Identifiable Info');
  const [reportDetails, setReportDetails] = useState('');

  // Employer Response Form State
  const [empResponderTitle, setEmpResponderTitle] = useState('');
  const [empResponseText, setEmpResponseText] = useState('');
  const [empActionTaken, setEmpActionTaken] = useState('');

  // Filter posts
  const filteredPosts = workplacePosts.filter((post) => {
    // Category filter
    if (activeCategory === 'Documents') {
      if (!post.attachments || post.attachments.length === 0) return false;
    } else if (activeCategory !== 'All' && post.category !== activeCategory) {
      return false;
    }

    // Secondary filter
    if (filterDepartment === 'Verified Responses' && !post.employerResponse) {
      return false;
    }
    if (filterDepartment === 'Engineering' && !post.department.toLowerCase().includes('infra') && !post.department.toLowerCase().includes('engineer')) {
      return false;
    }
    if (filterDepartment === 'Design & Creative' && !post.department.toLowerCase().includes('design') && !post.department.toLowerCase().includes('art')) {
      return false;
    }
    if (filterDepartment === 'Operations' && !post.department.toLowerCase().includes('ops') && !post.department.toLowerCase().includes('operation')) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCompany = post.companyName.toLowerCase().includes(q);
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchRole = post.roleTitle.toLowerCase().includes(q);
      if (!matchCompany && !matchTitle && !matchContent && !matchRole) return false;
    }

    return true;
  });

  const selectedPostForDetail = workplacePosts.find((p) => p.id === selectedPostIdForDetail);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compTitle.trim() || !compContent.trim() || !compCompany.trim()) {
      showToast('Please provide a title, company, and your experience narrative.', 'info');
      return;
    }

    const attachments: WorkplaceAttachment[] = [];
    if (compHasPdfAttachment && compPdfTitle.trim()) {
      attachments.push({
        type: 'pdf',
        title: compPdfTitle.trim(),
        url: '#',
        size: '1.2 MB',
      });
    }

    createWorkplacePost({
      title: compTitle.trim(),
      content: compContent.trim(),
      category: compCategory,
      companyName: compCompany.trim(),
      companyIndustry: compIndustry.trim(),
      roleTitle: compRole.trim() || 'Team Contributor',
      employmentStatus: compStatus,
      tenure: compTenure.trim() || undefined,
      isAnonymous: compIsAnonymous,
      authorName: compIsAnonymous ? compAnonymousAlias : currentUser.name,
      anonymousAlias: compAnonymousAlias,
      department: compDepartment.trim() || 'General Department',
      avatar: compIsAnonymous
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
        : currentUser.avatar,
      rating: {
        culture: compCultureRating,
        management: compMgmtRating,
        workLife: compWorkLifeRating,
        compensation: compCompRating,
      },
      metrics: {
        severanceOffered: compSeverance.trim() || undefined,
        interviewRounds: typeof compInterviewRounds === 'number' ? compInterviewRounds : undefined,
        salaryRange: compSalaryRange.trim() || undefined,
        noticeGiven: compNoticeGiven.trim() || undefined,
      },
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    setIsComposerOpen(false);
    // Reset form
    setCompTitle('');
    setCompContent('');
    setCompCompany('');
    setCompRole('');
    setCompTenure('');
    setCompPdfTitle('');
    setCompHasPdfAttachment(false);
  };

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addWorkplaceComment(postId, commentInput, commentIsAnonymous, replyingToAuthor || undefined);
    setCommentInput('');
    setReplyingToAuthor(null);
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPostId) return;
    reportWorkplacePost(reportingPostId, reportReason, reportDetails);
    setReportingPostId(null);
    setReportDetails('');
  };

  const handleSendEmployerResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employerResponsePostId || !empResponderTitle.trim() || !empResponseText.trim()) {
      showToast('Please provide your title and official statement.', 'info');
      return;
    }
    submitEmployerResponse(employerResponsePostId, {
      responderTitle: empResponderTitle.trim(),
      responseText: empResponseText.trim(),
      actionTaken: empActionTaken.trim() || undefined,
    });
    setEmployerResponsePostId(null);
    setEmpResponderTitle('');
    setEmpResponseText('');
    setEmpActionTaken('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 xs:px-3 sm:px-6 py-3 sm:py-6 space-y-5 animate-in fade-in duration-300 overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* TOP NAVIGATION & CONTEXT BAR                             */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#E9E2D9] dark:border-[#2E2B27]">
        <button
          type="button"
          onClick={navigateBack}
          className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] text-xs font-bold text-[#5B554E] dark:text-[#F7F4EF] hover:border-[#F47736] transition-all shadow-xs active:scale-98 shrink-0 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F47736] group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden xs:inline">Back to</span>
          <span className="truncate max-w-[120px] xs:max-w-none">{getPreviousScreenLabel()}</span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#78917C]/10 text-[#4D6451] dark:text-[#A7C2AB] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#78917C]" />
            <span>Anti-Doxxing Moderated</span>
          </div>

          <button
            type="button"
            onClick={() => setIsComposerOpen(true)}
            className="h-8 sm:h-9 px-3.5 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-heading font-extrabold flex items-center gap-1.5 shadow-md shadow-[#F47736]/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Post</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* HERO BANNER & ETHOS                                      */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-gradient-to-r from-[#211F1D] via-[#2A2622] to-[#1C1A18] text-white p-5 sm:p-7 border border-[#38332F] shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-60 h-60 bg-[#F47736]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-[#F47736]">
            <EyeOff className="w-3.5 h-3.5" />
            <span>The Unfiltered Workplace · Real Voices, Zero Spin</span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl xs:text-3xl sm:text-4xl tracking-tight text-[#F7F4EF] leading-tight">
            Where workers share the <br className="hidden sm:inline" />
            <span className="text-[#F47736]">truth about corporate reality</span>.
          </h1>

          <p className="text-xs sm:text-sm text-[#D1C9BE] leading-relaxed">
            Unvarnished departure stories, interview transparency, and real salary breakdowns. Anonymous by default, protected from doxxing, open to verified employer responses.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* QUICK COMPOSER TRIGGER BAR (Matching Attachment Mockup)  */}
      {/* ======================================================== */}
      <div
        onClick={() => setIsComposerOpen(true)}
        className="rounded-2xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] p-3.5 sm:p-4 flex items-center gap-3 cursor-pointer shadow-sm hover:border-[#F47736]/60 transition-all group"
      >
        <div className="w-9 h-9 rounded-full bg-[#F47736]/10 text-[#F47736] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <EyeOff className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs text-[#7D756C] dark:text-[#A8A199] truncate font-medium">
          Write something honest about your workplace, interview, or departure...
        </div>
        <button
          type="button"
          className="h-8 px-3 rounded-lg bg-[#F7F4EF] dark:bg-[#1E1C1A] text-xs font-bold text-[#211F1D] dark:text-white border border-[#E9E2D9] dark:border-[#332F2B] group-hover:border-[#F47736] group-hover:text-[#F47736] transition-colors shrink-0"
        >
          Post Anonymously
        </button>
      </div>

      {/* ======================================================== */}
      {/* CATEGORY TABS & SEARCH (Matching Attached UI Design)     */}
      {/* ======================================================== */}
      <div className="space-y-3">
        {/* Main Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'All', label: 'All Discussions' },
            { id: 'Why I Left', label: 'Why I Left' },
            { id: 'Interview Chronicles', label: 'Interview Chronicles' },
            { id: 'Workplace Reality Check', label: 'Workplace Reality Check' },
            { id: 'Documents', label: 'Documents & Proof' },
          ].map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as any)}
                className={`h-9 px-3.5 rounded-full text-xs font-heading font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#3A2218] dark:bg-[#F47736] text-white shadow-sm'
                    : 'bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] text-[#5B554E] dark:text-[#D1C9BE] hover:border-[#F47736]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Secondary Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#7D756C] dark:text-[#A8A199] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, title, or topic..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#7D756C]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 max-w-full">
            {(['All', 'Engineering', 'Design & Creative', 'Operations', 'Verified Responses'] as const).map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setFilterDepartment(dept)}
                className={`h-7 px-2.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  filterDepartment === dept
                    ? 'bg-[#F47736]/15 text-[#F47736] border border-[#F47736]/40'
                    : 'bg-white dark:bg-[#25221F] text-[#7D756C] dark:text-[#A8A199] border border-[#E9E2D9] dark:border-[#38332F]'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* POSTS FEED / LIST VIEW                                   */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] text-center space-y-3">
            <Briefcase className="w-10 h-10 text-[#A8A199] mx-auto stroke-[1.5]" />
            <h3 className="font-heading font-extrabold text-base text-[#211F1D] dark:text-white">
              No discussions found
            </h3>
            <p className="text-xs text-[#7D756C] dark:text-[#A8A199] max-w-sm mx-auto">
              Be the first to share an honest chronicle or workplace review for this category.
            </p>
            <button
              onClick={() => setIsComposerOpen(true)}
              className="h-9 px-4 rounded-xl bg-[#F47736] text-white text-xs font-bold shadow-sm"
            >
              Start Anonymous Post
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isDetailActive = selectedPostIdForDetail === post.id;

            return (
              <article
                key={post.id}
                className={`rounded-3xl bg-white dark:bg-[#25221F] border transition-all duration-200 shadow-sm overflow-hidden ${
                  post.pinned
                    ? 'border-[#F47736]/50 ring-1 ring-[#F47736]/20'
                    : 'border-[#E9E2D9] dark:border-[#38332F]'
                }`}
              >
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Top Header: Author, Company Badge, Category Tag */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <img
                          src={post.avatar}
                          alt={post.authorName}
                          className="w-10 h-10 rounded-full object-cover border border-[#E9E2D9] dark:border-[#38332F]"
                        />
                        {post.isAnonymous && (
                          <span
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#211F1D] text-white flex items-center justify-center border-2 border-white dark:border-[#25221F]"
                            title="Anonymous & Protected"
                          >
                            <EyeOff className="w-2.5 h-2.5 text-[#F47736]" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-heading font-extrabold text-xs sm:text-sm text-[#211F1D] dark:text-white truncate">
                            {post.authorName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F7F4EF] dark:bg-[#1E1C1A] text-[#7D756C] dark:text-[#A8A199] font-medium">
                            {post.employmentStatus}
                          </span>
                          {post.pinned && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F47736]/15 text-[#F47736] font-bold">
                              ★ Pinned Story
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-[#7D756C] dark:text-[#A8A199] mt-0.5 truncate">
                          <span className="font-bold text-[#F47736]">{post.companyName}</span>
                          <span>·</span>
                          <span className="truncate">{post.roleTitle}</span>
                          {post.tenure && (
                            <>
                              <span>·</span>
                              <span>{post.tenure}</span>
                            </>
                          )}
                          <span>·</span>
                          <span>{post.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Category Pill Tag */}
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F7F4EF] dark:bg-[#1E1C1A] border border-[#E9E2D9] dark:border-[#38332F] text-[#5B554E] dark:text-[#D1C9BE]">
                      {post.category}
                    </span>
                  </div>

                  {/* Post Title & Narrative */}
                  <div className="space-y-2">
                    <h2
                      onClick={() => setSelectedPostIdForDetail(isDetailActive ? null : post.id)}
                      className="font-heading font-extrabold text-base sm:text-lg text-[#211F1D] dark:text-white hover:text-[#F47736] cursor-pointer transition-colors leading-snug"
                    >
                      {post.title}
                    </h2>

                    <p className={`text-xs sm:text-sm text-[#4A443E] dark:text-[#D1C9BE] leading-relaxed whitespace-pre-line ${
                      !isDetailActive ? 'line-clamp-4' : ''
                    }`}>
                      {post.content}
                    </p>

                    {!isDetailActive && post.content.length > 250 && (
                      <button
                        type="button"
                        onClick={() => setSelectedPostIdForDetail(post.id)}
                        className="text-xs font-bold text-[#F47736] hover:underline pt-0.5 block"
                      >
                        Read complete unfiltered story & metrics →
                      </button>
                    )}
                  </div>

                  {/* Rating Scores Grid (Culture, Management, WorkLife, Compensation) */}
                  {post.rating && (
                    <div className="p-3 rounded-2xl bg-[#F7F4EF]/70 dark:bg-[#1E1C1A]/80 border border-[#E9E2D9] dark:border-[#332F2B] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="p-1">
                        <span className="text-[10px] text-[#7D756C] dark:text-[#A8A199] block font-medium">Culture</span>
                        <span className={`text-xs font-heading font-extrabold ${post.rating.culture < 2.5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          ★ {post.rating.culture.toFixed(1)} / 5.0
                        </span>
                      </div>
                      <div className="p-1">
                        <span className="text-[10px] text-[#7D756C] dark:text-[#A8A199] block font-medium">Leadership</span>
                        <span className={`text-xs font-heading font-extrabold ${post.rating.management < 2.5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          ★ {post.rating.management.toFixed(1)} / 5.0
                        </span>
                      </div>
                      <div className="p-1">
                        <span className="text-[10px] text-[#7D756C] dark:text-[#A8A199] block font-medium">Work / Life</span>
                        <span className={`text-xs font-heading font-extrabold ${post.rating.workLife < 2.5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          ★ {post.rating.workLife.toFixed(1)} / 5.0
                        </span>
                      </div>
                      <div className="p-1">
                        <span className="text-[10px] text-[#7D756C] dark:text-[#A8A199] block font-medium">Compensation</span>
                        <span className="text-xs font-heading font-extrabold text-[#F47736]">
                          ★ {post.rating.compensation.toFixed(1)} / 5.0
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Metrics Badges */}
                  {post.metrics && (
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {post.metrics.salaryRange && (
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#2A2724] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white font-medium flex items-center gap-1.5">
                          <span className="text-[#F47736] font-bold">Salary:</span>
                          <span>{post.metrics.salaryRange}</span>
                        </span>
                      )}
                      {post.metrics.severanceOffered && (
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#2A2724] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white font-medium flex items-center gap-1.5">
                          <span className="text-[#F47736] font-bold">Severance:</span>
                          <span>{post.metrics.severanceOffered}</span>
                        </span>
                      )}
                      {typeof post.metrics.interviewRounds === 'number' && (
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#2A2724] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white font-medium flex items-center gap-1.5">
                          <span className="text-[#F47736] font-bold">Rounds:</span>
                          <span>{post.metrics.interviewRounds} stages</span>
                        </span>
                      )}
                      {post.metrics.ghostedAfterFinal && (
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Ghosted after final stage</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Attachments (PDFs & Proofs Matching Attachment 2 UI) */}
                  {post.attachments && post.attachments.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#A8A199] block">
                        Verified Documentation & Proof
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {post.attachments.map((att, attIdx) => (
                          <div
                            key={attIdx}
                            className="p-3 rounded-2xl bg-[#F7F4EF] dark:bg-[#1E1C1A] border border-[#E9E2D9] dark:border-[#38332F] flex items-center justify-between gap-3 shadow-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {att.type === 'pdf' ? (
                                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 font-bold text-[10px] flex items-center justify-center shrink-0 border border-rose-500/20">
                                  PDF
                                </div>
                              ) : att.type === 'image' ? (
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 font-bold text-[10px] flex items-center justify-center shrink-0 border border-amber-500/20">
                                  IMG
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 font-bold text-[10px] flex items-center justify-center shrink-0 border border-blue-500/20">
                                  LINK
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="font-heading font-bold text-xs text-[#211F1D] dark:text-white block truncate">
                                  {att.title}
                                </span>
                                {att.size && (
                                  <span className="text-[10px] text-[#7D756C] dark:text-[#A8A199]">
                                    {att.size}
                                  </span>
                                )}
                              </div>
                            </div>

                            <a
                              href={att.url}
                              onClick={(e) => {
                                e.preventDefault();
                                showToast(`Opening document: ${att.title}`, 'info');
                              }}
                              className="w-7 h-7 rounded-lg bg-white dark:bg-[#2A2724] border border-[#E9E2D9] dark:border-[#38332F] flex items-center justify-center text-[#7D756C] hover:text-[#F47736] transition-colors shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Employer Response Box (Verified Company Statement) */}
                  {post.employerResponse && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#F47736]" />
                          <span className="font-heading font-extrabold text-xs text-[#211F1D] dark:text-white">
                            Official Statement · {post.employerResponse.employerName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#F47736] text-white font-bold">
                            Verified Employer
                          </span>
                        </div>
                        <span className="text-[10px] text-[#7D756C] dark:text-[#A8A199]">
                          {post.employerResponse.responseDate}
                        </span>
                      </div>

                      <p className="text-xs text-[#4A443E] dark:text-[#D1C9BE] leading-relaxed italic">
                        “{post.employerResponse.responseText}”
                      </p>

                      {post.employerResponse.actionTaken && (
                        <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#78917C] dark:text-[#95AF99] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#78917C]" />
                          <span>Action Taken: {post.employerResponse.actionTaken}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E9E2D9] dark:border-[#332F2B] text-xs">
                    <div className="flex items-center gap-2 sm:gap-4">
                      {/* Like button */}
                      <button
                        type="button"
                        onClick={() => toggleLikeWorkplacePost(post.id)}
                        className={`flex items-center gap-1.5 py-1 px-2.5 rounded-xl transition-all ${
                          post.isLiked
                            ? 'text-rose-500 bg-rose-500/10 font-bold'
                            : 'text-[#5B554E] dark:text-[#B3ABA0] hover:text-rose-500 hover:bg-rose-500/10'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likesCount}</span>
                      </button>

                      {/* Comment button */}
                      <button
                        type="button"
                        onClick={() => setSelectedPostIdForDetail(isDetailActive ? null : post.id)}
                        className={`flex items-center gap-1.5 py-1 px-2.5 rounded-xl transition-all ${
                          isDetailActive
                            ? 'text-[#F47736] bg-[#F47736]/10 font-bold'
                            : 'text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#F47736] hover:bg-[#F47736]/10'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentsCount} Comments</span>
                      </button>

                      {/* Employer official response trigger */}
                      <button
                        type="button"
                        onClick={() => setEmployerResponsePostId(post.id)}
                        className="hidden sm:flex items-center gap-1 py-1 px-2 rounded-lg text-[#7D756C] hover:text-[#F47736] text-[11px]"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Company Statement</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Flag / Report */}
                      <button
                        type="button"
                        onClick={() => setReportingPostId(post.id)}
                        className="flex items-center gap-1 text-[11px] text-[#7D756C] dark:text-[#A8A199] hover:text-rose-500 transition-colors"
                        title="Report inappropriate content or PII"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Report</span>
                      </button>

                      {/* Share */}
                      <button
                        type="button"
                        onClick={() => {
                          showToast('Discussion link copied to clipboard!', 'warm');
                        }}
                        className="w-7 h-7 rounded-lg bg-[#F7F4EF] dark:bg-[#1E1C1A] flex items-center justify-center text-[#7D756C] hover:text-[#211F1D] dark:hover:text-white"
                        aria-label="Share discussion"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* ====================================================== */}
                  {/* EXPANDED THREAD COMMENTS (Matching Attachment Design)  */}
                  {/* ====================================================== */}
                  {isDetailActive && (
                    <div className="pt-4 border-t border-[#E9E2D9] dark:border-[#332F2B] space-y-4 animate-in fade-in duration-200">
                      
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-extrabold text-xs sm:text-sm text-[#211F1D] dark:text-white">
                          Comments ({post.comments.length} Comments)
                        </span>

                        <div className="flex items-center gap-2">
                          <label className="text-[11px] text-[#7D756C] dark:text-[#A8A199] flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={commentIsAnonymous}
                              onChange={(e) => setCommentIsAnonymous(e.target.checked)}
                              className="rounded border-[#E9E2D9] text-[#F47736] focus:ring-0"
                            />
                            <span>Reply Anonymously</span>
                          </label>
                        </div>
                      </div>

                      {/* List of comments */}
                      <div className="space-y-3">
                        {post.comments.length === 0 ? (
                          <p className="text-xs text-[#7D756C] dark:text-[#A8A199] italic py-2">
                            No comments yet. Share your experience or support.
                          </p>
                        ) : (
                          post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="p-3.5 rounded-2xl bg-[#F7F4EF]/70 dark:bg-[#1E1C1A]/70 border border-[#E9E2D9] dark:border-[#38332F] space-y-2 text-xs"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={comment.avatar}
                                    alt={comment.authorName}
                                    className="w-7 h-7 rounded-full object-cover border border-[#E9E2D9] dark:border-[#38332F]"
                                  />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-[#211F1D] dark:text-white">
                                        {comment.authorName}
                                      </span>
                                      {comment.isAnonymous && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#211F1D] text-white">
                                          Anon
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-[#7D756C] dark:text-[#A8A199] block">
                                      {comment.authorRole} · {comment.createdAt}
                                    </span>
                                  </div>
                                </div>

                                {/* Like comment */}
                                <button
                                  type="button"
                                  onClick={() => toggleLikeWorkplaceComment(post.id, comment.id)}
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] ${
                                    comment.isLiked
                                      ? 'text-rose-500 bg-rose-500/10 font-bold'
                                      : 'text-[#7D756C] hover:text-rose-500'
                                  }`}
                                >
                                  <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                                  <span>{comment.likesCount}</span>
                                </button>
                              </div>

                              <p className="text-xs text-[#4A443E] dark:text-[#D1C9BE] leading-relaxed pl-9">
                                {comment.replyToAuthor && (
                                  <span className="text-[#F47736] font-semibold mr-1">
                                    @{comment.replyToAuthor}
                                  </span>
                                )}
                                {comment.content}
                              </p>

                              {/* Quick Reply Button */}
                              <div className="pl-9 flex items-center gap-3 pt-1 text-[11px]">
                                <button
                                  type="button"
                                  onClick={() => setReplyingToAuthor(comment.authorName)}
                                  className="text-[#7D756C] hover:text-[#F47736] font-semibold flex items-center gap-1"
                                >
                                  <CornerDownRight className="w-3 h-3" />
                                  <span>Reply On Your Comment</span>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Replying indicator */}
                      {replyingToAuthor && (
                        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#F47736]/10 text-xs text-[#F47736]">
                          <span>Replying to <strong>@{replyingToAuthor}</strong></span>
                          <button onClick={() => setReplyingToAuthor(null)} className="text-xs hover:underline">
                            Cancel
                          </button>
                        </div>
                      )}

                      {/* Comment Input Bar */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSendComment(post.id);
                            }
                          }}
                          placeholder={
                            commentIsAnonymous
                              ? 'Write comment here as Anonymous...'
                              : `Write comment here as ${currentUser.name.split(' ')[0]}...`
                          }
                          className="flex-1 h-10 px-3.5 text-xs rounded-xl bg-[#F7F4EF] dark:bg-[#1E1C1A] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendComment(post.id)}
                          className="h-10 px-4 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
                        >
                          <span>Send</span>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              </article>
            );
          })
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ANONYMOUS POST COMPOSER                         */}
      {/* ======================================================== */}
      {isComposerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsComposerOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] rounded-3xl p-5 sm:p-7 space-y-4 my-auto shadow-2xl text-[#211F1D] dark:text-[#F7F4EF] max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E2D9] dark:border-[#332F2B]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F47736] text-white flex items-center justify-center font-heading font-extrabold text-sm shadow-xs">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-[#211F1D] dark:text-white">
                    Share Unfiltered Workplace Story
                  </h3>
                  <p className="text-[11px] text-[#7D756C] dark:text-[#A8A199]">
                    Protected identity. Anti-doxxing guidelines enforced.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsComposerOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#F7F4EF] dark:bg-[#1E1C1A] flex items-center justify-center text-[#7D756C] hover:text-[#211F1D] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
              
              {/* Category Picker */}
              <div>
                <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                  Chronicle Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Why I Left', 'Interview Chronicles', 'Workplace Reality Check', 'General Discussion'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCompCategory(cat)}
                      className={`h-9 px-2 rounded-xl text-[11px] font-bold text-center border transition-all ${
                        compCategory === cat
                          ? 'bg-[#3A2218] dark:bg-[#F47736] text-white border-transparent shadow-xs'
                          : 'bg-[#F7F4EF] dark:bg-[#1E1C1A] border-[#E9E2D9] dark:border-[#38332F] text-[#5B554E] dark:text-[#D1C9BE]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                  Story Headline *
                </label>
                <input
                  type="text"
                  value={compTitle}
                  onChange={(e) => setCompTitle(e.target.value)}
                  placeholder="e.g. Why I walked away from a $240k title after quiet RTO attrition"
                  required
                  className="w-full h-10 px-3 text-xs rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                />
              </div>

              {/* Company & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={compCompany}
                    onChange={(e) => setCompCompany(e.target.value)}
                    placeholder="e.g. NexaPay Global, Apex Logistics"
                    required
                    className="w-full h-10 px-3 text-xs rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                    Role / Position Title
                  </label>
                  <input
                    type="text"
                    value={compRole}
                    onChange={(e) => setCompRole(e.target.value)}
                    placeholder="e.g. Senior Frontend Lead, Staff SRE"
                    className="w-full h-10 px-3 text-xs rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                  />
                </div>
              </div>

              {/* Status & Tenure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                    Your Relationship to Company
                  </label>
                  <select
                    value={compStatus}
                    onChange={(e) => setCompStatus(e.target.value as any)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                  >
                    <option value="Former Employee">Former Employee</option>
                    <option value="Current Employee">Current Employee</option>
                    <option value="Interviewee">Interviewee</option>
                    <option value="Contractor">Contractor / Freelancer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                    Tenure or Timeline
                  </label>
                  <input
                    type="text"
                    value={compTenure}
                    onChange={(e) => setCompTenure(e.target.value)}
                    placeholder="e.g. 2 yrs 4 mos, Interview (3 wks)"
                    className="w-full h-10 px-3 text-xs rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                  />
                </div>
              </div>

              {/* Narrative Content */}
              <div>
                <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                  Full Experience & Narrative *
                </label>
                <textarea
                  rows={5}
                  value={compContent}
                  onChange={(e) => setCompContent(e.target.value)}
                  placeholder="Share what happened candidly. What was promised? What was reality? What can candidates or fellow workers learn from your experience?"
                  required
                  className="w-full p-3 text-xs rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A] text-[#211F1D] dark:text-white focus:outline-none focus:border-[#F47736]"
                />
              </div>

              {/* Ratings Sliders (Culture, Management, WorkLife, Compensation) */}
              <div className="p-3.5 rounded-2xl bg-[#F7F4EF] dark:bg-[#1E1C1A] border border-[#E9E2D9] dark:border-[#38332F] space-y-2.5">
                <span className="text-[11px] font-bold text-[#211F1D] dark:text-white block">
                  Workplace Reality Scores (1.0 to 5.0)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-[10px] text-[#7D756C] mb-1">
                      <span>Culture</span>
                      <span className="font-bold">{compCultureRating.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={0.1}
                      value={compCultureRating}
                      onChange={(e) => setCompCultureRating(parseFloat(e.target.value))}
                      className="w-full accent-[#F47736]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-[#7D756C] mb-1">
                      <span>Leadership</span>
                      <span className="font-bold">{compMgmtRating.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={0.1}
                      value={compMgmtRating}
                      onChange={(e) => setCompMgmtRating(parseFloat(e.target.value))}
                      className="w-full accent-[#F47736]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-[#7D756C] mb-1">
                      <span>Work / Life Balance</span>
                      <span className="font-bold">{compWorkLifeRating.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={0.1}
                      value={compWorkLifeRating}
                      onChange={(e) => setCompWorkLifeRating(parseFloat(e.target.value))}
                      className="w-full accent-[#F47736]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-[#7D756C] mb-1">
                      <span>Compensation Fairness</span>
                      <span className="font-bold">{compCompRating.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={0.1}
                      value={compCompRating}
                      onChange={(e) => setCompCompRating(parseFloat(e.target.value))}
                      className="w-full accent-[#F47736]"
                    />
                  </div>
                </div>
              </div>

              {/* Anonymity Controls */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-[#F47736]" />
                    <span className="font-bold text-xs text-[#211F1D] dark:text-white">
                      Identity Privacy Protection
                    </span>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-xs text-[#F47736]">
                    <input
                      type="checkbox"
                      checked={compIsAnonymous}
                      onChange={(e) => setCompIsAnonymous(e.target.checked)}
                      className="rounded text-[#F47736] focus:ring-0"
                    />
                    <span>Post Anonymously</span>
                  </label>
                </div>

                {compIsAnonymous ? (
                  <div>
                    <label className="block text-[10px] text-[#7D756C] dark:text-[#A8A199] mb-1">
                      Pseudonym Alias (Displayed in feed)
                    </label>
                    <input
                      type="text"
                      value={compAnonymousAlias}
                      onChange={(e) => setCompAnonymousAlias(e.target.value)}
                      placeholder="e.g. Anonymous Falcon, Ex-Staff Lead"
                      className="w-full h-8 px-3 text-xs rounded-lg border border-[#E9E2D9] dark:border-[#38332F] bg-white dark:bg-[#25221F]"
                    />
                  </div>
                ) : (
                  <p className="text-[11px] text-[#7D756C]">
                    You are posting publicly under your profile: <strong>{currentUser.name}</strong>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white font-heading font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F47736]/25 transition-all active:scale-[0.98]"
              >
                <span>Publish to The Unfiltered Workplace</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: REPORT & MODERATION FLOW                        */}
      {/* ======================================================== */}
      {reportingPostId && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setReportingPostId(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E2D9] dark:border-[#332F2B]">
              <div className="flex items-center gap-2 text-rose-500 font-heading font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Report Content to Community Committee</span>
              </div>
              <button
                onClick={() => setReportingPostId(null)}
                className="w-7 h-7 rounded-lg bg-[#F7F4EF] dark:bg-[#1E1C1A] flex items-center justify-center text-[#7D756C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                  Violation Category *
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A]"
                >
                  <option value="Doxxing / Personal Identifiable Info">Doxxing / Personal Identifiable Info (Names, phone numbers)</option>
                  <option value="Defamation / Fabricated Facts">Defamation / Completely fabricated claims</option>
                  <option value="Harassment or Threats">Harassment, hate speech, or threats</option>
                  <option value="Proprietary Code / Trade Secret">Proprietary trade secrets or source code leak</option>
                  <option value="Spam">Spam or external recruitment advertising</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                  Provide context for the moderation team *
                </label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Explain why this post violates community guidelines..."
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#F7F4EF] dark:bg-[#1E1C1A] text-[10px] text-[#7D756C] leading-relaxed">
                LinkedOut protects honest worker speech while strictly forbidding doxxing individual non-executive employees or leaking confidential customer records.
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-heading font-bold text-xs"
              >
                Submit Report for Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: EMPLOYER RESPONSE INTERFACE                     */}
      {/* ======================================================== */}
      {employerResponsePostId && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setEmployerResponsePostId(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E2D9] dark:border-[#332F2B]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#F47736]" />
                <span className="font-heading font-extrabold text-sm text-[#211F1D] dark:text-white">
                  Employer Official Response
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F47736] text-white font-bold">
                  Verified Portal
                </span>
              </div>

              <button
                onClick={() => setEmployerResponsePostId(null)}
                className="w-7 h-7 rounded-lg bg-[#F7F4EF] dark:bg-[#1E1C1A] flex items-center justify-center text-[#7D756C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendEmployerResponse} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                  Your Official Title & Organization *
                </label>
                <input
                  type="text"
                  value={empResponderTitle}
                  onChange={(e) => setEmpResponderTitle(e.target.value)}
                  placeholder="e.g. VP of People Operations, Engineering Director"
                  required
                  className="w-full h-10 px-3 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                  Company Statement / Perspective *
                </label>
                <textarea
                  rows={4}
                  value={empResponseText}
                  onChange={(e) => setEmpResponseText(e.target.value)}
                  placeholder="Address the claims candidly. What context was missing? How does leadership view this feedback?"
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5B554E] dark:text-[#A8A199] mb-1">
                  Concrete Action or Policy Changes Taken (Optional)
                </label>
                <input
                  type="text"
                  value={empActionTaken}
                  onChange={(e) => setEmpActionTaken(e.target.value)}
                  placeholder="e.g. Instituted $500 stipend for take-home tests, audited on-call schedule"
                  className="w-full h-10 px-3 rounded-xl border border-[#E9E2D9] dark:border-[#38332F] bg-[#F7F4EF] dark:bg-[#1E1C1A]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-[#F47736] hover:bg-[#E06524] text-white font-heading font-extrabold text-xs shadow-md shadow-[#F47736]/20 transition-all"
              >
                Publish Verified Employer Statement
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
