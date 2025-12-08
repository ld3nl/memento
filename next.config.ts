const nextConfig = {
  reactCompiler: {
    compilationMode: "annotation",
  },
  // Configure image domains to avoid invalid src prop error
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots", // Correctly specify the destination for the robots.txt route
      },
    ];
  },
};

module.exports = nextConfig;
