import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Send, ArrowLeft, User, Sparkles, CheckCheck } from 'lucide-react';
import { Avatar } from '../components/common/Avatar';

export const MessagesScreen: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    currentUser,
    openProfile,
  } = useApp();

  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    sendMessage(activeConversationId, inputText);
    setInputText('');
  };

  const quickPrompts = [
    'Would love to learn more about your craft.',
    'Are you open to a brief visit or chat?',
    'Loved your recent story in The Lounge!',
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-6 h-[calc(100dvh-11rem)] md:h-[calc(100dvh-7.5rem)] min-h-[460px] flex flex-col">
      
      {/* Title */}
      <div className="mb-2 sm:mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#F47736]" />
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#211F1D] dark:text-[#F7F4EF]">
            Messages & Connections
          </h1>
        </div>
        <p className="text-xs text-[#7D756C] dark:text-[#B3ABA0]">
          Direct conversations with peers, mentors, and collaborators.
        </p>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 bg-white dark:bg-[#25221F] border border-[#E9E2D9] dark:border-[#38332F] rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden flex min-h-0">
        
        {/* Left Side: Conversation List (Hidden on mobile if a conversation is open) */}
        <div
          className={`w-full md:w-80 border-r border-[#E9E2D9] dark:border-[#332F2B] flex flex-col ${
            activeConv ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-3.5 border-b border-[#E9E2D9] dark:border-[#332F2B] bg-[#F7F4EF]/50 dark:bg-[#1E1C1A]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D756C] dark:text-[#9E958B]">
              Inbox ({conversations.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#E9E2D9]/60 dark:divide-[#332F2B]">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConversationId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`w-full p-3.5 sm:p-4 text-left transition-colors flex items-start gap-3 min-h-[64px] ${
                    isSelected
                      ? 'bg-[#F47736]/10 dark:bg-[#F47736]/15'
                      : 'hover:bg-[#F7F4EF]/60 dark:hover:bg-[#2C2926]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar
                      src={conv.participant.avatar}
                      name={conv.participant.name}
                      className="w-11 h-11 rounded-xl"
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs">
                      {conv.participant.countryFlag}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-heading font-bold text-xs sm:text-sm text-[#211F1D] dark:text-[#F7F4EF] truncate">
                        {conv.participant.name}
                      </span>
                      <span className="text-[10px] text-[#7D756C] dark:text-[#9E958B] shrink-0 font-mono">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#78917C] dark:text-[#95AF99] truncate">
                      {conv.participant.verifiedCraft || conv.participant.role}
                    </p>

                    <p className="text-xs text-[#5B554E] dark:text-[#B3ABA0] truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Chat Thread */}
        <div
          className={`flex-1 flex flex-col min-w-0 ${
            !activeConv ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConv ? (
            <>
              {/* Active Header */}
              <div className="p-3.5 sm:p-4 border-b border-[#E9E2D9] dark:border-[#332F2B] bg-[#F7F4EF]/40 dark:bg-[#1E1C1A] flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <button
                    onClick={() => setActiveConversationId(null)}
                    className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#7D756C] hover:text-[#211F1D] dark:hover:text-white"
                    aria-label="Back to conversations list"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => openProfile(activeConv.participant)}
                    className="flex items-center gap-2.5 text-left group focus:outline-none min-w-0"
                  >
                    <Avatar
                      src={activeConv.participant.avatar}
                      name={activeConv.participant.name}
                      className="w-9 h-9 rounded-xl shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading font-bold text-sm text-[#211F1D] dark:text-[#F7F4EF] group-hover:text-[#F47736] transition-colors truncate">
                          {activeConv.participant.name}
                        </span>
                        <span className="text-xs shrink-0">{activeConv.participant.countryFlag}</span>
                      </div>
                      <span className="text-[11px] text-[#78917C] dark:text-[#95AF99] block truncate">
                        {activeConv.participant.location} · {activeConv.participant.headline}
                      </span>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => openProfile(activeConv.participant)}
                  className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#F47736] hover:underline shrink-0 min-h-[44px] px-2"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>View Bio</span>
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-3 bg-[#F7F4EF]/20 dark:bg-[#1A1817]">
                
                {/* Belonging Icebreaker Reminder */}
                <div className="text-center py-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#E9E2D9]/70 dark:bg-[#2C2926] text-[#7D756C] dark:text-[#B3ABA0]">
                    <Sparkles className="w-3 h-3 text-[#F47736]" />
                    <span>Safe human connection. No spam or commercial pressure.</span>
                  </span>
                </div>

                {activeConv.messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-[#F47736] text-white rounded-br-none shadow-sm'
                            : 'bg-white dark:bg-[#2C2926] text-[#211F1D] dark:text-[#F7F4EF] border border-[#E9E2D9] dark:border-[#38332F] rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-[#7D756C] dark:text-[#9E958B] px-1 font-mono">
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-[#78917C]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Prompt Pill Scroller */}
              <div className="px-3 sm:px-4 py-2 bg-white dark:bg-[#25221F] border-t border-[#E9E2D9]/60 dark:border-[#332F2B] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[10px] uppercase font-bold text-[#7D756C] shrink-0">
                  Quick:
                </span>
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInputText(prompt)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F7F4EF] dark:bg-[#1E1C1A] border border-[#E9E2D9] dark:border-[#38332F] text-[#5B554E] dark:text-[#B3ABA0] hover:text-[#F47736] whitespace-nowrap shrink-0 transition-colors min-h-[32px] flex items-center"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={handleSend}
                className="p-3 sm:p-4 border-t border-[#E9E2D9] dark:border-[#332F2B] bg-white dark:bg-[#25221F] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeConv.participant.name}...`}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F7F4EF] dark:bg-[#1A1817] border border-[#E9E2D9] dark:border-[#38332F] text-[#211F1D] dark:text-white placeholder-[#9E958B] focus:outline-none focus:border-[#F47736] min-h-[44px]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-[#F47736] hover:bg-[#E06524] disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all shadow-sm shrink-0 flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#7D756C] dark:text-[#9E958B]">
              <div className="w-12 h-12 rounded-2xl bg-[#F47736]/10 text-[#F47736] flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#211F1D] dark:text-[#F7F4EF]">
                Select a conversation
              </h3>
              <p className="text-xs max-w-xs mt-1">
                Choose a fellow maker or trade peer from the left, or visit Discover to initiate a new connection.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
