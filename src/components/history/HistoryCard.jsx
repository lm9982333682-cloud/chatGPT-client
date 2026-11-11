import {
  Star,
  MessageSquare,
  MoreHorizontal,
  Download,
  Trash2,
  Clock3,
} from "lucide-react";

export default function HistoryCard({
  item,
  onOpen,
  onDelete,
  onDownload,
}) {
  return (
    <article className="group relative flex flex-col gap-3 rounded-2xl border border-[#302d3b] bg-[#1b1925] p-4 transition-all duration-200 hover:border-[#574574] hover:bg-[#211d2c] sm:flex-row sm:items-center sm:gap-4 sm:p-5">
      {/* Star Button */}
      <button
        type="button"
        aria-label={item.starred ? "Starred conversation" : "Star conversation"}
        aria-pressed={Boolean(item.starred)}
        onClick={(event) => event.stopPropagation()}
        className={`absolute right-4 top-4 grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors sm:static ${item.starred
            ? "text-amber-400 hover:bg-amber-400/10"
            : "text-[#777386] hover:bg-[#302d3b] hover:text-amber-400"
          }`}
      >
        <Star
          size={16}
          fill={item.starred ? "currentColor" : "none"}
        />
      </button>

      {/* Conversation Details */}
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 pr-9 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a078ff] sm:pr-0"
      >
        <h3 className="truncate text-sm font-semibold text-[#eee9f8] transition-colors group-hover:text-[#c6acff] sm:text-base">
          {item.title}
        </h3>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-2">
          {(item.tags || []).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-[#40354f] bg-[#292333] px-2 py-1 text-[11px] font-medium text-[#bba0ff]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Metadata */}
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-[11px] text-[#9293a2] sm:gap-x-3 sm:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare size={14} />
            {item.messages} messages
          </span>

          <span className="hidden text-[#514b60] sm:inline">•</span>

          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} />
            {item.time}
          </span>

          <span className="hidden text-[#514b60] sm:inline">•</span>

          <span className="text-[#777386]">
            model: {(item.model || "Nova AI").toLowerCase()}
          </span>
        </div>
      </button>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-1 border-t border-[#302d3b] pt-3 sm:shrink-0 sm:border-0 sm:pt-0">
        <button
          type="button"
          title="Download"
          aria-label="Download conversation"
          onClick={(event) => {
            event.stopPropagation();
            onDownload?.(item);
          }}
          className="grid h-9 w-9 place-items-center rounded-lg text-[#9293a2] transition-colors hover:bg-[#302d3b] hover:text-[#c6acff]"
        >
          <Download size={16} />
        </button>

        <button
          type="button"
          title="More"
          aria-label="More conversation options"
          onClick={(event) => event.stopPropagation()}
          className="grid h-9 w-9 place-items-center rounded-lg text-[#9293a2] transition-colors hover:bg-[#302d3b] hover:text-white"
        >
          <MoreHorizontal size={17} />
        </button>

        <button
          type="button"
          title="Delete"
          aria-label={`Delete ${item.title}`}
          onClick={(event) => {
            event.stopPropagation();
            onDelete?.();
          }}
          className="grid h-9 w-9 place-items-center rounded-lg text-[#9293a2] transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}