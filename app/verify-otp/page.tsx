"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const INK = "#111111";
const MINT = "#8fd6a8";
const CREAM = "#fdfaf1";
const YELLOW = "#ffd93d";
const CORAL = "#f28482";

const OTP_COOLDOWN = 60; // detik

export default function VerifyOTPPage() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- UI only: cooldown 60 detik untuk resend OTP ---
  const [cooldown, setCooldown] = useState(OTP_COOLDOWN);
  const [resending, setResending] = useState(false);
  const [info, setInfo] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCooldown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("otp-email");
    const savedPassword = sessionStorage.getItem("otp-password");

    if (!savedEmail || !savedPassword) {
      router.replace("/login");
      return;
    }

    setEmail(savedEmail);
    setPassword(savedPassword);
  }, [router]);

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "OTP tidak valid.");
        return;
      }

      const login = await signIn("credentials", {
        email,
        password,
        verified2fa: "true",
        redirect: false,
      });
      console.log("LOGIN RESULT:", login);

      if (login?.error) {
        setError("Login gagal.");
        return;
      }

      sessionStorage.removeItem("otp-email");
      sessionStorage.removeItem("otp-password");

      router.replace("/");
    } catch (err) {
      setError("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  // Kirim ulang OTP — pakai endpoint pengiriman OTP yang sudah ada.
  // Ganti URL di bawah kalau endpoint kamu namanya beda.
  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError("");
    setInfo("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Gagal mengirim ulang OTP.");
        return;
      }

      setInfo("Kode baru sudah dikirim ke email kamu!");
      setCooldown(OTP_COOLDOWN);
    } catch {
      setError("Gagal mengirim ulang OTP.");
    } finally {
      setResending(false);
    }
  };

  const mm = String(Math.floor(cooldown / 60)).padStart(2, "0");
  const ss = String(cooldown % 60).padStart(2, "0");

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-6"
      style={{ background: MINT, color: INK }}
    >
      {/* stiker dekoratif */}
      <div
        className="pointer-events-none absolute left-8 top-10 hidden rotate-[-12deg] rounded-full border-[2.5px] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] md:block"
        style={{ background: YELLOW, borderColor: INK, boxShadow: `4px 4px 0 ${INK}` }}
      >
        ✉︎ secure login
      </div>
      <div
        className="pointer-events-none absolute bottom-12 right-10 hidden rotate-[9deg] rounded-full border-[2.5px] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] md:block"
        style={{ background: CORAL, borderColor: INK, boxShadow: `4px 4px 0 ${INK}` }}
      >
        ♡ cardify
      </div>

      <div
        className="relative w-full max-w-md rounded-[28px] border-[2.5px] p-8"
        style={{ background: CREAM, borderColor: INK, boxShadow: `8px 8px 0 ${INK}` }}
      >
        {/* badge atas */}
        <div
          className="absolute -top-4 left-8 rotate-[-3deg] rounded-full border-[2.5px] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]"
          style={{ background: YELLOW, borderColor: INK, boxShadow: `3px 3px 0 ${INK}` }}
        >
          step 2 / 2
        </div>

        <p className="mt-2 text-center text-[10px] font-black uppercase tracking-[0.3em]">
          — one time password —
        </p>

        <h1
          className="mt-3 text-center text-4xl font-black uppercase leading-none"
          style={{
            fontFamily: "'Boldonse', 'Archivo Black', sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          Verify OTP
        </h1>

        <p className="mt-3 text-center text-sm font-medium leading-relaxed">
          Masukkan kode OTP yang dikirim ke email kamu.
        </p>

        {email && (
          <p className="mt-1 text-center text-sm font-black break-all">{email}</p>
        )}

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          className="mt-7 w-full rounded-2xl border-[2.5px] bg-white px-4 py-4 text-center text-3xl font-black tracking-[10px] outline-none transition-transform focus:-translate-y-0.5"
          style={{ borderColor: INK, color: INK, boxShadow: `4px 4px 0 ${INK}` }}
        />

        {/* cooldown */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-[11px] font-black uppercase tracking-[0.15em]">
            {cooldown > 0 ? `Kirim ulang dalam ${mm}:${ss}` : "Belum dapat kodenya?"}
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="rounded-full border-[2.5px] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] transition-all disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:-translate-y-0.5"
            style={{
              background: cooldown > 0 ? "transparent" : YELLOW,
              borderColor: INK,
              color: INK,
              boxShadow: cooldown > 0 ? "none" : `3px 3px 0 ${INK}`,
            }}
          >
            {resending ? "Sending..." : "Resend"}
          </button>
        </div>

        {/* progress bar cooldown */}
        <div
          className="mt-3 h-2.5 w-full overflow-hidden rounded-full border-[2.5px]"
          style={{ borderColor: INK, background: "#ffffff" }}
        >
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{
              width: `${((OTP_COOLDOWN - cooldown) / OTP_COOLDOWN) * 100}%`,
              background: MINT,
            }}
          />
        </div>

        {error && (
          <div
            className="mt-4 rounded-2xl border-[2.5px] px-4 py-3 text-sm font-bold"
            style={{ background: CORAL, borderColor: INK, color: INK }}
          >
            {error}
          </div>
        )}

        {info && !error && (
          <div
            className="mt-4 rounded-2xl border-[2.5px] px-4 py-3 text-sm font-bold"
            style={{ background: MINT, borderColor: INK, color: INK }}
          >
            {info}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="mt-6 w-full rounded-full border-[2.5px] py-4 text-sm font-black uppercase tracking-[0.2em] transition-all disabled:opacity-60 enabled:hover:-translate-y-1"
          style={{
            background: INK,
            color: CREAM,
            borderColor: INK,
            boxShadow: `5px 5px 0 ${CORAL}`,
          }}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="mt-5 text-center text-[11px] font-bold uppercase tracking-[0.15em] opacity-70">
          kode berlaku terbatas · jangan bagikan ke siapa pun
        </p>
      </div>
    </main>
  );
}
