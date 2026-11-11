
export default function SettingsPanel({
  eyebrow,
  title,
  description,
  action,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#302d3b] bg-[#1b1925]">
      {/* Panel Heading */}
      <div className="flex flex-col gap-4 border-b border-[#302d3b] p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5 lg:p-6">
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[1.8px] text-[#a78bfa] sm:text-[11px]">
              {eyebrow}
            </div>
          )}

          <h2 className="text-base font-semibold tracking-tight text-[#eee9f8] sm:text-lg">
            {title}
          </h2>

          {description && (
            <p className="mt-2 max-w-2xl text-xs leading-6 text-[#9293a2] sm:text-sm">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="flex shrink-0 items-center gap-2">
            {action}
          </div>
        )}
      </div>

      {/* Panel Content */}
      <div className="space-y-5 p-4 sm:p-5 lg:p-6">
        {children}
      </div>
    </section>
  );
}