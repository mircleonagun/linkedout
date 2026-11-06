import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ScreenId,
  UserProfile,
  Post,
  Circle,
  Conversation,
  Opportunity,
  ProService,
  AfterHoursEvent,
  PostMood,
  NightlifeVenue,
  EntertainerProfile,
  BookedTicket,
  EntertainmentBookingRequest,
  AfterHoursPassState,
  WorkplacePost,
  WorkplaceComment
} from '../types';
import {
  CURRENT_USER,
  SAMPLE_USERS,
  INITIAL_POSTS,
  INITIAL_CIRCLES,
  INITIAL_CONVERSATIONS,
  INITIAL_OPPORTUNITIES,
  INITIAL_PRO_SERVICES,
  INITIAL_AFTER_HOURS_EVENTS,
  INITIAL_NIGHTLIFE_VENUES,
  INITIAL_ENTERTAINERS,
  INITIAL_BOOKED_TICKETS,
  INITIAL_WORKPLACE_POSTS
} from '../data/sampleData';

interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'warm';
}

interface AppContextType {
  // Navigation & Theme
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  previousScreen: ScreenId | null;
  navigateBack: () => void;
  getPreviousScreenLabel: () => string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // User state
  currentUser: UserProfile;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  logoutUser: () => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  switchUser: (userId: string) => void;
  loginUser: (userData: Partial<UserProfile>) => void;
  allUsers: UserProfile[];
  selectedProfile: UserProfile | null;
  openProfile: (user: UserProfile) => void;
  closeProfile: () => void;
  toggleFollowUser: (userId: string) => void;
  
  // Posts & Interactions
  posts: Post[];
  toggleCheerPost: (postId: string) => void;
  toggleResonatePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  createPost: (content: string, mood: PostMood, tags: string[], image?: string) => void;
  isCreatePostOpen: boolean;
  setCreatePostOpen: (open: boolean) => void;
  
  // Circles
  circles: Circle[];
  selectedCircle: Circle | null;
  openCircle: (circle: Circle) => void;
  closeCircle: () => void;
  toggleJoinCircle: (circleId: string) => void;
  
  // Messages
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string) => void;
  startConversationWithUser: (user: UserProfile) => void;
  
  // Open Doors (Opportunities)
  opportunities: Opportunity[];
  toggleApplyOpportunity: (opportunityId: string) => void;
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'applicantCount' | 'publishedAt' | 'hasApplied' | 'creator'>) => void;
  
  // Find a Pro
  proServices: ProService[];
  contactPro: (proId: string, message: string) => void;
  
  // After Hours Events & Nightlife
  events: AfterHoursEvent[];
  venues: NightlifeVenue[];
  entertainers: EntertainerProfile[];
  bookedTickets: BookedTicket[];
  savedEventIds: string[];
  bookingRequests: EntertainmentBookingRequest[];
  afterHoursPass: AfterHoursPassState;
  unlockAfterHoursPass: (tier: '50_naira' | 'black_vip') => void;
  toggleRsvpEvent: (eventId: string) => void;
  toggleSaveEvent: (eventId: string) => void;
  toggleSaveVenue: (venueId: string) => void;
  bookEventTicket: (ticket: BookedTicket) => void;
  submitBookingRequest: (req: Omit<EntertainmentBookingRequest, 'id' | 'createdAt' | 'status'>) => void;
  addEvent: (event: Omit<AfterHoursEvent, 'id' | 'attendeesCount' | 'hasRsvpd' | 'host'>) => void;
  // The Unfiltered Workplace
  workplacePosts: WorkplacePost[];
  toggleLikeWorkplacePost: (postId: string) => void;
  addWorkplaceComment: (postId: string, content: string, isAnonymous: boolean, replyToAuthor?: string) => void;
  toggleLikeWorkplaceComment: (postId: string, commentId: string) => void;
  createWorkplacePost: (postData: Omit<WorkplacePost, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'comments'>) => void;
  reportWorkplacePost: (postId: string, reason: string, details: string) => void;
  submitEmployerResponse: (postId: string, resp: { responderTitle: string; responseText: string; actionTaken?: string }) => void;

  // Circles creation
  proposeCircle: (circle: Omit<Circle, 'id' | 'membersCount' | 'isJoined'>) => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'warm') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentScreen, setCurrentScreenState] = useState<ScreenId>('welcome');
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>([]);

  const setCurrentScreen = (screen: ScreenId) => {
    if (screen !== currentScreen) {
      setScreenHistory((prev) => [...prev, currentScreen]);
      setCurrentScreenState(screen);
    }
  };

  const previousScreen = screenHistory.length > 0 ? screenHistory[screenHistory.length - 1] : null;

  const navigateBack = () => {
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1];
      setScreenHistory((prevHistory) => prevHistory.slice(0, -1));
      setCurrentScreenState(prev);
    } else {
      setCurrentScreenState('home');
    }
  };

  const getPreviousScreenLabel = () => {
    const screenNames: Record<ScreenId, string> = {
      home: 'The Lounge',
      discover: 'Discover',
      circles: 'Circles',
      messages: 'Messages',
      profile: 'Profile',
      opendoors: 'Open Doors',
      findapro: 'Find a Pro',
      afterhours: 'After Hours',
      settings: 'Settings',
      welcome: 'Log In / Register',
      onboarding: 'Onboarding',
      unfiltered: 'Unfiltered Workplace',
    };
    return previousScreen ? screenNames[previousScreen] || 'Previous Page' : 'The Lounge';
  };
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('linkedout_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(SAMPLE_USERS);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);

  const [circles, setCircles] = useState<Circle[]>(INITIAL_CIRCLES);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [proServices] = useState<ProService[]>(INITIAL_PRO_SERVICES);
  const [events, setEvents] = useState<AfterHoursEvent[]>(INITIAL_AFTER_HOURS_EVENTS);
  const [venues, setVenues] = useState<NightlifeVenue[]>(INITIAL_NIGHTLIFE_VENUES);
  const [entertainers, setEntertainers] = useState<EntertainerProfile[]>(INITIAL_ENTERTAINERS);
  const [bookedTickets, setBookedTickets] = useState<BookedTicket[]>(INITIAL_BOOKED_TICKETS);
  const [savedEventIds, setSavedEventIds] = useState<string[]>(['event_marquee', 'event_underground_jazz']);
  const [bookingRequests, setBookingRequests] = useState<EntertainmentBookingRequest[]>([]);
  const [afterHoursPass, setAfterHoursPass] = useState<AfterHoursPassState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('linkedout_after_hours_pass');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return { isUnlocked: false };
  });

  const unlockAfterHoursPass = (tier: '50_naira' | 'black_vip') => {
    const code = `AFT-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newState: AfterHoursPassState = {
      isUnlocked: true,
      unlockedTier: tier,
      tier: tier,
      unlockedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      passCode: code,
      memberCode: code,
    };
    setAfterHoursPass(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('linkedout_after_hours_pass', JSON.stringify(newState));
    }
    showToast('VIP After Hours Pass Unlocked! Secret locations and passcodes revealed.', 'success');
  };

  const toggleSaveEvent = (eventId: string) => {
    setSavedEventIds((prev) => {
      const isSaved = prev.includes(eventId);
      const next = isSaved ? prev.filter((id) => id !== eventId) : [...prev, eventId];
      showToast(isSaved ? 'Removed from saved plans' : 'Saved to your nightlife plans!', isSaved ? 'info' : 'warm');
      return next;
    });
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, isSaved: !e.isSaved } : e))
    );
  };

  const toggleSaveVenue = (venueId: string) => {
    setVenues((prev) =>
      prev.map((v) => {
        if (v.id === venueId) {
          const nextSaved = !v.isSaved;
          showToast(nextSaved ? `Saved ${v.name} to favorite clubs` : `Removed ${v.name}`, nextSaved ? 'warm' : 'info');
          return { ...v, isSaved: nextSaved };
        }
        return v;
      })
    );
  };

  const bookEventTicket = (ticket: BookedTicket) => {
    setBookedTickets((prev) => [ticket, ...prev]);
    setEvents((prev) =>
      prev.map((e) => (e.id === ticket.eventId ? { ...e, hasTicket: true, attendeesCount: e.attendeesCount + ticket.quantity } : e))
    );
    showToast(`Tickets booked! Pass confirmed for ${ticket.eventTitle}`, 'success');
  };

  const submitBookingRequest = (req: Omit<EntertainmentBookingRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: EntertainmentBookingRequest = {
      ...req,
      id: 'req_' + Date.now(),
      status: 'Pending Review',
      createdAt: 'Just now',
    };
    setBookingRequests((prev) => [newReq, ...prev]);
    showToast(`Booking request sent to ${req.entertainerName}!`, 'success');
  };

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('linkedout_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Warm Dark' : 'Warm Ivory'} theme`, 'warm');
  };

  const showToast = (text: string, type: 'success' | 'info' | 'warm' = 'warm') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev.slice(-2), { id, text, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
    showToast('Profile updated', 'success');
  };

  const switchUser = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId) || (userId === CURRENT_USER.id ? CURRENT_USER : null);
    if (target) {
      setCurrentUser(target);
      setIsAuthenticated(true);
      showToast(`Signed in as ${target.name}`, 'warm');
    }
  };

  const loginUser = (userData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      ...currentUser,
      ...userData,
      id: userData.id || 'usr_' + Date.now(),
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    showToast(`Welcome, ${newUser.name.split(' ')[0]}!`, 'success');
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setCurrentScreenState('welcome');
    showToast('Signed out of LinkedOut. See you soon in The Lounge!', 'info');
  };

  const openProfile = (user: UserProfile) => {
    setSelectedProfile(user);
  };

  const closeProfile = () => {
    setSelectedProfile(null);
  };

  const toggleFollowUser = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          const nextFollowing = !user.isFollowing;
          showToast(
            nextFollowing ? `Connected with ${user.name}` : `Unfollowed ${user.name}`,
            nextFollowing ? 'warm' : 'info'
          );
          return {
            ...user,
            isFollowing: nextFollowing,
            followersCount: nextFollowing ? user.followersCount + 1 : user.followersCount - 1,
          };
        }
        return user;
      })
    );

    if (selectedProfile && selectedProfile.id === userId) {
      setSelectedProfile((prev) => {
        if (!prev) return null;
        const nextFollowing = !prev.isFollowing;
        return {
          ...prev,
          isFollowing: nextFollowing,
          followersCount: nextFollowing ? prev.followersCount + 1 : prev.followersCount - 1,
        };
      });
    }
  };

  const toggleCheerPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const nextCheered = !post.isCheered;
          return {
            ...post,
            isCheered: nextCheered,
            cheersCount: nextCheered ? post.cheersCount + 1 : post.cheersCount - 1,
          };
        }
        return post;
      })
    );
  };

  const toggleResonatePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const nextResonated = !post.isResonated;
          showToast(nextResonated ? 'Resonated to your network' : 'Removed resonance', 'warm');
          return {
            ...post,
            isResonated: nextResonated,
            resonatesCount: nextResonated ? post.resonatesCount + 1 : post.resonatesCount - 1,
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: 'c_' + Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorHandle: currentUser.handle,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      content: text.trim(),
      createdAt: 'Just now',
      cheersCount: 0,
      isCheered: false,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
    showToast('Comment added', 'success');
  };

  const createPost = (content: string, mood: PostMood, tags: string[], image?: string) => {
    const newPost: Post = {
      id: 'post_' + Date.now(),
      author: currentUser,
      content,
      mood,
      tags,
      image,
      createdAt: 'Just now',
      cheersCount: 0,
      resonatesCount: 0,
      comments: [],
      isCheered: false,
      isResonated: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setCreatePostOpen(false);
    showToast('Your story has been shared to The Lounge', 'warm');
  };

  const openCircle = (circle: Circle) => {
    setSelectedCircle(circle);
  };

  const closeCircle = () => {
    setSelectedCircle(null);
  };

  const toggleJoinCircle = (circleId: string) => {
    setCircles((prev) =>
      prev.map((circle) => {
        if (circle.id === circleId) {
          const nextJoined = !circle.isJoined;
          showToast(
            nextJoined ? `Welcome to ${circle.name}!` : `Left ${circle.name}`,
            nextJoined ? 'warm' : 'info'
          );
          return {
            ...circle,
            isJoined: nextJoined,
            membersCount: nextJoined ? circle.membersCount + 1 : circle.membersCount - 1,
          };
        }
        return circle;
      })
    );

    if (selectedCircle && selectedCircle.id === circleId) {
      setSelectedCircle((prev) => {
        if (!prev) return null;
        const nextJoined = !prev.isJoined;
        return {
          ...prev,
          isJoined: nextJoined,
          membersCount: nextJoined ? prev.membersCount + 1 : prev.membersCount - 1,
        };
      });
    }
  };

  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      id: 'm_' + Date.now(),
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: 'Just now',
      isRead: true,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: text.trim(),
            lastMessageTime: 'Just now',
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );
  };

  const startConversationWithUser = (user: UserProfile) => {
    const existing = conversations.find((c) => c.participant.id === user.id);
    if (existing) {
      setActiveConversationId(existing.id);
    } else {
      const newConv: Conversation = {
        id: 'conv_' + Date.now(),
        participant: user,
        lastMessage: 'Started conversation',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    }
    setCurrentScreen('messages');
    closeProfile();
  };

  const toggleApplyOpportunity = (opportunityId: string) => {
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === opportunityId) {
          const nextApplied = !opp.hasApplied;
          showToast(
            nextApplied ? 'Knocked on this door! Creator notified.' : 'Application withdrawn.',
            nextApplied ? 'success' : 'info'
          );
          return {
            ...opp,
            hasApplied: nextApplied,
            applicantCount: nextApplied ? opp.applicantCount + 1 : opp.applicantCount - 1,
          };
        }
        return opp;
      })
    );
  };

  const contactPro = (proId: string, message: string) => {
    const pro = proServices.find((p) => p.id === proId);
    if (pro) {
      startConversationWithUser(pro.pro);
      if (message) {
        setTimeout(() => {
          const existingConv = conversations.find((c) => c.participant.id === pro.pro.id);
          if (existingConv) {
            sendMessage(existingConv.id, `Inquiry regarding ${pro.serviceTitle}: ${message}`);
          }
        }, 100);
      }
      showToast(`Inquiry sent to ${pro.pro.name}`, 'success');
    }
  };

  const toggleRsvpEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const nextRsvpd = !ev.hasRsvpd;
          showToast(
            nextRsvpd ? `RSVP confirmed for "${ev.title}"` : 'RSVP cancelled',
            nextRsvpd ? 'warm' : 'info'
          );
          return {
            ...ev,
            hasRsvpd: nextRsvpd,
            attendeesCount: nextRsvpd ? ev.attendeesCount + 1 : ev.attendeesCount - 1,
          };
        }
        return ev;
      })
    );
  };

  const addOpportunity = (opp: Omit<Opportunity, 'id' | 'applicantCount' | 'publishedAt' | 'hasApplied' | 'creator'>) => {
    const newOpp: Opportunity = {
      ...opp,
      id: 'opp_' + Date.now(),
      applicantCount: 0,
      publishedAt: 'Just now',
      hasApplied: false,
      creator: currentUser,
    };
    setOpportunities((prev) => [newOpp, ...prev]);
    showToast('Open Door posted to community board!', 'warm');
  };

  const addEvent = (event: Omit<AfterHoursEvent, 'id' | 'attendeesCount' | 'hasRsvpd' | 'host'>) => {
    const newEvent: AfterHoursEvent = {
      ...event,
      id: 'ev_' + Date.now(),
      attendeesCount: 1,
      hasRsvpd: true,
      host: currentUser,
    };
    setEvents((prev) => [newEvent, ...prev]);
    showToast('After Hours Gathering created!', 'warm');
  };

  const proposeCircle = (circle: Omit<Circle, 'id' | 'membersCount' | 'isJoined'>) => {
    const newCircle: Circle = {
      ...circle,
      id: 'circle_' + Date.now(),
      membersCount: 1,
      isJoined: true,
    };
    setCircles((prev) => [newCircle, ...prev]);
    showToast(`Circle "${circle.name}" proposed and founded!`, 'warm');
  };

  // The Unfiltered Workplace State & Handlers
  const [workplacePosts, setWorkplacePosts] = useState<WorkplacePost[]>(INITIAL_WORKPLACE_POSTS);

  const toggleLikeWorkplacePost = (postId: string) => {
    setWorkplacePosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );
  };

  const addWorkplaceComment = (postId: string, content: string, isAnonymous: boolean, replyToAuthor?: string) => {
    if (!content.trim()) return;

    const newComment: WorkplaceComment = {
      id: 'wp_c_' + Date.now(),
      authorName: isAnonymous ? 'Anonymous Peer' : currentUser.name,
      authorRole: isAnonymous ? 'Verified Community Contributor' : currentUser.role,
      avatar: isAnonymous
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
        : currentUser.avatar,
      isAnonymous,
      createdAt: 'Just now',
      content: content.trim(),
      likesCount: 1,
      isLiked: true,
      replyToAuthor,
    };

    setWorkplacePosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );

    showToast('Your perspective was shared with the community.', 'success');
  };

  const toggleLikeWorkplaceComment = (postId: string, commentId: string) => {
    setWorkplacePosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === commentId) {
                const isLiked = !comment.isLiked;
                return {
                  ...comment,
                  isLiked,
                  likesCount: isLiked ? comment.likesCount + 1 : Math.max(0, comment.likesCount - 1),
                };
              }
              return comment;
            }),
          };
        }
        return post;
      })
    );
  };

  const createWorkplacePost = (
    postData: Omit<WorkplacePost, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'comments'>
  ) => {
    const newPost: WorkplacePost = {
      ...postData,
      id: 'wp_post_' + Date.now(),
      createdAt: 'Just now',
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      comments: [],
    };

    setWorkplacePosts((prev) => [newPost, ...prev]);
    showToast('Post published to The Unfiltered Workplace!', 'success');
  };

  const reportWorkplacePost = (postId: string, reason: string, details: string) => {
    setWorkplacePosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            reported: true,
            moderationStatus: 'under_review',
          };
        }
        return post;
      })
    );
    showToast('Report submitted to community moderation committee for review.', 'warm');
  };

  const submitEmployerResponse = (
    postId: string,
    resp: { responderTitle: string; responseText: string; actionTaken?: string }
  ) => {
    setWorkplacePosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            employerResponse: {
              employerName: post.companyName,
              employerVerified: true,
              responderTitle: resp.responderTitle,
              responseDate: 'Just now',
              responseText: resp.responseText,
              actionTaken: resp.actionTaken,
            },
          };
        }
        return post;
      })
    );
    showToast('Employer official statement recorded and displayed.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        previousScreen,
        navigateBack,
        getPreviousScreenLabel,
        theme,
        toggleTheme,
        currentUser,
        isAuthenticated,
        setIsAuthenticated,
        logoutUser,
        updateCurrentUser,
        switchUser,
        loginUser,
        allUsers,
        selectedProfile,
        openProfile,
        closeProfile,
        toggleFollowUser,
        posts,
        toggleCheerPost,
        toggleResonatePost,
        addComment,
        createPost,
        isCreatePostOpen,
        setCreatePostOpen,
        circles,
        selectedCircle,
        openCircle,
        closeCircle,
        toggleJoinCircle,
        proposeCircle,
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startConversationWithUser,
        opportunities,
        toggleApplyOpportunity,
        addOpportunity,
        proServices,
        contactPro,
        events,
        venues,
        entertainers,
        bookedTickets,
        savedEventIds,
        bookingRequests,
        afterHoursPass,
        unlockAfterHoursPass,
        toggleRsvpEvent,
        toggleSaveEvent,
        toggleSaveVenue,
        bookEventTicket,
        submitBookingRequest,
        addEvent,
        workplacePosts,
        toggleLikeWorkplacePost,
        addWorkplaceComment,
        toggleLikeWorkplaceComment,
        createWorkplacePost,
        reportWorkplacePost,
        submitEmployerResponse,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
