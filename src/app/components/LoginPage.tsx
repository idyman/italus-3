import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginPageProps {
  onLogin: (email: string, password: string) => void | Promise<void>;
  onBack: () => void;
  error?: string;
  submitting?: boolean;
}

export function LoginPage({ onLogin, onBack, error, submitting = false }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <button
          onClick={onBack}
          className="mb-8 sm:mb-12 text-sm hover:underline transition-all"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
          }}
        >
          ← Back
        </button>

        <div className="border border-black p-6 sm:p-8">
          <h1 
            className="mb-2"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
              fontSize: 'clamp(24px, 4vw, 36px)',
              lineHeight: 1.0714285714,
              fontWeight: 600,
              letterSpacing: '-0.03em'
            }}
          >
            Admin Login
          </h1>
          <p 
            className="text-gray-500 mb-8"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
              fontSize: 'clamp(15px, 3vw, 17px)',
              lineHeight: 1.4705882353,
              fontWeight: 400,
              letterSpacing: '-0.022em'
            }}
          >
            Access your portfolio dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-normal text-gray-700"
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                }}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 border-gray-300 focus:border-black"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <Label 
                htmlFor="password" 
                className="text-sm font-normal text-gray-700"
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 border-gray-300 focus:border-black"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div 
                className="bg-red-50 border border-red-200 p-3 text-red-700 text-sm"
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                }}
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white hover:bg-gray-800 border-0 disabled:opacity-60"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
              }}
            >
              {submitting ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;