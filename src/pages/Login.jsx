
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import useAuthHook from "../hooks/useAuthHook";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, errors, isSubmitting, onSubmitLogin } = useAuthHook();


    return (
        <div className="relative min-h-screen bg-[#0c0e14] font-sans text-[#e2e2eb]">

            {/* Background Effects */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(160,120,255,0.18),rgba(123,208,255,0.06),transparent_75%)] blur-3xl" />

                <div className="absolute -bottom-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(109,59,215,0.12),transparent_70%)] blur-3xl" />

                <div className="absolute inset-0 bg-[radial-gradient(#e2e2eb_1px,transparent_1px)] opacity-[0.02] [background-size:24px_24px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">

                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#33343b] shadow-[0_0_12px_rgba(208,188,255,0.25)]">
                        <span className="text-xl text-[#d0bcff]">✺</span>
                    </div>

                    <span className="text-xs font-bold uppercase tracking-[0.2em]">
                        Nova AI
                    </span>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-[#282a30]/70 px-3 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7bd0ff] shadow-[0_0_8px_#7bd0ff]" />

                    <span className="text-[10px] uppercase tracking-wider text-[#cbc3d7]">
                        Operational
                    </span>
                </div>
            </header>

            {/* Main */}
            <main className="relative z-10 flex items-center justify-center px-4 py-8 sm:py-10">

                <div className="relative w-full max-w-[460px]">

                    {/* Card Glow */}
                    <div className="pointer-events-none absolute -top-12 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#a078ff]/20 blur-[80px]" />

                    <div className="pointer-events-none absolute -bottom-10 right-10 h-48 w-48 rounded-full bg-[#00a6e0]/15 blur-[70px]" />

                    {/* Login Card */}
                    <div className="relative overflow-hidden rounded-xl border border-white/[0.04] bg-[#191b22]/90 p-6 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8),0_0_35px_-8px_rgba(160,120,255,0.18)] backdrop-blur-xl sm:p-10">

                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d0bcff]/35 to-transparent" />

                        {/* Card Header */}
                        <div className="flex flex-col items-center text-center">

                            <div className="group relative mb-5">
                                <div className="absolute inset-0 rounded-xl bg-[#d0bcff]/30 blur-md transition-all group-hover:blur-lg" />

                                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#33343b] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">

                                    <svg
                                        className="h-6 w-6 text-[#d0bcff] transition-transform duration-500 group-hover:rotate-45"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" />
                                    </svg>

                                </div>
                            </div>

                            <div className="mb-2 flex items-center gap-2">
                                <span className="text-xl font-semibold tracking-tight">
                                    Nova AI
                                </span>

                                <span className="rounded-full bg-[#33343b] px-2 py-1 text-[10px] uppercase tracking-wider text-[#d0bcff]">
                                    v2.4.0
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
                                Welcome back
                            </h1>

                            <p className="max-w-[340px] text-sm leading-6 text-[#cbc3d7]">
                                Sign in to access your models, persistent threads, and
                                developer workspace.
                            </p>
                        </div>

                        {/* Login Form */}
                        <form
                            onSubmit={handleSubmit(onSubmitLogin)}
                            className="mt-8 flex flex-col gap-5"
                        >

                            {/* Email */}
                            <div className="flex flex-col gap-2">

                                <label className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider">
                                    <span>
                                        Email Address <span className="text-[#d0bcff]">*</span>
                                    </span>

                                    <span className="text-[10px] font-normal normal-case tracking-normal text-[#958ea0]">
                                        e.g. node.js auth
                                    </span>
                                </label>

                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 text-lg text-[#958ea0]">
                                        @
                                    </span>

                                    <input
                                        type="email"
                                        placeholder="alex.mercer@nova-dev.io"
                                        className="w-full rounded-lg bg-[#33343b]/80 py-3 pl-10 pr-4 text-sm text-white shadow-inner outline-none transition-all placeholder:text-[#958ea0] focus:bg-[#33343b] focus:ring-1 focus:ring-[#d0bcff]/50"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Please enter a valid email address",
                                            },
                                        })}
                                    />
                                </div>

                                {errors.email && (
                                    <p className="text-xs text-[#ffb4ab]">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-2">

                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-semibold uppercase tracking-wider">
                                        Password <span className="text-[#d0bcff]">*</span>
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-[11px] font-semibold text-[#d0bcff] transition-colors hover:text-white"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className="relative flex items-center">

                                    <span className="absolute left-3.5 text-[#958ea0]">
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            viewBox="0 0 24 24"
                                        >
                                            <rect x="4" y="10" width="16" height="11" rx="2" />
                                            <path d="M8 10V7a4 4 0 018 0v3" />
                                        </svg>
                                    </span>

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        className="w-full rounded-lg bg-[#33343b]/80 py-3 pl-10 pr-12 text-sm text-white shadow-inner outline-none transition-all placeholder:text-[#958ea0] focus:bg-[#33343b] focus:ring-1 focus:ring-[#d0bcff]/50"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters",
                                            },
                                        })}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 rounded p-1 text-[#958ea0] transition-colors hover:text-white cursor-pointer"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? "◉" : "◎"}
                                    </button>

                                </div>

                                {errors.password && (
                                    <p className="text-xs text-[#ffb4ab]">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center pt-0.5">
                                <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-[#cbc3d7]">

                                    <input
                                        type="checkbox"
                                        {...register("remember")}
                                        className="h-4 w-4 cursor-pointer accent-[#a078ff]"
                                    />

                                    Remember this device for 30 days
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative mt-1 flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-[#a078ff] to-[#6d3bd7] px-4 py-3 text-sm font-semibold tracking-wide text-[#23005c] shadow-[0_10px_20px_-5px_rgba(160,120,255,0.35)] transition-all duration-200 hover:shadow-[0_12px_25px_-4px_rgba(160,120,255,0.5)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                            >

                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                                <span className="relative flex items-center gap-2">
                                    {isSubmitting ? "Signing In..." : "Sign In to Nova"}
                                    <span className="text-lg">→</span>
                                </span>

                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8 flex items-center justify-center">

                            <div className="h-px w-full bg-[#33343b]" />

                            <span className="absolute bg-[#191b22] px-3 text-[10px] uppercase tracking-widest text-[#958ea0]">
                                or continue with
                            </span>

                        </div>

                        {/* GitHub Login */}
                        <button
                            type="button"
                            onClick={() => console.log("GitHub Login Clicked")}
                            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#33343b] px-4 py-3 text-sm font-medium transition-all hover:bg-[#373940] active:scale-[0.99]"
                        >

                            <svg
                                className="h-4 w-4 fill-current"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>

                            Sign in with GitHub
                        </button>

                        {/* Footer */}
                        <div className="mt-8 flex flex-col items-center gap-3 text-center">

                            <p className="text-xs text-[#cbc3d7]">
                                Don't have an account?

                                <Link
                                    to="/register"
                                    className="ml-1 font-medium text-[#d0bcff] transition-colors hover:text-white"
                                >
                                    Create an account
                                </Link>
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-[#958ea0]">
                                <span className="text-[#7bd0ff]">✓</span>
                                Protected by end-to-end encrypted session tokens · Node.js API Ready
                            </div>

                        </div>

                    </div>
                </div>
            </main>

            {/* Page Footer */}
            <footer className="relative z-10 flex flex-wrap items-center justify-center gap-2 px-4 pb-6 pt-2 text-center text-[11px] text-[#958ea0]">
                <span>Nova Intelligence Architecture</span>
                <span>·</span>
                <span>End-to-End Cryptographic Session</span>
            </footer>

        </div>
    );
};

export default Login;
