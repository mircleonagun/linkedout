export type ScreenId =
  | 'home'
  | 'discover'
  | 'circles'
  | 'messages'
  | 'profile'
  | 'opendoors'
  | 'findapro'
  | 'afterhours'
  | 'settings'
  | 'welcome'
  | 'onboarding'
  | 'unfiltered';

export type UserRole =
  | 'Skilled Trades'
  | 'Creator & Artist'
  | 'Student & Learner'
  | 'Entrepreneur'
  | 'Freelancer'
  | 'Everyday Human'
  | 'Caregiver & Educator'
  | 'Technologist';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage?: string;
  headline: string;
  role: UserRole;
  location: string;
  country: string;
  countryFlag: string;
  bio: string;
  belongingNote?: string; // "You belong before you achieve" human note
  skills: string[];
  interests: string[];
  curiousAbout: string[];
  currentlyWorkingOn?: string;
  values: string[];
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  verifiedCraft?: string; // e.g., "Master Ceramist", "Licensed Electrician", "Independent Roaster"
  joinedYear: number;
  authProvider?: 'google' | 'github' | 'apple' | 'email';
}

export type PostMood =
  | 'Showcasing a Craft'
  | 'Celebrating Progress'
  | 'Seeking Advice'
  | 'Open to Collaborate'
  | 'Life & Musings'
  | 'Apprenticeship & Learning';

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  createdAt: string;
  cheersCount: number;
  isCheered?: boolean;
}

export interface Post {
  id: string;
  author: UserProfile;
  content: string;
  mood: PostMood;
  tags: string[];
  image?: string;
  imageAlt?: string;
  createdAt: string;
  cheersCount: number; // LinkedOut's warm equivalent to like
  resonatesCount: number; // Share/resonate
  comments: Comment[];
  isCheered?: boolean;
  isResonated?: boolean;
  circleId?: string;
  circleName?: string;
}

export interface Circle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  coverImage?: string;
  membersCount: number;
  isJoined?: boolean;
  rules: string[];
  moderators: string[];
  recentTopic: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participant: UserProfile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export type OpportunityType = 'Apprenticeship' | 'Collaboration' | 'Freelance Gig' | 'Full-Time Role' | 'Mentorship';

export interface Opportunity {
  id: string;
  title: string;
  creator: UserProfile;
  organization?: string;
  type: OpportunityType;
  location: string;
  isRemote: boolean;
  compensation: string; // "Fair Living Wage", "$45-60/hr", "Profit-Share", "Skill Exchange"
  description: string;
  whoWeNeed: string;
  whatYouWillLearn: string;
  tags: string[];
  applicantCount: number;
  hasApplied?: boolean;
  publishedAt: string;
}

export interface ProService {
  id: string;
  pro: UserProfile;
  serviceTitle: string;
  category: 'Skilled Trades' | 'Creative Arts' | 'Repairs & Tech' | 'Culinary' | 'Home & Garden' | 'Wellness';
  rate: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  availableLocation: string;
  sampleWorkImages: string[];
  verifiedBadge: string;
  guaranteeNote: string;
}

export type AfterHoursCategory =
  | 'All'
  | 'Nightclubs & Lounges'
  | 'Bars & Rooftops'
  | 'Live Music'
  | 'DJ Nights & Parties'
  | 'Karaoke & Comedy'
  | 'Beach Parties'
  | 'Secret After Hours'
  | 'VIP Experience'
  | 'Clubs'
  | 'Bars & Lounges'
  | 'Nightlife'
  | 'Acoustic Jam'
  | 'Makers Night'
  | 'Story Circle'
  | 'Pop-up Kitchen';

export interface AfterHoursEvent {
  id: string;
  title: string;
  host: UserProfile;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  category: AfterHoursCategory;
  description: string;
  attendeesCount: number;
  hasRsvpd?: boolean;
  image?: string;
  // Nightlife & Tickets
  venueName?: string;
  venueAddress?: string;
  venueDistance?: string;
  price?: number;
  currency?: string;
  priceNgn?: number; // e.g. 50 (50 Naira)
  priceUsd?: number; // e.g. 1
  priceCrypto?: number; // e.g. 0.05 USDT
  slotsAvailable?: number;
  genreTags?: string[];
  isSaved?: boolean;
  hasTicket?: boolean;
  ticketCount?: number;
  djLineup?: string[];
  isVipAvailable?: boolean;
  vipPrice?: number;
  vipPriceNgn?: number;
  vipPriceUsd?: number;
  vipPriceCrypto?: number;
  vipPerks?: string[];
  offers?: string;
  // Secret / Exclusive Pass Feature
  isSecretExclusive?: boolean;
  secretPassRequired?: boolean;
  secretLocationHint?: string;
  secretDoorPasscode?: string;
  secretConciergeContact?: string;
  atmosphere?: string;
  mapX?: number; // 0 - 100 percentage for interactive map
  mapY?: number; // 0 - 100 percentage for interactive map
}

export type CurrencyMode = 'NGN' | 'USD' | 'CRYPTO';
export type PaymentMethodType = 'naira' | 'dollar' | 'crypto';
export type CryptoNetwork = 'USDT (TRC20)' | 'USDT (ERC20)' | 'BTC' | 'ETH' | 'SOL';

export interface NightlifeVenue {
  id: string;
  name: string;
  type: 'Nightclub' | 'Rooftop Bar' | 'Speakeasy' | 'Acoustic Lounge' | 'Music Hall' | 'Beach Club' | 'Comedy & Karaoke';
  address: string;
  neighborhood: string;
  distance: string;
  rating: number;
  reviewCount: number;
  image: string;
  vibeTags: string[];
  openingHours: string;
  status: 'Open Now' | 'Guestlist Open' | 'VIP Tables Only' | 'Opening at 9 PM' | 'Doors Open 10 PM';
  entryCover: string;
  featuredCocktail?: string;
  isSaved?: boolean;
  mapX?: number; // percentage coordinate on interactive map
  mapY?: number;
  djTonight?: string;
  eventsTonightCount?: number;
  vipAvailable?: boolean;
  atmosphere?: 'High Energy' | 'Rooftop Sunset' | 'Underground Speakeasy' | 'Beach Party' | 'Neon Rave' | 'Intimate Lounge' | 'Karaoke Jam';
}

export interface EntertainerAppearance {
  id: string;
  date: string;
  time: string;
  venue: string;
  eventTitle: string;
  status: 'Confirmed' | 'Tonight' | 'Headline Set' | 'Guest Feature';
}

export interface EntertainerReview {
  id: string;
  author: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  event?: string;
  reviewer?: string;
}

export interface EntertainerProfile {
  id: string;
  name: string;
  stageName: string;
  role:
    | 'Resident DJ'
    | 'Headline DJ'
    | 'Hype Man & MC'
    | 'Live Electronic Duo'
    | 'Acoustic Performer'
    | 'Vinyl Selector'
    | 'Dancer & Performer'
    | 'Event Host';
  genres: string[];
  entertainmentStyles?: string[];
  hourlyRate: string;
  rating: number;
  reviewCount: number;
  avatar: string;
  coverImage?: string;
  mixTitle: string;
  mixDuration: string;
  videoPreviewUrl?: string;
  videoTitle?: string;
  videoDuration?: string;
  bio: string;
  availableForBooking: boolean;
  upcomingGigsCount: number;
  verifiedEntertainer: boolean;
  appearances?: EntertainerAppearance[];
  reviews?: EntertainerReview[];
}

export interface AfterHoursPassState {
  isUnlocked: boolean;
  unlockedTier?: '50_naira' | 'black_vip';
  unlockedAt?: string;
  passCode?: string;
  memberCode?: string;
  tier?: '50_naira' | 'black_vip';
}

export interface BookedTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  venueName: string;
  venueAddress: string;
  date: string;
  time: string;
  ticketTier: string;
  quantity: number;
  totalPaid: number;
  currency: string;
  qrCode: string;
  holderName: string;
  status: 'Confirmed' | 'Active Pass';
  bookingRef: string;
}

export interface EntertainmentBookingRequest {
  id: string;
  entertainerId: string;
  entertainerName: string;
  clientName: string;
  clientEmail: string;
  eventDate: string;
  eventTime: string;
  eventType: 'Private After-Party' | 'Club Resident Guest' | 'Art Gallery Mixer' | 'Rooftop Session' | 'Celebration' | 'VIP Lounge Party' | 'Festival Stage';
  durationHours: number;
  venueLocation: string;
  budgetOffer: string;
  notes: string;
  status: 'Pending Review' | 'Accepted' | 'Declined';
  createdAt: string;
}

// ==========================================
// THE UNFILTERED WORKPLACE DATA MODELS
// ==========================================
export type WorkplaceCategory =
  | 'Why I Left'
  | 'Interview Chronicles'
  | 'Workplace Reality Check'
  | 'General Discussion';

export interface WorkplaceComment {
  id: string;
  authorName: string;
  authorRole: string;
  avatar: string;
  isAnonymous: boolean;
  createdAt: string;
  content: string;
  likesCount: number;
  isLiked?: boolean;
  replyToAuthor?: string;
}

export interface WorkplaceAttachment {
  type: 'pdf' | 'image' | 'link';
  title: string;
  url: string;
  size?: string;
}

export interface EmployerResponse {
  employerName: string;
  employerVerified: boolean;
  responderTitle: string;
  responseDate: string;
  responseText: string;
  actionTaken?: string;
}

export interface WorkplacePost {
  id: string;
  title: string;
  content: string;
  category: WorkplaceCategory;
  companyName: string;
  companyIndustry: string;
  roleTitle: string;
  employmentStatus: 'Former Employee' | 'Current Employee' | 'Interviewee' | 'Contractor';
  tenure?: string;
  isAnonymous: boolean;
  authorName: string;
  anonymousAlias: string;
  department: string;
  avatar: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  pinned?: boolean;
  commentsCount: number;
  comments: WorkplaceComment[];
  rating?: {
    culture: number;
    management: number;
    workLife: number;
    compensation: number;
  };
  metrics?: {
    severanceOffered?: string;
    interviewRounds?: number;
    ghostedAfterFinal?: boolean;
    salaryRange?: string;
    noticeGiven?: string;
  };
  attachments?: WorkplaceAttachment[];
  employerResponse?: EmployerResponse;
  reported?: boolean;
  moderationStatus?: 'approved' | 'flagged' | 'under_review';
}

