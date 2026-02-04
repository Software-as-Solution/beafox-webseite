"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

function UnsubscribeContent() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Abmeldung per Link: ?email=... → automatisch abmelden
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get("email")?.trim();
    if (!emailFromUrl || status !== "idle") return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailFromUrl)) {
      setStatus("error");
      setMessage("Die E-Mail-Adresse im Link ist ungültig. Bitte nutze das Formular unten.");
      return;
    }

    setStatus("loading");
    fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailFromUrl }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.error || "Abmeldung fehlgeschlagen.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Ein Fehler ist aufgetreten. Bitte schreibe uns an info@beafox.app.");
      });
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Du bist abgemeldet.");
      } else {
        setStatus("error");
        setMessage(data.error || "Abmeldung fehlgeschlagen.");
      }
    } catch {
      setStatus("error");
      setMessage("Ein Fehler ist aufgetreten. Bitte schreibe uns an info@beafox.app.");
    }
  };

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center px-6 py-16">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primaryOrange/10">
            <Mail className="h-7 w-7 text-primaryOrange" />
          </div>
        </div>
        <h1 className="text-center text-2xl font-bold text-gray-900">
          Newsletter abmelden
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Du wirst vom BeAFox-Newsletter abgemeldet. Wir benachrichtigen info@beafox.app, damit wir dich aus dem Verteiler entfernen.
        </p>

        {status === "loading" && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primaryOrange" />
            <p className="text-sm text-gray-600">Abmeldung wird durchgeführt…</p>
          </div>
        )}

        {status === "success" && (
          <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 shrink-0 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Abmeldung erfolgreich</p>
                <p className="mt-1 text-sm text-green-700">{message}</p>
              </div>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </div>
        )}

        {status === "idle" && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="unsubscribe-email" className="block text-sm font-medium text-gray-700 mb-1">
                Deine E-Mail-Adresse
              </label>
              <input
                id="unsubscribe-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primaryOrange focus:outline-none focus:ring-2 focus:ring-primaryOrange/20"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primaryOrange px-6 py-3 text-sm font-semibold text-white transition hover:bg-primaryOrange/90 focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2"
            >
              Vom Newsletter abmelden
            </button>
          </form>
        )}

        <p className="mt-8 text-center">
          <Link href="/" className="text-sm font-medium text-primaryOrange hover:underline">
            Zurück zur Startseite
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primaryOrange" />
        </main>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
