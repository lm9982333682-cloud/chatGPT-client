
import { useState } from "react";
import {
  Menu,
  Share2,
  Trash2,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

export default function Topbar({ onMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const pathname = location.pathname;

  const title = pathname.startsWith("/settings")
    ? "Settings & Preferences"
    : pathname.startsWith("/history")
      ? "Chat History"
      : pathname.startsWith("/chat")
        ? "Nova AI Chat"
        : "New Chat";

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleNewChat = () => {
    sessionStorage.removeItem("novaPrompt");
    sessionStorage.removeItem("novaChatId");
    sessionStorage.removeItem("currentChatId");
    sessionStorage.removeItem("chatId");

    navigate("/");
  };

  return (
    <header className="z-30 flex  w-full shrink-0 items-center justify-between gap-3 border-b border-[#302d3b] bg-[#191720]/95 px-3 backdrop-blur-xl sm:h-[72px] sm:px-5 lg:px-7">
      {/* Left Section */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation menu"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#a5a0b3] transition-colors hover:bg-[#302d3b] hover:text-white md:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Online Indicator */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>

        {/* Page Title */}
        <h1 className="min-w-0 truncate text-sm font-semibold text-[#e8e2f0] sm:text-base">
          {title}
        </h1>

        {/* Model Selector */}
        <button
          type="button"
          aria-label="Selected AI model"
          className="hidden shrink-0 items-center gap-2 rounded-lg border border-[#40354f] bg-[#211d2c] px-2.5 py-2 text-xs font-medium text-[#c6acff] transition-colors hover:border-[#70549c] hover:bg-[#30263f] sm:inline-flex"
        >
          <Sparkles size={14} />
          <span>Nova AI</span>
          <ChevronDown size={13} className="text-[#9293a2]" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        {/* Backend Indicator */}
        <span className="hidden items-center rounded-md border border-[#302d3b] bg-[#211d2c] px-2 py-1.5 font-mono text-[10px] text-[#9293a2] lg:inline-flex">
          Node.js API
        </span>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Copy page link"
          title={copied ? "Link copied" : "Copy page link"}
          className="grid h-9 w-9 place-items-center rounded-lg text-[#9293a2] transition-colors hover:bg-[#302d3b] hover:text-[#c6acff]"
        >
          <Share2 size={17} />
        </button>

        {/* New Chat */}
        <button
          type="button"
          onClick={handleNewChat}
          aria-label="Start a new chat"
          title="New chat"
          className="grid h-9 w-9 place-items-center rounded-lg text-[#9293a2] transition-colors hover:bg-[#302d3b] hover:text-[#c6acff]"
        >
          <Trash2 size={17} />
        </button>

        {/* User Avatar */}
        <button
          type="button"
          onClick={() => navigate("/settings")}
          aria-label="Open user settings"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#574174] bg-gradient-to-br from-[#49335d] to-[#292034] text-xs font-bold text-[#e4d5ff] transition-colors hover:border-[#a078ff] sm:ml-1"
        >
          AM
        </button>
      </div>
    </header>
  );
}