const nextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: "annotation",
    },
  },
  // Configure image domains to avoid invalid src prop error
  images: {
    domains: ["utfs.io"],
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
