
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthHook from "../hooks/useAuthHook";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, watch, handleSubmit, errors, isSubmitting, onSubmitRegister } = useAuthHook();

  const name = watch("name") || "";
  const password = watch("password") || "";

  const getPasswordStrength = () => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  };

  const strength = getPasswordStrength();



  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] px-4 py-10 text-white relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/20 blur-[120px] rounded-full" />

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#111827]/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-500/30">
            N
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Create your account
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Join Nova AI and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmitRegister)} className="space-y-5">

          {/* Full Name */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-200">
                Full Name
              </label>

              <span className="text-xs text-gray-500">
                {name.length}/50
              </span>
            </div>

            <input
              type="text"
              placeholder="Enter your full name"
              maxLength={50}
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name cannot exceed 50 characters",
                },
              })}
              className="w-full rounded-lg border border-white/10 bg-[#0b1220] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />

            {errors.name && (
              <p className="text-red-400 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className="w-full rounded-lg border border-white/10 bg-[#0b1220] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />

            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="w-full rounded-lg border border-white/10 bg-[#0b1220] px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Password Strength */}
            {password && (
              <div className="mt-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className={`h-1 flex-1 rounded-full ${strength >= item
                        ? strength <= 2
                          ? "bg-red-500"
                          : strength <= 3
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        : "bg-gray-700"
                        }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  {strength <= 2
                    ? "Weak password"
                    : strength <= 3
                      ? "Medium password"
                      : "Strong password"}
                </p>
              </div>
            )}

            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="w-full rounded-lg border border-white/10 bg-[#0b1220] px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-start gap-3 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                {...register("terms", {
                  required: "You must accept the terms and conditions",
                })}
                className="mt-1 accent-indigo-500 cursor-pointer"
              />

              <span>
                I agree to the{" "}
                <Link to="/terms" className="text-indigo-400 hover:text-indigo-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {errors.terms && (
              <p className="text-red-400 text-xs mt-1">
                {errors.terms.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-400 mt-7">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Your data is securely handled. Password hashing is performed
          server-side.
        </p>
      </div>
    </div>
  );
};

export default Register;
