import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/AppContext';
import { Mail, Phone, Lock, User, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export const LoginRegisterScreen: React.FC = () => {
  const { loginUser, registerUser, sendLoginOtp, verifyLoginOtp, navigateTo, logo } = useAppState();

  const [logoClicks, setLogoClicks] = useState(0);
  const [isRegister, setIsRegister] = useState(() => {
    // Show premium registration context for first-time visitors, login for returning visitors
    const hasVisited = localStorage.getItem('velriva_has_visited');
    return hasVisited !== 'true';
  });

  useEffect(() => {
    localStorage.setItem('velriva_has_visited', 'true');
  }, []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP specific state properties
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');

  // Hidden admin easter egg trigger
  const handleLogoClick = () => {
    setLogoClicks(curr => {
      const next = curr + 1;
      if (next >= 5) {
        navigateTo('adminLogin');
        return 0;
      }
      return next;
    });
  };

  const handleSendOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setDevOtpHint('');
    
    if (!phone.trim()) {
      setErrorMsg('Please specify your WhatsApp phone number.');
      return;
    }

    setLoading(true);
    const result = await sendLoginOtp(phone);
    setLoading(false);

    if (result.success) {
      setOtpSent(true);
      if (result.devOtp) {
        setDevOtpHint(result.devOtp);
      }
    } else {
      setErrorMsg(result.error || 'Failed to dispatch verification OTP. Make sure WhatsApp daemon is active.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (isRegister) {
      // Normal Register Process
      if (!name.trim()) {
        setErrorMsg('Please specify your name.');
        setLoading(false);
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        setLoading(false);
        return;
      }
      if (!phone.trim()) {
        setErrorMsg('WhatsApp phone number is required.');
        setLoading(false);
        return;
      }
      if (!password.trim() || password.length < 4) {
        setErrorMsg('Password must be at least 4 characters.');
        setLoading(false);
        return;
      }

      const result = await registerUser(name, email, password, phone);
      setLoading(false);
      if (result === true) {
        navigateTo('home');
      } else {
        setErrorMsg(result as string);
      }
    } else {
      // Login with WhatsApp OTP Code
      if (!phone.trim()) {
        setErrorMsg('WhatsApp phone number is required.');
        setLoading(false);
        return;
      }
      if (!otpSent) {
        setErrorMsg('Please request an OTP first.');
        setLoading(false);
        return;
      }
      if (!otpCode.trim() || otpCode.length < 4) {
        setErrorMsg('Please enter a valid 6-digit OTP code.');
        setLoading(false);
        return;
      }

      const result = await verifyLoginOtp(phone, otpCode);
      setLoading(false);

      if (result.success) {
        navigateTo('home');
      } else {
        if (result.error === 'reseller_not_found') {
          setErrorMsg('No partner profile exists with this WhatsApp number. Please sign up or check your digits!');
        } else {
          setErrorMsg(result.error || 'The OTP code is invalid or expired. Try again!');
        }
      }
    }
  };

  return (
    <div id="login-screen-container" className="min-h-screen bg-slate-50 flex flex-col justify-between px-4 py-8">
      {/* Upper Section */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
        {/* Branding & Easter-egg */}
        <div className="text-center">
          <div
            onClick={handleLogoClick}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 font-black text-amber-400 text-xl shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer select-none overflow-hidden p-0"
          >
            <img src={logo || '/icon.svg'} className="h-full w-full object-cover animate-fadeIn" referrerPolicy="no-referrer" alt="Velriva Logo" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-5 tracking-tight">
            {isRegister ? 'Create Reseller Account' : 'Welcome to VELRIVA'}
          </h2>
          <p className="text-xs text-slate-500 max-w-[260px] mx-auto mt-1.5 leading-relaxed">
            {isRegister
              ? 'Join our premium B2B network to catalog orders, view bulk lists, and grow your dropship operations.'
              : 'Sign in instantly using safe, passcode-free WhatsApp OTP verification.'}
          </p>
        </div>

        {/* Tab Selection Switch */}
        <div className="bg-slate-100 p-1 rounded-xl flex">
          <button
            id="tab-login-btn"
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
              setOtpSent(false);
              setOtpCode('');
              setDevOtpHint('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              !isRegister
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            Sign In with WhatsApp
          </button>
          
          <button
            id="tab-register-btn"
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg('');
              setOtpSent(false);
              setOtpCode('');
              setDevOtpHint('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              isRegister
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            New Reseller Setup
          </button>
        </div>

        {/* Auth card Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          
          {/* 1. REGISTER FLOW FIELDS */}
          {isRegister && (
            <>
              {/* Name */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Your Full Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="register-name-field"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Zain Ul Amaan"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="register-email-field"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
                  />
                </div>
              </div>

              {/* Phone (Register) */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  WhatsApp Number (with Country Code)
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="register-phone-field"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 919690986010"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="register-password-field"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
                  />
                </div>
              </div>
            </>
          )}

          {/* 2. SIGN IN FLOW FIELDS (WhatsApp OTP only) */}
          {!isRegister && (
            <>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  WhatsApp Number (with Country Code)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 h-4 w-4 text-slate-400" />
                    <input
                      id="login-phone-field"
                      type="tel"
                      disabled={otpSent}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 919690986010"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                  {!otpSent && (
                    <button
                      onClick={handleSendOtp}
                      type="button"
                      disabled={loading || !phone.trim()}
                      className="rounded-xl bg-slate-950 text-white px-4 py-3 text-xs font-black hover:bg-slate-900 transition flex items-center shrink-0 disabled:opacity-50 cursor-pointer"
                    >
                      Send OTP
                    </button>
                  )}
                </div>
              </div>

              {otpSent && (
                <div className="animate-fadeIn space-y-2">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Enter 6-Digit Verification OTP
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                      <input
                        id="login-otp-code-field"
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                        placeholder="6-Digit OTP Code"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-black text-center tracking-widest text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] text-indigo-500 font-bold">Code sent to: {phone}</span>
                    <button
                      onClick={handleSendOtp}
                      type="button"
                      className="text-[10px] font-bold text-slate-600 hover:text-slate-950 underline cursor-pointer"
                    >
                      Resend code
                    </button>
                  </div>
                </div>
              )}

              {devOtpHint && (
                <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>⚡</span>
                    <span>AUTOMATIC DEVELOPER ACCESS</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 font-medium">
                    Because live WhatsApp Bot is configuring or scanning, your live pass code is: <strong className="text-emerald-950 tracking-wider text-xs font-black bg-emerald-100/80 px-1.5 py-0.5 rounded">{devOtpHint}</strong>
                  </p>
                </div>
              )}
            </>
          )}

          {/* Error Feedbacks */}
          {errorMsg && (
            <div className="text-[11px] font-black text-rose-500 bg-rose-50/70 border border-rose-100 p-3 rounded-xl flex items-start gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Main Submit Action */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={loading || (!isRegister && !otpSent)}
            className="w-full rounded-xl bg-slate-950 text-white py-3.5 text-xs font-black hover:bg-slate-900 transition active:scale-[0.98] shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Processing...' : isRegister ? 'Register Reseller Code' : 'Verify & Sign In'}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>

      {/* Safety Banner */}
      <div className="max-w-sm mx-auto w-full mt-8">
        <div className="flex items-center gap-2.5 text-[10px] font-black text-indigo-700 uppercase tracking-wide bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-100/50">
          <Sparkles className="h-4.5 w-4.5 text-indigo-500 fill-indigo-100 shrink-0 animate-pulse" />
          <span>Real-time persistence layer active. All inventory changes sync programmatically.</span>
        </div>
      </div>
    </div>
  );
};
