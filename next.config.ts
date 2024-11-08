const nextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: "annotation",
    },
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
