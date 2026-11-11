
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

import ChatComposer from "../components/chat/ChatComposer";

export default function Home() {
  const navigate = useNavigate();

  function send(text) {
    const message = text.trim();

    if (!message) return;

    sessionStorage.setItem("novaPrompt", message);
    sessionStorage.removeItem("chatId");
    sessionStorage.removeItem("currentChatId");

    navigate("/chat");
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#13121a]">
      {/* Center Content */}
      <main className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-[#554074] bg-gradient-to-br from-[#34254d] to-[#1e1c29] text-[#c6acff] shadow-[0_8px_30px_#7e52c51b]">
            <Sparkles size={26} strokeWidth={1.8} />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-semibold tracking-tight text-[#f7f3ff] sm:text-4xl">
            What can I help you
            <span className="mt-1 block text-[#bba0ff]">
              with today?
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-md text-sm leading-6 text-[#9293a2]">
            Ask a question, write code, or explore a new idea.
          </p>

          {/* Simple Suggestions */}
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {[
              "Explain JavaScript promises",
              "Help me build an API",
              "Write a React component",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                className="rounded-full border border-[#302d3b] bg-[#1b1924] px-4 py-2.5 text-xs text-[#b7b1c6] transition-colors hover:border-[#70549c] hover:bg-[#292233] hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Chat Input */}
      <footer className="relative z-10 w-full shrink-0 border-t border-[#302d3b]/70 bg-[#191720] px-3 pb-3 pt-3 sm:px-6 sm:pb-4">
        <div className="mx-auto w-full max-w-3xl">
          <ChatComposer
            onSend={send}
            placeholder="Message Nova AI..."
          />

          <p className="mt-2 text-center text-[10px] text-[#6f7180]">
            Nova AI can make mistakes. Verify important information.
          </p>
        </div>
      </footer>
    </div>
  );
}