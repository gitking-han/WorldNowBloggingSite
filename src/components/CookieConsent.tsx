'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, Settings2 } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  ads: boolean;
}

const STORAGE_KEY = 'worldnow_cookie_consent';

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: true,
  ads: true,
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setIsVisible(true);
        return;
      }

      const parsed = JSON.parse(saved) as CookiePreferences;
      setPreferences({
        necessary: true,
        analytics: Boolean(parsed.analytics),
        ads: Boolean(parsed.ads),
      });
    } catch {
      setIsVisible(true);
    }
  }, []);

  const savePreferences = (nextPreferences: CookiePreferences) => {
    const consentValue = {
      ...nextPreferences,
      necessary: true,
      timestamp: new Date().toISOString(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consentValue));
    document.cookie = `worldnow_cookie_consent=${encodeURIComponent(
      JSON.stringify(consentValue)
    )}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    setPreferences(nextPreferences);
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    savePreferences({ necessary: true, analytics: true, ads: true });
  };

  const handleEssentialOnly = () => {
    savePreferences({ necessary: true, analytics: false, ads: false });
  };

  const consentLabel = useMemo(() => {
    if (!preferences.analytics && !preferences.ads) return 'Essential only';
    if (preferences.analytics && preferences.ads) return 'All accepted';
    return 'Custom choices';
  }, [preferences]);

  return (
    <>
      {isVisible && (
        <section className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-3xl border border-[#e6ddcf] bg-[#0d0d0d] text-white shadow-2xl shadow-black/25">
            <div className="grid gap-6 p-5 md:grid-cols-[1.1fr_0.9fr] md:p-6">
              <div>
                <div className="flex items-center gap-2 text-[#f2d598] text-[11px] uppercase tracking-[0.25em] font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Cookie & privacy settings
                </div>

                <h2 className="mt-3 text-xl font-serif font-semibold text-white">
                  We use cookies to improve trust, performance, and monetization.
                </h2>

                <p className="mt-3 text-sm text-gray-200 leading-relaxed">
                  Essential cookies keep the site secure, while optional analytics
                  and advertising cookies help us understand usage and support
                  publisher tools such as AdSense.
                </p>

                <p className="mt-2 text-xs text-gray-300">
                  You can change your choice later from footer settings.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-white">
                    Preferences
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowDetails((prev) => !prev)}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-gray-200 hover:border-[#b5150e] hover:text-white"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    {showDetails ? 'Hide' : 'Customize'}
                  </button>
                </div>

                {showDetails && (
                  <div className="mt-4 space-y-3 text-sm">
                    {[
                      [
                        'necessary',
                        'Essential',
                        'Required for security and site operation.',
                      ],
                      [
                        'analytics',
                        'Analytics',
                        'Helps improve content and traffic insights.',
                      ],
                      [
                        'ads',
                        'Advertising',
                        'Supports monetization through ads.',
                      ],
                    ].map(([key, label, explanation]) => (
                      <label
                        key={key}
                        className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/30 p-3"
                      >
                        <span>
                          <strong className="text-white block">{label}</strong>
                          <span className="text-xs text-gray-300">
                            {explanation}
                          </span>
                        </span>

                        <input
                          type="checkbox"
                          checked={
                            key === 'necessary'
                              ? true
                              : preferences[key as keyof CookiePreferences]
                          }
                          disabled={key === 'necessary'}
                          onChange={(e) => {
                            if (key === 'necessary') return;
                            setPreferences((prev) => ({
                              ...prev,
                              [key]: e.target.checked,
                            }));
                          }}
                          className="mt-1 h-4 w-4 rounded border-gray-600 text-[#b5150e] focus:ring-[#b5150e]"
                        />
                      </label>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="rounded-full bg-[#b5150e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#8a0f09]"
                  >
                    Accept all
                  </button>

                  <button
                    type="button"
                    onClick={handleEssentialOnly}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Essential only
                  </button>

                  <button
                    type="button"
                    onClick={() => savePreferences(preferences)}
                    className="rounded-full border border-[#f2d598] bg-[#f2d598]/10 px-4 py-2.5 text-sm font-semibold text-[#f2d598] hover:bg-[#f2d598]/20"
                  >
                    Save choices
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}