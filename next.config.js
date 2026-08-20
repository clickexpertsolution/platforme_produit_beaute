// URL du backend : REACT_APP_BACKEND_URL est la variable Coolify/production,
// BACKEND_URL est le fallback pour docker-compose (réseau interne).
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL

const nextConfig = {
  output: 'standalone',

  // Expose REACT_APP_BACKEND_URL au code client (navigateur) ET serveur.
  // Équivalent du REACT_APP_* de Create React App, mais pour Next.js.
  env: {
    REACT_APP_BACKEND_URL: BACKEND_URL || '',
  },

  // En production Docker, les appels /api/* sont proxifiés vers le backend Express.
  async rewrites() {
    if (!BACKEND_URL) return []
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${BACKEND_URL}/api/:path*`,
        },
      ],
    }
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
    ],
  },
  // Renamed from experimental.serverComponentsExternalPackages in Next 15
  serverExternalPackages: ['mongodb', 'emergentintegrations'],
  webpack(config, { dev }) {
    if (dev) {
      // Reduce CPU/memory from file watching
      config.watchOptions = {
        poll: 2000, // check every 2 seconds
        aggregateTimeout: 300, // wait before rebuilding
        ignored: ['**/node_modules'],
      };
    }
    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
          { key: "Access-Control-Allow-Origin", value: process.env.CORS_ORIGINS || "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
