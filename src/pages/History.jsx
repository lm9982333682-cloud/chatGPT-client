import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  MessagesSquare,
  Brain,
  Database,
  LockKeyhole,
  Download,
  FileDown,
  ChevronDown,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import HistoryCard from "../components/history/HistoryCard";
import {
  getAllChats,
  deleteChat,
  toggleStarChat,
} from "../services/chatService.js";

const filters = ["All", "Code & Dev", "Research & Notes", "Starred"];

const groupChatByDate = (dateValue) => {
  const date = new Date(dateValue);
  const now = new Date();

  if (Number.isNaN(date.getTime())) {
    return "Older";
  }

  const startOfDay = (value) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate());

  const today = startOfDay(now);
  const chatDate = startOfDay(date);

  const daysAgo = Math.floor(
    (today.getTime() - chatDate.getTime()) / 86400000
  );

  if (daysAgo <= 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return "Previous 7 Days";

  return "Older";
};

const formatChat = (chat) => {
  return {
    id: chat._id,
    title: chat.title || "New Chat",
    tags: [],
    messages: chat.messageCount ?? chat.messages?.length ?? 0,
    time: new Date(
      chat.updatedAt || chat.createdAt
    ).toLocaleString(),
    model: "Nova AI",

    // Star status MongoDB se aayega.
    starred: Boolean(chat.isStarred),

    group: groupChatByDate(chat.updatedAt || chat.createdAt),

    // Backend lastMessage object ya string dono support karo.
    lastMessage:
      chat.messages?.at(-1)?.content ||
      (typeof chat.lastMessage === "string"
        ? chat.lastMessage
        : chat.lastMessage?.content || ""),
  };
};

export default function History() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [chatToDelete, setChatToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);

  const [starUpdatingIds, setStarUpdatingIds] = useState([]);

  const navigate = useNavigate();

  // Load chat history from backend.
  useEffect(() => {
    let cancelled = false;

    const loadChats = async () => {
      try {
        setLoading(true);
        setError("");

        const chats = await getAllChats();

        if (cancelled) return;

        setConversations(chats.map(formatChat));
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            "Chat history load nahi ho payi. Dobara try karo."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadChats();

    return () => {
      cancelled = true;
    };
  }, []);

  // Search and filter conversations.
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const searchableText = [
        conversation.title,
        conversation.tags.join(" "),
        conversation.lastMessage,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = searchableText.includes(normalizedQuery);
      const tags = conversation.tags.map((tag) => tag.toLowerCase());

      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Starred"
            ? conversation.starred
            : filter === "Code & Dev"
              ? tags.some((tag) =>
                [
                  "rust",
                  "compiler",
                  "backend",
                  "python",
                  "vite",
                  "javascript",
                  "react",
                  "node",
                ].includes(tag)
              )
              : filter === "Research & Notes"
                ? tags.some((tag) =>
                  ["ai", "benchmark", "search", "research"].includes(tag)
                )
                : true;

      return matchesQuery && matchesFilter;
    });
  }, [conversations, query, filter]);

  const groupedConversations = [
    "Today",
    "Yesterday",
    "Previous 7 Days",
    "Older",
  ];

  const totalMessages = conversations.reduce(
    (total, conversation) => total + conversation.messages,
    0
  );

  const stats = [
    {
      title: "Total Sessions",
      value: conversations.length.toLocaleString(),
      icon: MessagesSquare,
      detail: "Saved conversations in your account",
      positive: true,
    },
    {
      title: "Total Messages",
      value: totalMessages.toLocaleString(),
      unit: "messages",
      icon: Brain,
      detail: "Messages across your saved conversations",
    },
    {
      title: "Storage Usage",
      value: "—",
      unit: "",
      icon: Database,
      detail: "Database storage usage is not available",
      storage: true,
    },
  ];

  const counts = {
    All: conversations.length,

    "Code & Dev": conversations.filter((conversation) =>
      conversation.tags.some((tag) =>
        [
          "rust",
          "compiler",
          "backend",
          "python",
          "vite",
          "javascript",
          "react",
          "node",
        ].includes(tag.toLowerCase())
      )
    ).length,

    "Research & Notes": conversations.filter((conversation) =>
      conversation.tags.some((tag) =>
        ["ai", "benchmark", "search", "research"].includes(
          tag.toLowerCase()
        )
      )
    ).length,

    Starred: conversations.filter(
      (conversation) => conversation.starred
    ).length,
  };

  // Export conversation metadata as JSON.
  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify(conversations, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nova-chat-history.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  // Open an existing conversation.
  const openChat = (chatId) => {
    sessionStorage.setItem("novaChatId", chatId);
    sessionStorage.removeItem("novaPrompt");

    navigate("/chat");
  };

  // Toggle Star / Unstar and persist the change in MongoDB.
  const handleToggleStar = async (chatId) => {
    if (starUpdatingIds.includes(chatId)) return;

    setStarUpdatingIds((current) => [...current, chatId]);
    setError("");

    try {
      const updatedChat = await toggleStarChat(chatId);

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === chatId
            ? {
              ...conversation,
              starred: Boolean(updatedChat.isStarred),
            }
            : conversation
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Favourite status update nahi hua. Dobara try karo."
      );
    } finally {
      setStarUpdatingIds((current) =>
        current.filter((id) => id !== chatId)
      );
    }
  };

  // Delete one conversation.
  const handleDeleteChat = async () => {
    if (!chatToDelete || deleting) return;

    try {
      setDeleting(true);
      setError("");

      await deleteChat(chatToDelete.id);

      setConversations((current) =>
        current.filter((chat) => chat.id !== chatToDelete.id)
      );

      if (sessionStorage.getItem("novaChatId") === chatToDelete.id) {
        sessionStorage.removeItem("novaChatId");
      }

      setChatToDelete(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Chat delete nahi hui. Dobara try karo."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Delete all conversations.
  const handleClearAll = async () => {
    if (clearingAll || conversations.length === 0) return;

    try {
      setClearingAll(true);
      setError("");

      for (const conversation of conversations) {
        await deleteChat(conversation.id);
      }

      setConversations([]);
      sessionStorage.removeItem("novaChatId");
      setShowClearConfirm(false);
    } catch (err) {
      // Reload the server list if only some deletions succeeded.
      try {
        const chats = await getAllChats();
        setConversations(chats.map(formatChat));
      } catch {
        // Show the original error below.
      }

      setError(
        err.response?.data?.message ||
        "Kuch chats delete nahi hui. Dobara try karo."
      );
    } finally {
      setClearingAll(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 text-[#f5f2ff] sm:px-6 sm:py-8 lg:px-8">
      {/* Page Header */}
      <header className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 text-[10px] font-bold tracking-[1.8px] text-[#bba0ff] sm:text-xs">
            VAULT <span className="mx-1 text-[#625b73]">·</span> CHAT
            STORAGE
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Chat History
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9293a2] sm:text-base">
            Search, manage, and export your previous conversation sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            disabled={conversations.length === 0 || clearingAll}
            className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-400/50 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 size={15} />
            Clear all
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#9b7bea] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-950/20 transition hover:bg-[#ad91f5]"
          >
            <Plus size={17} />
            New Chat
          </button>
        </div>
      </header>

      {/* Statistics */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#302d3b] bg-[#1b1925] p-5 transition hover:border-[#514568] sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-[#aaa6b8]">{stat.title}</span>

                <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#574574]/50 bg-[#30263f] text-[#c6acff]">
                  <Icon size={18} />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <strong className="text-3xl font-semibold tracking-tight text-[#f5f2ff]">
                  {stat.value}
                </strong>

                {stat.unit && (
                  <span className="text-sm text-[#9293a2]">{stat.unit}</span>
                )}
              </div>

              {stat.positive ? (
                <p className="mt-3 text-xs text-emerald-400 sm:text-sm">
                  {stat.detail}
                </p>
              ) : stat.storage ? (
                <>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-[#9293a2] sm:text-sm">
                    <LockKeyhole size={13} />
                    {stat.detail}
                  </p>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#34303f]">
                    <div className="h-full w-0 rounded-full bg-gradient-to-r from-[#9270d7] to-[#c0a5ff]" />
                  </div>
                </>
              ) : (
                <p className="mt-3 text-xs text-[#9293a2] sm:text-sm">
                  {stat.detail}
                </p>
              )}
            </div>
          );
        })}
      </section>

      {/* Search and Filter */}
      <section className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#373342] bg-[#1b1925] px-4 py-3 transition focus-within:border-[#9b7bea]">
          <Search size={18} className="shrink-0 text-[#9293a2]" />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations..."
            className="min-w-0 flex-1 bg-transparent text-sm text-[#f5f2ff] outline-none placeholder:text-[#777386]"
          />

          <kbd className="hidden rounded-md border border-[#403b4d] bg-[#24212f] px-2 py-1 text-[10px] text-[#9293a2] sm:inline-block">
            Ctrl F
          </kbd>
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            aria-expanded={showFilters}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#373342] bg-[#1b1925] px-4 py-3 text-sm text-[#c9c5d5] transition hover:border-[#66518a] sm:w-auto"
          >
            <Filter size={15} />
            Filter
            <ChevronDown
              size={15}
              className={`transition-transform ${showFilters ? "rotate-180" : ""
                }`}
            />
          </button>

          {showFilters && (
            <div className="absolute right-0 z-20 mt-2 w-full min-w-52 rounded-xl border border-[#373342] bg-[#201e2b] p-2 shadow-xl sm:w-56">
              {filters.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    setFilter(item);
                    setShowFilters(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${filter === item
                      ? "bg-[#352a48] text-[#c6acff]"
                      : "text-[#c9c5d5] hover:bg-[#2b2737]"
                    }`}
                >
                  {item}
                  {filter === item && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category Tabs */}
      <nav className="mb-7 flex gap-2 overflow-x-auto border-b border-[#302d3b] pb-3">
        {filters.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setFilter(item)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${filter === item
                ? "border border-[#6b528e]/50 bg-[#30263f] text-[#d2bcff]"
                : "border border-transparent text-[#9293a2] hover:bg-[#24212f] hover:text-[#e5dfff]"
              }`}
          >
            {item}

            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] ${filter === item
                  ? "bg-[#51406b] text-[#e0d0ff]"
                  : "bg-[#292633] text-[#9293a2]"
                }`}
            >
              {counts[item]}
            </span>
          </button>
        ))}
      </nav>

      {/* Conversation Results */}
      <div className="space-y-8">
        {loading && (
          <p className="py-8 text-center text-sm text-[#aaa6b8]">
            Chat history load ho rahi hai...
          </p>
        )}

        {!loading && error && (
          <div
            className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5 text-center"
            role="alert"
          >
            <p className="text-sm text-red-300">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg px-3 py-2 text-sm text-[#c6acff] hover:bg-[#30263f]"
            >
              Try again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          groupedConversations.map((group) => {
            const items = filtered.filter(
              (conversation) => conversation.group === group
            );

            if (!items.length) return null;

            return (
              <section key={group}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-[#e0dbea] sm:text-base">
                    {group}
                  </h2>

                  <span className="text-xs text-[#777386]">
                    {items.length} sessions
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <HistoryCard
                      key={item.id}
                      item={item}
                      onOpen={() => openChat(item.id)}
                      onDelete={() => setChatToDelete(item)}
                      onDownload={exportData}
                      onToggleStar={() => handleToggleStar(item.id)}
                      starLoading={starUpdatingIds.includes(item.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#403b4d] bg-[#1b1925]/60 px-5 py-14 text-center">
            <Search size={28} className="mx-auto mb-4 text-[#777386]" />

            <h3 className="text-base font-semibold text-[#e5dfff]">
              No conversations found
            </h3>

            <p className="mt-2 text-sm text-[#9293a2]">
              {conversations.length === 0
                ? "Aapki saved chats yahan dikhengi jab aap pehli chat karenge."
                : filter === "Starred" && !query.trim()
                  ? "Abhi koi favourite chat nahi hai. History card par Star icon click karo."
                  : `No conversations match "${query}" with the selected filter.`}
            </p>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("All");
              }}
              className="mt-4 rounded-lg px-3 py-2 text-sm font-medium text-[#c6acff] hover:bg-[#30263f]"
            >
              Clear search and filters
            </button>
          </div>
        )}
      </div>

      {/* Export Section */}
      <section className="mt-10 flex flex-col gap-5 rounded-2xl border border-[#40364f] bg-gradient-to-br from-[#211c2d] to-[#191722] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[#604a7d] bg-[#352a48] text-[#c6acff]">
            <FileDown size={21} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#f5f2ff] sm:text-lg">
              Data Portability &amp; Vault Archival
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#9293a2]">
              Download your loaded conversation history into JSON format.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={exportData}
          disabled={conversations.length === 0}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#6b528e] bg-[#2b2438] px-4 py-3 text-sm font-medium text-[#d8c5ff] transition hover:bg-[#3a2d4d] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={16} />
          Export Archive (.json)
        </button>
      </section>

      {/* Clear All Confirmation */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => !clearingAll && setShowClearConfirm(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-history-title"
            className="w-full max-w-md rounded-2xl border border-[#403b4d] bg-[#201e2b] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-red-400/10 text-red-300">
              <Trash2 size={20} />
            </div>

            <h2
              id="clear-history-title"
              className="text-lg font-semibold text-[#f5f2ff]"
            >
              Clear all conversations?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#aaa6b8]">
              Ye action tumhari sabhi saved conversations permanently delete
              kar dega. Kya tum continue karna chahte ho?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={clearingAll}
                onClick={() => setShowClearConfirm(false)}
                className="rounded-xl border border-[#403b4d] px-4 py-2.5 text-sm text-[#c9c5d5] hover:bg-[#302d3b] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={clearingAll}
                onClick={handleClearAll}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {clearingAll ? "Deleting..." : "Delete All"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Chat Delete Confirmation */}
      {chatToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => !deleting && setChatToDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-chat-title"
            className="w-full max-w-md rounded-2xl border border-[#403b4d] bg-[#201e2b] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-red-400/10 text-red-300">
              <Trash2 size={20} />
            </div>

            <h2
              id="delete-chat-title"
              className="text-lg font-semibold text-[#f5f2ff]"
            >
              Delete conversation?
            </h2>

            <p className="mt-2 break-words text-sm leading-6 text-[#aaa6b8]">
              Kya tum <strong>{chatToDelete.title}</strong> delete karna
              chahte ho? Ye action permanently delete kar sakta hai.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setChatToDelete(null)}
                className="rounded-xl border border-[#403b4d] px-4 py-2.5 text-sm text-[#c9c5d5] hover:bg-[#302d3b] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteChat}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}