const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#eef2ff"/>
      <stop offset="100%" stop-color="#dde3f5"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <g transform="translate(200,185)">
    <polygon points="0,-65 56,-32 56,32 0,65 -56,32 -56,-32" fill="#c7d2fe" stroke="#818cf8" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="0,-65 56,-32 0,0 -56,-32" fill="#a5b4fc" stroke="#818cf8" stroke-width="3" stroke-linejoin="round"/>
    <line x1="0" y1="0" x2="0" y2="65" stroke="#818cf8" stroke-width="3"/>
  </g>
  <text x="200" y="298" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" fill="#818cf8" letter-spacing="1">No Image</text>
</svg>`;

export const PRODUCT_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(svg)}`;

export const handleImageError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = PRODUCT_PLACEHOLDER;
};
