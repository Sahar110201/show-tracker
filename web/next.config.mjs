/** @type {import('next').NextConfig} */
const nextConfig = {
  //Cache Components are off. Next.js 16.4 turns them on by default for new apps.
  cacheComponents: false,

  // Stops `next dev` from writing AGENTS.md and CLAUDE.md into the project.
  agentRules: false,

  // Sends /api/... requests to the Express API. The address comes from .env.local.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;