
import { useState } from "react";
import { ArrowUp, Paperclip } from "lucide-react";

export default function ChatComposer({
  onSend,
  placeholder = "Message Nova AI...",
}) {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const text = message.trim();

    if (!text) return;

    onSend?.(text);
    setMessage("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 rounded-2xl border border-[#373342] bg-[#201e2b] p-3 sm:p-4"
    >
      <button
        type="button"
        aria-label="Attach file"
        className="mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#aaa6b8] transition hover:bg-[#302b3d] hover:text-white"
      >
        <Paperclip size={19} />
      </button>

      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
        placeholder={placeholder}
        rows={1}
        className="max-h-36 min-h-10 flex-1 resize-y bg-transparent py-2 text-sm leading-6 text-[#f5f2ff] outline-none placeholder:text-[#777386]"
      />

      <button
        type="submit"
        disabled={!message.trim()}
        aria-label="Send message"
        className="mb-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#8b5cf6] text-white transition hover:bg-[#9b72fa] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowUp size={19} />
      </button>
    </form>
  );
}