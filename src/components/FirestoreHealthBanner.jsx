import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, CheckCircle2, RefreshCw, ExternalLink, Copy, Check, ShieldAlert } from 'lucide-react';

const FIRESTORE_RULES_SNIPPET = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

export const FirestoreHealthBanner = () => {
  const { firestoreHealth, retryFirestoreConnection, showToast } = useApp();
  const [isCopied, setIsCopied] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  if (firestoreHealth?.healthy) {
    return (
      <div style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 12,
        padding: '10px 16px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        color: '#166534',
        fontWeight: 600
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={16} color="#16a34a" />
          <span>Firebase Database Live & Operational (Customer Orders Syncing)</span>
        </div>
        <button
          onClick={async () => {
            setIsRetrying(true);
            await retryFirestoreConnection();
            setIsRetrying(false);
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.78rem'
          }}
        >
          <RefreshCw size={13} className={isRetrying ? 'spin' : ''} /> Check
        </button>
      </div>
    );
  }

  const handleCopyRules = () => {
    navigator.clipboard.writeText(FIRESTORE_RULES_SNIPPET);
    setIsCopied(true);
    showToast('📋 Firestore Rules copied to clipboard!');
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    await retryFirestoreConnection();
    setIsRetrying(false);
  };

  const isPermDenied = firestoreHealth?.error?.code === 'permission-denied';

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fff1f2 0%, #fee2e2 100%)',
      border: '2px solid #ef4444',
      borderRadius: 14,
      padding: '16px 20px',
      marginBottom: 22,
      boxShadow: '0 4px 16px rgba(239, 68, 68, 0.15)',
      color: '#991b1b'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 280 }}>
          <div style={{
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#991b1b' }}>
              🚨 Database Permission Denied: Live Customer Orders Cannot Reach Backend
            </h4>
            <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#7f1d1d', lineHeight: 1.45 }}>
              Firebase is rejecting all reads and writes with <strong>Permission Denied</strong> (expired 30-day rules). When customers order on their phones, the order cannot be saved to the database or shown on your screen until the rules are updated.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            style={{
              background: '#991b1b',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '9px 14px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <RefreshCw size={14} className={isRetrying ? 'spin' : ''} />
            {isRetrying ? 'Checking...' : 'Test Connection'}
          </button>

          <a
            href="https://console.firebase.google.com/project/desieats-online/firestore/rules"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#ef4444',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 8,
              padding: '9px 14px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <ExternalLink size={14} /> Open Firebase Rules Console
          </a>
        </div>
      </div>

      {showInstructions && (
        <div style={{
          marginTop: 14,
          padding: 14,
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 10,
          border: '1px solid #fecaca',
          fontSize: '0.82rem',
          color: '#1f2937'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <strong style={{ color: '#991b1b', fontSize: '0.88rem' }}>
              ⚡ 3-Step Fix to enable live orders immediately (Takes 30 seconds):
            </strong>
            <button
              onClick={handleCopyRules}
              style={{
                background: isCopied ? '#16a34a' : '#1f2937',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              {isCopied ? <Check size={13} /> : <Copy size={13} />}
              {isCopied ? 'Copied Rules!' : 'Copy Working Rules'}
            </button>
          </div>

          <ol style={{ margin: '0 0 10px 18px', padding: 0, lineHeight: 1.6 }}>
            <li>
              Click <a href="https://console.firebase.google.com/project/desieats-online/firestore/rules" target="_blank" rel="noopener noreferrer" style={{ color: '#ef4444', fontWeight: 700 }}>Open Firebase Rules Console</a>.
            </li>
            <li>Select all text in the editor and replace it with the copied rules below.</li>
            <li>Click the blue <strong>"Publish"</strong> button in Firebase Console, then click <strong>"Test Connection"</strong> above.</li>
          </ol>

          <pre style={{
            background: '#111827',
            color: '#4ade80',
            padding: 10,
            borderRadius: 8,
            fontSize: '0.75rem',
            overflowX: 'auto',
            margin: 0
          }}>
            {FIRESTORE_RULES_SNIPPET}
          </pre>
        </div>
      )}
    </div>
  );
};
