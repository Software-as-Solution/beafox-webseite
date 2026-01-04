'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ReferralPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get('ref');
  const [copied, setCopied] = useState(false);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!ref) {
      router.replace('/');
      return;
    }

    // Try to open app first (Deep Link)
    const appDeepLink = `beafox://invite?ref=${encodeURIComponent(ref)}`;
    const link = document.createElement('a');
    link.href = appDeepLink;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Fallback to stores after delay
    const timer = window.setTimeout(() => {
      if (redirected) return;
      setRedirected(true);

      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      const isAndroid = /android/i.test(userAgent);

      if (isAndroid) {
        // Include Play Install Referrer param
        window.location.href = `https://play.google.com/store/apps/details?id=com.tapelea.beafox&referrer=ref%3D${encodeURIComponent(
          ref
        )}`;
      } else if (isIOS) {
        window.location.href = `https://apps.apple.com/app/id6746110612`;
      }
      // Desktop: stay on page to allow copy; no redirect to home
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [ref, router, redirected]);

  const copyCode = async () => {
    if (!ref) return;
    try {
      await navigator.clipboard.writeText(ref);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = ref;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!ref) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        BeAFox wird geöffnet...
      </h1>

      <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
        Falls die App nicht automatisch öffnet:
      </p>

      <div style={{
        margin: '20px 0',
        padding: '30px',
        border: '2px solid #007AFF',
        borderRadius: '12px',
        backgroundColor: '#f8f9fa',
        maxWidth: '400px',
        width: '100%'
      }}>
        <p style={{ fontSize: '16px', marginBottom: '10px', fontWeight: 600 }}>
          Dein Referral-Code:
        </p>
        <p style={{
          fontSize: '32px',
          fontWeight: 'bold',
          margin: '20px 0',
          letterSpacing: '2px',
          color: '#007AFF'
        }}>
          {ref}
        </p>
        <button
          onClick={copyCode}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
            color: 'white',
            backgroundColor: copied ? '#34C759' : '#007AFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {copied ? '✓ Kopiert!' : 'Code kopieren'}
        </button>
        <p style={{
          fontSize: '14px',
          color: '#666',
          marginTop: '20px',
          lineHeight: 1.5
        }}>
          Kopiere diesen Code und gib ihn beim ersten Start der App ein, um 250 Beeren zu erhalten!
        </p>
      </div>

      <p style={{ fontSize: '14px', color: '#999', marginTop: '30px' }}>
        Du wirst automatisch zum App Store weitergeleitet...
      </p>
    </div>
  );
}
 
