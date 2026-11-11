
import { useState } from "react";
import {
    Bot,
    User,
    Copy,
    ThumbsUp,
    ThumbsDown,
    RefreshCw,
    Check,
} from "lucide-react";

export default function MessageBubble({ role, children }) {
    const user = role === "user";
    const [copied, setCopied] = useState(false);
    const [feedback, setFeedback] = useState("");

    async function handleCopy() {
        try {
            const element = document.getElementById(`message-${role}`);
            const text = element?.innerText || "";

            await navigator.clipboard.writeText(text);
            setCopied(true);

            setTimeout(() => setCopied(false), 2000);
        } catch {
            console.error("Failed to copy message.");
        }
    }

    return (
        <div className={`flex w-full gap-3 sm:gap-4 ${user ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border sm:h-10 sm:w-10 ${user
                        ? "border-[#5b477b] bg-[#30263f] text-[#d4bfff]"
                        : "border-[#40384f] bg-gradient-to-br from-[#352747] to-[#211d2b] text-[#c6acff]"
                    }`}
            >
                {user ? <User size={16} /> : <Bot size={17} />}
            </div>

            {/* Message Content */}
            <div className={`min-w-0 flex-1 ${user ? "flex flex-col items-end" : ""}`}>
                {/* Author */}
                <div
                    className={`mb-2 flex flex-wrap items-center gap-2 text-xs ${user ? "justify-end" : "justify-start"
                        }`}
                >
                    <span className="font-semibold tracking-wide text-[#ded8eb]">
                        {user ? "Alex Mercer" : "NOVA SYSTEM ENGINE"}
                    </span>

                    <span className="text-[#777386]">
                        {user ? "10:42 AM" : "Just now"}
                    </span>
                </div>

                {/* Message */}
                <div
                    id={`message-${role}`}
                    className={`max-w-full overflow-hidden rounded-2xl border px-4 py-3 text-sm leading-7 sm:px-5 sm:py-4 sm:text-[15px] ${user
                            ? "rounded-tr-md border-[#554174] bg-[#30263f] text-[#f0eaff]"
                            : "rounded-tl-md border-[#302d3b] bg-[#1b1925] text-[#d5d1df]"
                        }`}
                >
                    <div className="min-w-0 break-words [&_pre]:max-w-full [&_pre]:overflow-x-auto">
                        {children}
                    </div>
                </div>

                {/* Assistant Actions */}
                {!user && (
                    <div className="mt-3 flex flex-wrap items-center gap-1">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-[#9293a2] transition hover:bg-[#292535] hover:text-white"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? "Copied" : "Copy"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                window.dispatchEvent(
                                    new CustomEvent("nova:regenerate-message")
                                )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-[#9293a2] transition hover:bg-[#292535] hover:text-white"
                        >
                            <RefreshCw size={14} />
                            Regenerate
                        </button>

                        <button
                            type="button"
                            aria-label="Helpful"
                            aria-pressed={feedback === "up"}
                            onClick={() =>
                                setFeedback((current) => (current === "up" ? "" : "up"))
                            }
                            className={`rounded-lg p-2 transition ${feedback === "up"
                                    ? "bg-emerald-400/10 text-emerald-400"
                                    : "text-[#9293a2] hover:bg-[#292535] hover:text-white"
                                }`}
                        >
                            <ThumbsUp size={14} />
                        </button>

                        <button
                            type="button"
                            aria-label="Not helpful"
                            aria-pressed={feedback === "down"}
                            onClick={() =>
                                setFeedback((current) => (current === "down" ? "" : "down"))
                            }
                            className={`rounded-lg p-2 transition ${feedback === "down"
                                    ? "bg-red-400/10 text-red-300"
                                    : "text-[#9293a2] hover:bg-[#292535] hover:text-white"
                                }`}
                        >
                            <ThumbsDown size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}