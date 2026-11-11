
import { useState } from "react";
import { BadgeCheck, Zap, ChevronDown, Server, Download, Trash2, ExternalLink, Check, RotateCcw, Save, SlidersHorizontal, Moon, Sun, Monitor, Github, CircleHelp, FileText, } from "lucide-react";

import SettingsPanel from "../components/settings/SettingsPanel";

function Toggle({ enabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={enabled}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? "bg-[#a078ff]" : "bg-[#454151]"
        }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-1"
          }`}
      />
    </button>
  );
}

function SettingRow({ title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#302d3b] py-4 last:border-b-0">
      <div className="min-w-0">
        <h4 className="text-sm font-medium text-[#e9e5f2]">{title}</h4>
        <p className="mt-1 text-xs leading-5 text-[#9293a2] sm:text-sm">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [model, setModel] = useState(
    "Nova 3.5 Pro - High Reasoning (Flagship Engine)"
  );

  const [streaming, setStreaming] = useState(true);
  const [syntax, setSyntax] = useState(true);
  const [theme, setTheme] = useState("Dark");
  const [accent, setAccent] = useState("Violet");
  const [temperature, setTemperature] = useState(0.7);
  const [directives, setDirectives] = useState(
    "Always provide concise TypeScript / Node.js snippets with inline architectural explanations."
  );
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  const defaultSettings = {
    model: "Nova 3.5 Pro - High Reasoning (Flagship Engine)",
    streaming: true,
    syntax: true,
    theme: "Dark",
    accent: "Violet",
    temperature: 0.7,
    directives:
      "Always provide concise TypeScript / Node.js snippets with inline architectural explanations.",
  };

  function save() {
    const settings = {
      model,
      streaming,
      syntax,
      theme,
      accent,
      temperature,
      directives,
    };

    localStorage.setItem("novaSettings", JSON.stringify(settings));

    setSaved(true);
    setNotice("Preferences successfully saved.");

    window.setTimeout(() => {
      setSaved(false);
      setNotice("");
    }, 2200);
  }

  function reset() {
    setModel(defaultSettings.model);
    setStreaming(defaultSettings.streaming);
    setSyntax(defaultSettings.syntax);
    setTheme(defaultSettings.theme);
    setAccent(defaultSettings.accent);
    setTemperature(defaultSettings.temperature);
    setDirectives(defaultSettings.directives);
    setSaved(false);
    setNotice("Default settings restored. Click Save Changes to keep them.");
  }

  function exportSettings() {
    const data = {
      model,
      streaming,
      syntax,
      theme,
      accent,
      temperature,
      directives,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nova-settings.json";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function purgeCache() {
    // Remove only Nova-specific local settings and prompt data.
    localStorage.removeItem("novaSettings");
    sessionStorage.removeItem("novaPrompt");

    setShowPurgeConfirm(false);
    setNotice("Nova local settings and current prompt cache cleared.");
  }

  const themes = [
    { name: "Dark", Icon: Moon },
    { name: "Light", Icon: Sun },
    { name: "Auto", Icon: Monitor },
  ];

  const accents = [
    { name: "Violet", color: "#a078ff" },
    { name: "Cyan", color: "#7bd0ff" },
    { name: "Emerald", color: "#5fe0b2" },
    { name: "Amber", color: "#f2bd68" },
  ];

  return (

    <div className="mx-auto w-full max-w-7xl px-4 py-6 text-[#f5f2ff] sm:px-6 sm:py-8 lg:px-8">
      {/* Page Header */}
      <header className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-[1.6px] text-[#bba0ff] sm:text-xs">
            <SlidersHorizontal size={14} />
            CONFIGURATION ENGINE
            <span className="text-[#625b73]">/</span>
            <span className="text-[#9293a2]">WORKSPACE://SETTINGS</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Settings &amp; Preferences
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9293a2] sm:text-base">
            Configure AI preferences, interface appearance, local cache,
            and backend integration.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#403b4d] bg-[#201e2b] px-4 py-2.5 text-sm font-medium text-[#c9c5d5] transition hover:border-[#66518a] hover:bg-[#292535]"
          >
            <RotateCcw size={15} />
            Reset Defaults
          </button>

          <button
            type="button"
            onClick={save}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9b7bea] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ad91f5]"
          >
            {saved ? <Check size={16} /> : <Save size={15} />}
            {saved ? "Saved" : "Save Changes"}
          </button>
        </div>
      </header>

      {/* Settings Columns */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        {/* Left Column */}
        <div className="flex min-w-0 flex-col gap-6">
          {/* User Profile */}
          <SettingsPanel
            eyebrow="PRO TIER"
            title="User Profile & Subscription"
            action={
              <span className="inline-flex items-center gap-1 rounded-full border border-[#7055a0] bg-[#352a48] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#d3bdff]">
                <Zap size={12} />
                PRO
              </span>
            }
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[#7055a0] bg-gradient-to-br from-[#50366f] to-[#292236] text-lg font-bold text-[#e0d0ff]">
                AM
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="flex flex-wrap items-center gap-2 text-base font-semibold text-[#f5f2ff]">
                  Alex Mercer
                  <BadgeCheck size={16} className="text-[#a78bfa]" />
                </h3>

                <p className="mt-1 text-sm text-[#aaa6b8]">
                  Senior Full-stack Engineer
                </p>

                <p className="mt-1 break-all text-xs text-[#9293a2]">
                  alex.mercer@nova-dev.io
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
                  <Check size={13} />
                  SSO Authenticated via GitHub
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setNotice("Profile editing is not connected yet.")
                }
                className="rounded-lg border border-[#403b4d] px-3 py-2 text-xs font-medium text-[#c9c5d5] transition hover:bg-[#302d3b]"
              >
                Edit Profile
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-[#423451] bg-[#211b2d] p-4 sm:flex-row sm:items-center">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#392a4d] text-[#c6acff]">
                <Zap size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-[#f0eaff]">
                  Pro Developer Unlimited
                </h4>

                <p className="mt-1 text-xs leading-5 text-[#aaa6b8]">
                  3.5 Pro Tokens Active with low-latency priority lane.
                </p>

                <p className="mt-2 text-[11px] text-[#827991]">
                  Renewal Cycle Oct 24, 2026
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setNotice("Subscription management is not connected yet.")
                }
                className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-[#c6acff] hover:text-white"
              >
                Manage Subscription
                <ExternalLink size={12} />
              </button>
            </div>
          </SettingsPanel>

          {/* AI Preferences */}
          <SettingsPanel
            eyebrow="HYPERPARAMS V3"
            title="Chat & AI Preferences"
            description="Default behavior for newly initialized threads across all workspaces."
          >
            <label
              htmlFor="generation-model"
              className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#d9d4e4]"
            >
              Default Generation Model
              <span className="text-[10px] font-medium tracking-wide text-[#a78bfa]">
                200K CONTEXT WINDOW
              </span>
            </label>

            <div className="relative">
              <select
                id="generation-model"
                value={model}
                onChange={(event) => setModel(event.target.value)}
                className="w-full appearance-none rounded-xl border border-[#403b4d] bg-[#201e2b] px-4 py-3 pr-10 text-sm leading-6 text-[#e9e5f2] outline-none transition focus:border-[#9b7bea]"
              >
                <option>
                  Nova 3.5 Pro - High Reasoning (Flagship Engine)
                </option>
                <option>
                  Nova 3.0 Ultra - Mathematical &amp; Deep Deductive
                </option>
                <option>
                  Nova 3.5 Flash - Instantaneous Code Completion
                </option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9293a2]"
              />
            </div>

            <p className="mt-2 text-xs leading-5 text-[#858193]">
              Choose the model Nova uses when you start a new conversation.
            </p>

            <div className="mt-3 divide-y divide-[#302d3b]">
              <SettingRow
                title="Stream responses in real-time"
                description="SSE (Server-Sent Events) live chunking"
              >
                <Toggle
                  label="Stream responses in real-time"
                  enabled={streaming}
                  onChange={() => setStreaming((value) => !value)}
                />
              </SettingRow>

              <SettingRow
                title="Code syntax & auto-copy"
                description="Code highlighting and clipboard features"
              >
                <Toggle
                  label="Code syntax and auto-copy"
                  enabled={syntax}
                  onChange={() => setSyntax((value) => !value)}
                />
              </SettingRow>
            </div>

            {/* Temperature */}
            <div className="mt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#e9e5f2]">
                    System Temperature &amp; Creativity
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-[#9293a2]">
                    Balances deterministic code synthesis with divergent
                    thinking.
                  </p>
                </div>

                <span className="rounded-lg border border-[#574574] bg-[#30263f] px-3 py-1.5 font-mono text-sm font-semibold text-[#d2bcff]">
                  {temperature.toFixed(2)}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(event) =>
                  setTemperature(Number(event.target.value))
                }
                aria-label="System temperature"
                className="mt-5 h-2 w-full cursor-pointer accent-[#a078ff]"
              />

              <div className="mt-2 flex flex-wrap justify-between gap-2 text-[10px] leading-4 text-[#858193] sm:text-xs">
                <span>0.0 Precise</span>
                <span>0.5 Analytical</span>
                <span>1.0 Creative</span>
              </div>
            </div>

            {/* System Directives */}
            <div className="mt-6">
              <label
                htmlFor="system-directives"
                className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#d9d4e4]"
              >
                Global System Directives
                <span className="text-[10px] tracking-wide text-[#a78bfa]">
                  SYSTEM PROMPT
                </span>
              </label>

              <textarea
                id="system-directives"
                value={directives}
                onChange={(event) => setDirectives(event.target.value)}
                maxLength={2000}
                rows={4}
                className="w-full resize-y rounded-xl border border-[#403b4d] bg-[#171620] px-4 py-3 text-sm leading-6 text-[#e9e5f2] outline-none transition placeholder:text-[#777386] focus:border-[#9b7bea]"
              />

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#858193]">
                <span>Active across all chat agents</span>
                <span>{directives.length} / 2,000 characters</span>
              </div>
            </div>
          </SettingsPanel>
        </div>

        {/* Right Column */}
        <div className="flex min-w-0 flex-col gap-6">
          {/* Appearance */}
          <SettingsPanel eyebrow="UI TOKENS" title="Theme & Appearance">
            <h4 className="mb-3 text-xs font-semibold text-[#d9d4e4]">
              Interface Mode
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {themes.map(({ name, Icon }) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setTheme(name)}
                  aria-pressed={theme === name}
                  className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm transition sm:p-4 ${theme === name
                    ? "border-[#8d6bca] bg-[#30263f] text-[#d7c4ff]"
                    : "border-[#373342] bg-[#201e2b] text-[#aaa6b8] hover:border-[#66518a]"
                    }`}
                >
                  <Icon size={19} />
                  <span>{name}</span>

                  {theme === name && (
                    <Check
                      size={13}
                      className="absolute right-2 top-2 text-[#c6acff]"
                    />
                  )}
                </button>
              ))}
            </div>

            <h4 className="mb-3 mt-6 text-xs font-semibold text-[#d9d4e4]">
              Accent Color Matrix
            </h4>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {accents.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => setAccent(item.name)}
                  aria-pressed={accent === item.name}
                  className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-3 text-xs font-medium transition ${accent === item.name
                    ? "border-[#766093] bg-[#30263f] text-[#e4d8ff]"
                    : "border-[#373342] bg-[#201e2b] text-[#aaa6b8] hover:border-[#66518a]"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white/10"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>

                  {accent === item.name && <Check size={13} />}
                </button>
              ))}
            </div>

            <p className="mt-4 text-xs leading-5 text-[#858193]">
              Appearance choices are saved locally. Applying the selected
              theme and accent across the whole application requires
              connecting them to your app's theme provider.
            </p>
          </SettingsPanel>

          {/* Backend and Storage */}
          <SettingsPanel
            eyebrow="RUNTIME CONNECTION"
            title="Data, Storage & Backend API"
          >
            <div className="flex items-start gap-3 rounded-xl border border-[#373342] bg-[#201e2b] p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#30263f] text-[#c6acff]">
                <Server size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-[#e9e5f2]">
                  Node.js Engine Backend
                </h4>

                <p className="mt-2 flex items-center gap-2 text-xs leading-5 text-[#9293a2]">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                  Backend status is simulated in this UI
                </p>
              </div>

              <span className="rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[10px] font-bold text-amber-300">
                DEMO
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["Target Host", "localhost:3000"],
                ["Latency", "18 ms (demo)"],
                ["Protocol", "SSE / HTTP"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#302d3b] bg-[#171620] p-3"
                >
                  <p className="text-[11px] text-[#858193]">{label}</p>
                  <p className="mt-2 break-words text-xs font-semibold text-[#e0dbea]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={exportSettings}
              className="mt-4 flex w-full items-center gap-3 rounded-xl border border-[#373342] bg-[#201e2b] p-4 text-left transition hover:border-[#66518a] hover:bg-[#292535]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#30263f] text-[#c6acff]">
                <Download size={17} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-[#e9e5f2]">
                  Export settings
                </span>
                <span className="mt-1 block text-xs text-[#9293a2]">
                  Download configuration as JSON
                </span>
              </span>

              <ExternalLink size={15} className="text-[#9293a2]" />
            </button>

            <div className="mt-3 flex items-center gap-3 rounded-xl border border-red-400/15 bg-red-400/[0.04] p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-400/10 text-red-300">
                <Trash2 size={17} />
              </span>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-[#e9e5f2]">
                  Clear local thread cache
                </h4>
                <p className="mt-1 text-xs leading-5 text-[#9293a2]">
                  Remove Nova settings and the current session prompt.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPurgeConfirm(true)}
                className="rounded-lg border border-red-400/20 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-400/10"
              >
                Purge
              </button>
            </div>
          </SettingsPanel>

          {/* About and Support */}
          <SettingsPanel eyebrow="NOVA AI" title="About & Support">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#604a7d] bg-gradient-to-br from-[#50366f] to-[#292236] text-2xl text-[#e0d0ff]">
                ✦
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#f0eaff]">
                  Nova AI v2.4.0
                  <span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-emerald-400">
                    STABLE
                  </span>
                </h4>

                <p className="mt-1 text-xs text-[#9293a2]">
                  Build 8042 · Apache 2.0 licensed
                </p>
              </div>
            </div>

            <p className="mt-5 rounded-xl border border-[#302d3b] bg-[#171620] p-4 text-sm italic leading-6 text-[#aaa6b8]">
              “Crafted for high-velocity engineers who treat software
              architecture as an ambient artform.”
            </p>

            <div className="mt-4 divide-y divide-[#302d3b]">
              {[
                {
                  label: "Documentation",
                  Icon: FileText,
                },
                {
                  label: "GitHub Repo",
                  Icon: Github,
                },
                {
                  label: "Help Center",
                  Icon: CircleHelp,
                },
              ].map(({ label, Icon }) => (
                <button
                  type="button"
                  key={label}
                  onClick={() =>
                    setNotice(`${label} link has not been configured yet.`)
                  }
                  className="flex w-full items-center gap-3 py-3 text-left text-sm text-[#c9c5d5] transition hover:text-[#d7c4ff]"
                >
                  <Icon size={16} className="text-[#a78bfa]" />
                  <span className="flex-1">{label}</span>
                  <ExternalLink size={13} className="text-[#777386]" />
                </button>
              ))}
            </div>
          </SettingsPanel>
        </div>
      </div>

      {/* Purge Confirmation */}
      {showPurgeConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowPurgeConfirm(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="purge-title"
            className="w-full max-w-md rounded-2xl border border-[#403b4d] bg-[#201e2b] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-red-400/10 text-red-300">
              <Trash2 size={20} />
            </div>

            <h2
              id="purge-title"
              className="text-lg font-semibold text-[#f5f2ff]"
            >
              Clear local Nova cache?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#aaa6b8]">
              This removes the saved Nova settings and current prompt from
              browser storage. It does not delete server-side conversations
              or IndexedDB data.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPurgeConfirm(false)}
                className="rounded-xl border border-[#403b4d] px-4 py-2.5 text-sm text-[#c9c5d5] hover:bg-[#302d3b]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={purgeCache}
                className="rounded-xl bg-red-500/15 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/25"
              >
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {notice && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-xl border border-[#514568] bg-[#252130] px-4 py-3.5 text-sm text-[#e9e5f2] shadow-2xl sm:bottom-6"
        >
          <Check size={17} className="mt-0.5 shrink-0 text-emerald-400" />
          <span className="flex-1">{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="text-[#9293a2] hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}