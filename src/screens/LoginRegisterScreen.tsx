import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/AppContext';
import { Mail, Phone, Lock, User, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const LoginRegisterScreen: React.FC = () => {
  const { loginUser, registerUser, sendLoginOtp, verifyLoginOtp, navigateTo, logo } = useAppState();

  const [logoClicks, setLogoClicks] = useState(0);
  const [isRegister, setIsRegister] = useState(() => {
    const hasVisited = localStorage.getItem('velriva_has_visited');
    return hasVisited !== 'true';
  });

  useEffect(() => {
    localStorage.setItem('velriva_has_visited', 'true');
  }, []);

  // Registration step state
  // 0: Enter Name & Phone, 1: Verify WhatsApp OTP, 2: Choose Password & Submit
  const [regStep, setRegStep] = useState(0);
  
  // Registration form inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP Inputs
  const [otpCode, setOtpCode] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');

  // Login form inputs
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

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

  // Sign up Step 0: Dispatches OTP via server
  const handleSendOtpRegister = async (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setDevOtpHint('');

    if (!name.trim()) {
      setErrorMsg('Please specify your full name.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Mobile number must include country code (e.g. 919690986010).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please specify a valid email address.');
      return;
    }

    setLoading(true);
    const result = await sendLoginOtp(email.trim().toLowerCase());
    setLoading(false);

    if (result.success) {
      setRegStep(1);
      if (result.devOtp) {
        setDevOtpHint(result.devOtp);
      }
    } else {
      setErrorMsg(result.error || 'Failed to dispatch verification OTP to your email. Check your console or ensure Supabase Email Auth is active.');
    }
  };

  // Sign up Step 1: Confirms the OTP
  const handleVerifyOtpRegister = async (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpCode.trim() || otpCode.length < 4) {
      setErrorMsg('Please enter a valid OTP code.');
      return;
    }

    setLoading(true);
    const result = await verifyLoginOtp(email.trim().toLowerCase(), otpCode);
    setLoading(false);

    if (result.success || result.error === 'reseller_not_found') {
      setRegStep(2); // Advanced to next stage!
      setErrorMsg('');
    } else {
      setErrorMsg(result.error || 'The passcode you entered is invalid or expired. Please re-check.');
    }
  };

  // Sign up Step 2: Set password and submit register
  const handleCompleteRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password.trim() || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters for partner security.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Confirm password does not match with security password.');
      return;
    }

    setLoading(true);
    const result = await registerUser(name, email, password, phone);
    setLoading(false);

    if (result === true) {
      navigateTo('home');
    } else {
      setErrorMsg(result as string);
    }
  };

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const inputVal = loginPhone.trim();
    if (!inputVal) {
      setErrorMsg('Please enter your registered Email address or Mobile number.');
      return;
    }

    const isEmailInput = inputVal.includes('@');
    if (!isEmailInput) {
      const cleanInput = inputVal.replace(/\D/g, '');
      if (!cleanInput || cleanInput.length < 10) {
        setErrorMsg('Please specify a valid register email or mobile number with country code.');
        return;
      }
    }

    if (!loginPassword.trim()) {
      setErrorMsg('Security password is required.');
      return;
    }

    setLoading(true);
    const result = await loginUser(inputVal, loginPassword);
    setLoading(false);

    if (result === true) {
      navigateTo('home');
    } else {
      setErrorMsg(result as string);
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
            {isRegister ? 'Reseller Account Setup' : 'Welcome to VELRIVA'}
          </h2>
          <p className="text-xs text-slate-500 max-w-[260px] mx-auto mt-1.5 leading-relaxed">
            {isRegister
              ? 'Join our bulk orders portal. Get instant Email OTP status verification.'
              : 'Sign in using your password & registered Email or Mobile number.'}
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
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              !isRegister
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            Sign In Now
          </button>
          
          <button
            id="tab-register-btn"
            type="button"
            onClick={() => {
              setIsRegister(true);
              setRegStep(0);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              isRegister
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Action form cards */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          
          {/* A. REGISTER FLOW */}
          {isRegister && (
            <div className="space-y-4">
              
              {/* Stepper tracker */}
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-100 mb-1">
                <span className="text-[10px] font-black uppercase text-indigo-600">Reseller Registration</span>
                <span className="text-[10px] font-bold text-slate-400">Step {regStep + 1} of 3</span>
              </div>

              {/* Step 0: Initial info to request OTP */}
              {regStep === 0 && (
                <div className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Full Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                      <input
                        id="register-name-field"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Zain Ul Amaan"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition animate-fadeIn"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Email Address (For Secure Auth OTP)</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
                      <input
                        id="register-email-field"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. zainulamaan4@gmail.com"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
                      />
                    </div>
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      WhatsApp / Mobile Number (With Country Code)
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

                  {errorMsg && (
                    <div className="text-[11px] font-semibold text-rose-500 bg-rose-50 p-3 rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    onClick={handleSendOtpRegister}
                    disabled={loading || !phone.trim() || !name.trim() || !email.trim()}
                    className="w-full rounded-xl bg-slate-950 text-white py-3.5 text-xs font-black hover:bg-slate-900 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? 'Sending OTP...' : 'Send Email OTP (Supabase)'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Step 1: Verification of code */}
              {regStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-slate-50 p-3 rounded-xl text-center">
                    <p className="text-[11px] text-slate-600 font-medium">
                      An OTP verification code was dispatched via Email to:
                    </p>
                    <p className="font-extrabold text-indigo-650 text-xs mt-1">{email}</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                      <input
                        id="verify-otp-field"
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                        placeholder="6-Digit OTP"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-black tracking-widest text-center text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
                      />
                    </div>
                  </div>

                  {devOtpHint && (
                    <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex flex-col gap-1">
                      <div className="flex items-center gap-1 font-bold text-xs">⚡ Live OTP Passcode</div>
                      <p className="text-[10px] text-emerald-700 font-medium">
                        If Supabase Auth is not fully configured, fall back to offline OTP: <strong>{devOtpHint}</strong>
                      </p>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="text-[11px] font-semibold text-rose-500 bg-rose-50 p-3 rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(0)}
                      className="rounded-xl border border-slate-200 text-slate-700 px-4 py-3.5 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-center cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>

                    <button
                      onClick={handleVerifyOtpRegister}
                      disabled={loading || otpCode.length < 4}
                      className="flex-1 rounded-xl bg-slate-950 text-white py-3.5 text-xs font-black hover:bg-slate-900 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span>{loading ? 'Confirming...' : 'Verify Secure OTP'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Choose password to complete */}
              {regStep === 2 && (
                <form onSubmit={handleCompleteRegister} className="space-y-4 animate-fadeIn">
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-[11px] font-bold">Email verified successfully via OTP! Complete setup.</span>
                  </div>

                  {/* Password Entry */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Create Your Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                      <input
                        id="register-password-field"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Choose security password"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Confirm Security Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                      <input
                        id="register-confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter security password"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="text-[11px] font-semibold text-rose-500 bg-rose-50 p-3 rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !password.trim()}
                    className="w-full rounded-xl bg-slate-950 text-white py-3.5 text-xs font-black hover:bg-slate-900 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{loading ? 'Creating Account...' : 'Set Password & Complete Setup'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}

            </div>
          )}

          {/* B. LOGIN FLOW */}
          {!isRegister && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Phone / Email Field */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Email Address or Registered Mobile Number
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="login-phone-field"
                    type="text"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="e.g. zainulamaan4@gmail.com or 919690986010"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition animate-fadeIn"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Security Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="login-password-field"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-[11px] font-black text-rose-500 bg-rose-50/70 border border-rose-100 p-3 rounded-xl flex items-start gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                id="login-submit-button"
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-950 text-white py-3.5 text-xs font-black hover:bg-slate-900 transition active:scale-[0.98] shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Processing...' : 'Verify & Sign In'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

        </div>
      </div>

      {/* Stability Notification Footer block */}
      <div className="max-w-sm mx-auto w-full mt-8">
        <div className="flex items-center gap-2.5 text-[10px] font-black text-indigo-700 uppercase tracking-wide bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-100/50">
          <Sparkles className="h-4.5 w-4.5 text-indigo-500 fill-indigo-100 shrink-0 animate-pulse" />
          <span>Automatic WhatsApp alert notification dispatched on logins & orders securely.</span>
        </div>
      </div>
    </div>
  );
};
