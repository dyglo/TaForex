"use client";
import React, { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import LandingDashboard from "../../components/LandingDashboard";
import styles from "./login.module.css";

export default function LoginPage() {
  const [mode, setMode] = useState<'login'|'signup'>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add login/signup logic
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Brand/Promo */}
      <div className={"flex-1 relative flex flex-col justify-center items-center overflow-hidden px-6 py-12 " + styles.leftPanelBg}>
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <svg viewBox="0 0 64 64" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="16" fill="#fff"/><path d="M20 44V20h24v24H20z" fill="#2563eb"/><path d="M28 36h8v8h-8v-8z" fill="#fff"/></svg>
            <span className="text-white text-2xl font-bold tracking-tight">Trading Journal</span>
          </div>
          <h2 className="text-white text-2xl font-semibold mb-2">Designed for full trading support</h2>
          <p className="text-blue-100 mb-8">View all your analytics and follow your trades from anywhere. Sign in to unlock full features, or use the app without signing in for basic journaling.</p>
        </div>
        {/* The image is set as a background with a blue overlay for readability */}
      </div>
      {/* Right: Login/Signup */}
      <div className="flex-1 flex flex-col justify-center items-center bg-neutral-950 px-6 py-16">
        <div className="w-full max-w-md bg-neutral-900 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-8 text-white">Log in</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode==="signup" && (
              <Input label="Name" inputSize="md" value={name} onChange={e=>setName(e.target.value)} required />
            )}
            <Input label="Email address" type="email" inputSize="md" value={email} onChange={e=>setEmail(e.target.value)} required />
            <Input label="Password" type="password" inputSize="md" value={password} onChange={e=>setPassword(e.target.value)} required />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="accent-blue-500" />
              <label htmlFor="remember" className="text-neutral-400 text-sm">Remember password</label>
            </div>
            <Button type="submit" variant="accent" className="w-full mt-2">{mode==="login"?"Sign In":"Sign Up"}</Button>
          </form>
          <div className="flex justify-between items-center mt-6 text-neutral-400 text-sm">
            <span>{mode==="login" ? "Don't have an account?" : "Already have an account?"}</span>
            <button className="text-blue-400 hover:underline" onClick={()=>setMode(mode==="login"?"signup":"login")}>{mode==="login" ? "Sign up" : "Log in"}</button>
          </div>
          <div className="my-6 flex items-center justify-center gap-2">
            <span className="h-px bg-neutral-800 w-16"/>
            <span className="text-neutral-500 text-xs">or</span>
            <span className="h-px bg-neutral-800 w-16"/>
          </div>
          <button className="w-full flex items-center justify-center gap-3 border border-neutral-700 rounded-lg py-2 hover:bg-neutral-800 transition">
            <span className="w-6 h-6">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48"><path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12\ts5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20\ts20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039\tl5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36\tc-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571\tc0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
            </span>
            <span className="text-neutral-200 font-medium">Log in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
