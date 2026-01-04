'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ReferralPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get('ref');

  useEffect(() => {
    if (!ref) {
      router.replace('/');
      return;
    }

    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /android/i.test(userAgent);

    const appDeepLink = `beafox://invite?ref=${encodeURIComponent(ref)}`;

    // Try to open the app via deep link
    window.location.href = appDeepLink;

    // Fallback to stores
    const timeoutId = window.setTimeout(() => {
      if (isIOS) {
        window.location.href = 'https://apps.apple.com/app/id6746110612';
      } else if (isAndroid) {
        window.location.href =
          'https://play.google.com/store/apps/details?id=com.tapelea.beafox';
      } else {
        router.replace('/');
      }
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [ref, router]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <p>BeAFox wird geöffnet...</p>
      <p style={{ fontSize: '14px', color: '#666' }}>
        Falls die App nicht automatisch öffnet, wirst du zum App Store
        weitergeleitet.
      </p>
    </div>
  );
}


