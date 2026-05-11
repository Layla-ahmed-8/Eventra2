import React from 'react';

interface LogoProps {
  variant?: 'small' | 'horizontal' | 'large';
  className?: string;
}

export default function Logo({ variant = 'small', className = '' }: LogoProps) {
  if (variant === 'horizontal') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="180"
        height="52"
        viewBox="0 0 360 104"
        className={className}
      >
        <defs>
          <linearGradient id="gpin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C5CF6"/>
            <stop offset="100%" stopColor="#B57BFF"/>
          </linearGradient>
          <linearGradient id="ginner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C4CF1"/>
            <stop offset="100%" stopColor="#9B6CF7"/>
          </linearGradient>
          <linearGradient id="gtxt" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6C4CF1"/>
            <stop offset="100%" stopColor="#C084FC"/>
          </linearGradient>
        </defs>
        <ellipse cx="40" cy="96" rx="16" ry="4" fill="#6C4CF1" opacity="0.1"/>
        <path d="M40 2 C22 2 6 16 6 34 C6 57 40 96 40 96 C40 96 74 57 74 34 C74 16 58 2 40 2Z" fill="url(#gpin)"/>
        <path d="M40 10 C24 10 12 22 12 34 C12 52 24 70 32 82 C35 75 40 68 40 68 C40 68 45 75 48 82 C56 70 68 52 68 34 C68 22 56 10 40 10Z" fill="url(#ginner)" opacity="0.4"/>
        <circle cx="40" cy="34" r="16" fill="white" opacity="0.96"/>
        <rect x="31" y="25" width="18" height="2.5" rx="1.2" fill="#6C4CF1" opacity="0.2"/>
        <rect x="31" y="29.5" width="5.5" height="11" rx="1.8" fill="url(#ginner)"/>
        <rect x="38.5" y="29.5" width="9.5" height="5" rx="1.8" fill="url(#ginner)"/>
        <rect x="38.5" y="36" width="9.5" height="4.5" rx="1.8" fill="url(#ginner)" opacity="0.45"/>
        <circle cx="60" cy="18" r="4" fill="#E879F9"/>
        <circle cx="68" cy="30" r="2.8" fill="#C084FC" opacity="0.85"/>
        <circle cx="64" cy="8" r="2.2" fill="#E879F9" opacity="0.8"/>
        <circle cx="74" cy="18" r="1.3" fill="#B57BFF" opacity="0.6"/>
        <line x1="60" y1="18" x2="68" y2="30" stroke="#C084FC" strokeWidth="1.3" opacity="0.5"/>
        <line x1="60" y1="18" x2="64" y2="8" stroke="#E879F9" strokeWidth="1.3" opacity="0.5"/>
        <line x1="64" y1="8" x2="74" y2="18" stroke="#B57BFF" strokeWidth="1" opacity="0.35"/>
        <text x="88" y="54" fontFamily="'Poppins', sans-serif" fontSize="42" fontWeight="800" letterSpacing="-2" fill="url(#gtxt)">eventra</text>
        <circle cx="298" cy="37" r="6" fill="#C084FC"/>
      </svg>
    );
  }

  if (variant === 'large') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1024"
        height="1024"
        viewBox="0 0 1024 1024"
        className={className}
      >
        <defs>
          <linearGradient id="gbg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C5CF6"/>
            <stop offset="100%" stopColor="#B57BFF"/>
          </linearGradient>
          <linearGradient id="ginner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C4CF1"/>
            <stop offset="100%" stopColor="#9B6CF7"/>
          </linearGradient>
        </defs>
        <rect width="1024" height="1024" rx="230" fill="url(#gbg)"/>
        <ellipse cx="512" cy="900" rx="180" ry="45" fill="#5530C8" opacity="0.35"/>
        <path d="M512 120 C340 120 180 260 180 400 C180 580 512 900 512 900 C512 900 844 580 844 400 C844 260 684 120 512 120Z" fill="white" opacity="0.18"/>
        <circle cx="512" cy="400" rx="160" ry="160" r="160" fill="white" opacity="0.96"/>
        <rect x="400" y="290" width="224" height="30" rx="15" fill="#6C4CF1" opacity="0.18"/>
        <rect x="400" y="336" width="76" height="148" rx="22" fill="url(#ginner)"/>
        <rect x="492" y="336" width="132" height="66" rx="22" fill="url(#ginner)"/>
        <rect x="492" y="418" width="132" height="62" rx="22" fill="url(#ginner)" opacity="0.45"/>
        <circle cx="730" cy="248" r="52" fill="white" opacity="0.9"/>
        <circle cx="810" cy="370" r="36" fill="white" opacity="0.65"/>
        <circle cx="768" cy="140" r="28" fill="white" opacity="0.75"/>
        <circle cx="836" cy="248" r="18" fill="white" opacity="0.5"/>
        <circle cx="704" cy="174" r="18" fill="white" opacity="0.6"/>
        <line x1="730" y1="248" x2="810" y2="370" stroke="white" strokeWidth="16" opacity="0.4"/>
        <line x1="730" y1="248" x2="768" y2="140" stroke="white" strokeWidth="16" opacity="0.4"/>
        <line x1="768" y1="140" x2="836" y2="248" stroke="white" strokeWidth="12" opacity="0.3"/>
        <line x1="730" y1="248" x2="704" y2="174" stroke="white" strokeWidth="12" opacity="0.3"/>
        <line x1="704" y1="174" x2="768" y2="140" stroke="white" strokeWidth="10" opacity="0.25"/>
      </svg>
    );
  }

  // Default small variant
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="56"
      viewBox="0 0 96 112"
      className={className}
    >
      <defs>
        <linearGradient id="gpin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C5CF6"/>
          <stop offset="100%" stopColor="#B57BFF"/>
        </linearGradient>
        <linearGradient id="ginner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6C4CF1"/>
          <stop offset="100%" stopColor="#9B6CF7"/>
        </linearGradient>
      </defs>
      <ellipse cx="48" cy="105" rx="18" ry="5" fill="#6C4CF1" opacity="0.12"/>
      <path d="M48 3 C27 3 8 20 8 41 C8 67 48 105 48 105 C48 105 88 67 88 41 C88 20 69 3 48 3Z" fill="url(#gpin)"/>
      <path d="M48 11 C30 11 14 26 14 41 C14 59 28 79 38 93 C42 85 48 76 48 76 C48 76 54 85 58 93 C68 79 82 59 82 41 C82 26 66 11 48 11Z" fill="url(#ginner)" opacity="0.4"/>
      <circle cx="48" cy="41" r="20" fill="white" opacity="0.96"/>
      <rect x="37" y="31" width="22" height="3" rx="1.5" fill="#6C4CF1" opacity="0.2"/>
      <rect x="37" y="36" width="7" height="13" rx="2" fill="url(#ginner)"/>
      <rect x="46" y="36" width="13" height="6" rx="2" fill="url(#ginner)"/>
      <rect x="46" y="44" width="13" height="5" rx="2" fill="url(#ginner)" opacity="0.45"/>
      <circle cx="72" cy="22" r="5" fill="#E879F9"/>
      <circle cx="80" cy="35" r="3.5" fill="#C084FC" opacity="0.85"/>
      <circle cx="76" cy="10" r="2.8" fill="#E879F9" opacity="0.8"/>
      <circle cx="85" cy="22" r="1.6" fill="#B57BFF" opacity="0.6"/>
      <line x1="72" y1="22" x2="80" y2="35" stroke="#C084FC" strokeWidth="1.5" opacity="0.5"/>
      <line x1="72" y1="22" x2="76" y2="10" stroke="#E879F9" strokeWidth="1.5" opacity="0.5"/>
      <line x1="76" y1="10" x2="85" y2="22" stroke="#B57BFF" strokeWidth="1.2" opacity="0.35"/>
    </svg>
  );
}