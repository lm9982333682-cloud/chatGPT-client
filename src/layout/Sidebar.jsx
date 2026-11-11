
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Plus,
  Search,
  MessageSquare,
  PanelLeftClose,
  X,
  MoreHorizontal,
} from "lucide-react";

import { getAllChats } from "../services/chatService";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [chatError, setChatError] = useState("");

  const linkClass = ({ isActive }) =>
    `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
      isActive
        ? "bg-[#30263f] text-[#c6acff]"
        : "text-[#9293a2] hover:bg-[#211d2c] hover:text-[#eee9f8]"
    }`;

  // Load real conversations from backend
  useEffect(() => {
    let isMounted = true;

    const loadConversations = async () => {
      try {
        setLoadingChats(true);
        setChatError("");

        const result = await getAllChats();

        if (!isMounted) return;

        const chats = Array.isArray(result)
          ? result
          : Array.isArray(result?.chats)
            ? result.chats
            : [];

        const now = new Date();

        const formattedChats = chats.map((chat) => {
          const updatedAt = chat.updatedAt
            ? new Date(chat.updatedAt)
            : chat.createdAt
              ? new Date(chat.createdAt)
              : now;

          const isToday =
            updatedAt.toDateString() === now.toDateString();

          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);

          const isYesterday =
            updatedAt.toDateString() === yesterday.toDateString();

          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 7);

          let group = "Older";

          if (isToday) {
            group = "Today";
          } else if (isYesterday) {
            group = "Yesterday";
          } else if (updatedAt >= sevenDaysAgo) {
            group = "Previous 7 Days";
          }

          return {
            id: chat._id || chat.id,
            title: chat.title || "New Chat",
            group,
          };
        });

        setConversations(formattedChats);
      } catch (error) {
        if (!isMounted) return;

        setChatError(
          error?.response?.data?.message ||
            "Conversations load nahi ho paayin."
        );
      } finally {
        if (isMounted) {
          setLoadingChats(false);
        }
      }
    };

    loadConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleNewChat = () => {
    // Remove the previously selected chat so a new chat can start.
    sessionStorage.removeItem("chatId");
    sessionStorage.removeItem("currentChatId");

    handleNavigate("/");
  };

  const handleOpenChat = (chatId) => {
    if (!chatId) return;

    // Save the selected chat ID for the chat page.
    sessionStorage.setItem("chatId", chatId);
    sessionStorage.setItem("currentChatId", chatId);

    navigate(`/chat/${chatId}`);
    onClose?.();
  };

  const groups = ["Today", "Yesterday", "Previous 7 Days", "Older"];

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[280px] shrink-0 flex-col border-r border-[#302d3b] bg-[#191720] transition-transform duration-300 ease-in-out md:relative md:z-auto md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-[#302d3b]/80 px-5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#70549c]/40 bg-gradient-to-br from-[#493363] to-[#292034] text-[#d4bfff]">
            <Sparkles size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-lg font-bold tracking-tight text-[#f0eaff]">
              Nova <span className="text-[#bba0ff]">AI</span>
            </div>

            <div className="text-[10px] font-medium tracking-wider text-[#777386]">
              v2.4.0
            </div>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-[#9293a2] transition-colors hover:bg-[#302d3b] hover:text-white md:hidden"
          >
            <X size={18} />
          </button>

          {/* Desktop Collapse - UI only */}
          <button
            type="button"
            aria-label="Collapse sidebar"
            className="hidden h-9 w-9 place-items-center rounded-lg text-[#777386] transition-colors hover:bg-[#302d3b] hover:text-white md:grid"
          >
            <PanelLeftClose size={17} />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="shrink-0 space-y-2 px-3 py-5">
          <button
            type="button"
            onClick={handleNewChat}
            className="flex w-full items-center gap-3 rounded-xl border border-[#8060b5]/30 bg-gradient-to-r from-[#48315f] to-[#30233f] px-3 py-3 text-sm font-semibold text-[#f0eaff] shadow-sm transition-all hover:border-[#a078ff]/60 hover:brightness-110"
          >
            <Plus size={17} className="shrink-0 text-[#d4bfff]" />

            <span className="flex-1 text-left">New Chat</span>

            <kbd className="rounded-md border border-white/10 bg-black/15 px-1.5 py-0.5 text-[10px] font-medium text-[#b9a9d4]">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate("/history")}
            className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm text-[#a5a0b3] transition-colors hover:border-[#302d3b] hover:bg-[#211d2c] hover:text-[#eee9f8]"
          >
            <Search size={16} className="shrink-0" />

            <span className="flex-1 text-left">
              Search conversations
            </span>

            <kbd className="rounded-md border border-[#383342] bg-[#211d2c] px-1.5 py-0.5 text-[10px] text-[#777386]">
              ⌘F
            </kbd>
          </button>
        </div>

        {/* Recent Conversations Heading */}
        <div className="mb-2 px-5 pt-1">
          <div className="text-[10px] font-bold tracking-[1.5px] text-[#777386]">
            RECENT CONVERSATIONS
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          {loadingChats ? (
            <div className="px-3 py-4 text-xs text-[#777386]">
              Loading conversations...
            </div>
          ) : chatError ? (
            <div className="px-3 py-4">
              <p className="text-xs leading-5 text-red-400">
                {chatError}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-2 text-xs text-[#c6acff] hover:text-white"
              >
                Try again
              </button>
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-3 py-4 text-xs leading-5 text-[#777386]">
              Abhi koi conversation nahi hai. New Chat par click karke
              shuru karo.
            </div>
          ) : (
            groups.map((group) => {
              const groupConversations = conversations.filter(
                (conversation) => conversation.group === group
              );

              if (groupConversations.length === 0) return null;

              return (
                <div key={group} className="mb-5">
                  <div className="mb-2 px-2 pt-2 text-[11px] font-medium text-[#777386]">
                    {group}
                  </div>

                  <div className="space-y-1">
                    {groupConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        type="button"
                        title={conversation.title}
                        onClick={() => handleOpenChat(conversation.id)}
                        className="group flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2.5 text-left text-xs text-[#a09bab] transition-colors hover:bg-[#211d2c] hover:text-[#eee9f8]"
                      >
                        <MessageSquare
                          size={14}
                          className="shrink-0 text-[#777386]"
                        />

                        <span className="min-w-0 flex-1 truncate">
                          {conversation.title}
                        </span>

                        <MoreHorizontal
                          size={15}
                          className="shrink-0 text-[#777386] opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Section */}
        <div className="shrink-0 border-t border-[#302d3b] p-3">
          {/* Upgrade Card */}
          <div className="mb-3 rounded-xl border border-[#59416f]/50 bg-gradient-to-br from-[#30243c] to-[#211d2b] p-3">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#76529a]/40 bg-[#49335d] text-[#d4bfff]">
                <Sparkles size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <strong className="block text-xs font-semibold text-[#eee5ff]">
                  Unlock Nova Pro
                </strong>

                <p className="mt-1 text-[11px] leading-5 text-[#a49aaf]">
                  More power for your ideas.
                </p>
              </div>

              <button
                type="button"
                aria-label="Upgrade"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[#bba0ff] transition-colors hover:bg-white/10 hover:text-white"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Profile */}
          <NavLink
            to="/settings"
            onClick={onClose}
            className={linkClass}
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#72558e] bg-gradient-to-br from-[#5c4277] to-[#30263f] text-xs font-bold text-[#f0e5ff]">
              AM
            </div>

            <div className="min-w-0 flex-1">
              <strong className="block truncate text-xs font-semibold text-[#e8e2f0]">
                Alex Mercer
              </strong>

              <span className="mt-1 block truncate text-[10px] text-[#858093]">
                Pro · Staff AI Architect
              </span>
            </div>

            <MoreHorizontal size={17} className="shrink-0" />
          </NavLink>
        </div>
      </aside>
    </>
  );
}