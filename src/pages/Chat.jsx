
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Terminal,
  Share2,
  MoreHorizontal,
  Paperclip,
  Bot,
  UserRound,
  Sparkles,
} from "lucide-react";

import ChatComposer from "../components/chat/ChatComposer";
import {
  createChat,
  sendMessage,
  getChatById,
} from "../services/chatService.js";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");
  const [chatId, setChatId] = useState(
    sessionStorage.getItem("novaChatId") || null
  );

  const messagesContainerRef = useRef(null);
  const requestInProgressRef = useRef(false);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeChat() {
      setInitializing(true);
      setError("");

      try {
        const savedPrompt = sessionStorage.getItem("novaPrompt")?.trim();

        // A new prompt takes priority over an old chat ID.
        if (savedPrompt) {
          sessionStorage.removeItem("novaPrompt");
          sessionStorage.removeItem("novaChatId");

          setChatId(null);
          setMessages([{ role: "user", text: savedPrompt }]);
          setLoading(true);

          const newChat = await createChat();

          if (cancelled) return;

          const newChatId = newChat._id || newChat.chat?._id;

          if (!newChatId) {
            throw new Error("Chat ID nahi mila. Backend response check karo.");
          }

          setChatId(newChatId);
          sessionStorage.setItem("novaChatId", newChatId);

          const response = await sendMessage(newChatId, savedPrompt);

          if (cancelled) return;

          setMessages([
            {
              role: "user",
              text: response.userMessage.content,
            },
            {
              role: "assistant",
              text: response.assistantMessage.content,
            },
          ]);

          return;
        }

        // Open the selected existing conversation.
        const savedChatId =
          sessionStorage.getItem("novaChatId") ||
          sessionStorage.getItem("currentChatId") ||
          sessionStorage.getItem("chatId");

        if (savedChatId) {
          const result = await getChatById(savedChatId);

          if (cancelled) return;

          const chat = result.chat || result;
          const loadedMessages = (chat.messages || []).map((message) => ({
            role: message.role,
            text: message.content ?? message.text ?? "",
          }));

          setChatId(chat._id || savedChatId);
          sessionStorage.setItem("novaChatId", chat._id || savedChatId);
          setMessages(loadedMessages);
        } else {
          setChatId(null);
          setMessages([]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            err.message ||
            "Chat load nahi ho payi. Dobara try karo."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setInitializing(false);
          requestAnimationFrame(() => scrollToBottom("auto"));
        }
      }
    }

    initializeChat();

    return () => {
      cancelled = true;
    };
  }, [scrollToBottom]);

  const send = async (text) => {
    const message = text.trim();

    if (!message || requestInProgressRef.current) return;

    requestInProgressRef.current = true;
    setError("");
    setLoading(true);

    setMessages((current) => [
      ...current,
      { role: "user", text: message },
    ]);

    requestAnimationFrame(() => scrollToBottom());

    try {
      let activeChatId = chatId;

      if (!activeChatId) {
        const newChat = await createChat();
        activeChatId = newChat._id || newChat.chat?._id;

        if (!activeChatId) {
          throw new Error("Chat ID nahi mila. Backend response check karo.");
        }

        setChatId(activeChatId);
        sessionStorage.setItem("novaChatId", activeChatId);
      }

      const response = await sendMessage(activeChatId, message);

      const assistantText =
        response.assistantMessage?.content ??
        response.message ??
        "";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: assistantText,
        },
      ]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Message send nahi hua. Dobara try karo."
      );
    } finally {
      setLoading(false);
      requestInProgressRef.current = false;

      requestAnimationFrame(() => scrollToBottom());
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      setError("Chat link copy nahi ho saka.");
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#13121a]">
      {/* Chat Header */}
    

      {/* Messages Scroll Area */}
      <main
        ref={messagesContainerRef}
        className="nova-chat-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-3 py-5 sm:px-6 sm:py-7"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          {initializing && (
            <div className="py-8 text-center text-sm text-[#9293a2]">
              Loading conversation...
            </div>
          )}

          {!initializing && messages.length === 0 && !error && (
            <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-[#554074] bg-[#211d2c] text-[#c6acff]">
                <Bot size={25} />
              </div>

              <h3 className="text-lg font-semibold text-[#f5f2ff]">
                Start a conversation
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[#9293a2]">
                Ask Nova AI a question, or enter some code to get started.
              </p>
            </div>
          )}

          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                key={`${chatId || "new"}-${index}`}
                className={`flex w-full min-w-0 items-start gap-3 ${isUser ? "justify-end" : "justify-start"
                  }`}
              >
                {!isUser && (
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-[#554074] bg-[#292034] text-[#c6acff]">
                    <Bot size={17} />
                  </div>
                )}

                <div
                  className={`min-w-0 max-w-[90%] overflow-hidden rounded-2xl px-4 py-3 sm:max-w-[82%] sm:px-5 ${isUser
                      ? "rounded-tr-sm border border-[#62468b] bg-[#493363] text-[#f7f1ff]"
                      : "rounded-tl-sm border border-[#302d3b] bg-[#1b1924] text-[#e7e2ef]"
                    }`}
                >
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider opacity-70">
                    {isUser ? (
                      <>
                        <UserRound size={13} />
                        You
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        Nova AI
                      </>
                    )}
                  </div>

                  <div className="whitespace-pre-wrap break-words text-sm leading-7 [overflow-wrap:anywhere]">
                    {message.text}
                  </div>
                </div>

                {isUser && (
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-[#62468b] bg-[#30233f] text-[#d4bfff]">
                    <UserRound size={16} />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3" role="status">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-[#554074] bg-[#292034] text-[#c6acff]">
                <Bot size={17} />
              </div>

              <div className="rounded-2xl rounded-tl-sm border border-[#302d3b] bg-[#1b1924] px-4 py-3 text-sm text-[#bba0ff]">
                Nova AI is thinking...
              </div>
            </div>
          )}

          {error && (
            <div
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300"
              role="alert"
            >
              {error}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Composer */}
      <footer className="z-10 w-full shrink-0 border-t border-[#292735] bg-[#15141d] px-3 pb-3 pt-3 sm:px-6 sm:pb-4">
        <div className="mx-auto max-w-4xl">
        

          <ChatComposer
            onSend={send}
            placeholder={
              loading ? "Nova AI is thinking..." : "Ask a follow-up question..."
            }
            disabled={loading || initializing}
          />

          <p className="mt-2 text-center text-[10px] leading-5 text-[#777386] sm:text-xs">
            Nova AI can make mistakes. Verify important information.
          </p>
        </div>
      </footer>

      {/* Dark, slim scrollbar */}
      <style>{`
        .nova-chat-scroll {
          scrollbar-width: thin;
          scrollbar-color: #454052 transparent;
        }

        .nova-chat-scroll::-webkit-scrollbar {
          width: 7px;
        }

        .nova-chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .nova-chat-scroll::-webkit-scrollbar-thumb {
          background: #454052;
          border-radius: 999px;
        }

        .nova-chat-scroll::-webkit-scrollbar-thumb:hover {
          background: #6a5b82;
        }
      `}</style>
    </div>
  );
}