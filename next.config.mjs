const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/rss', destination: '/api/rss' },
      { source: '/sitemap.xml', destination: '/api/sitemap' },
      { source: '/robots.txt', destination: '/api/robots' }
    ];
  }
};

export default nextConfig;
