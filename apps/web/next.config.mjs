/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- AWS Deployment ---
  // "standalone" bundles only the required node_modules alongside the built app.
  // Required for efficient AWS Lambda (via Amplify SSR) or ECS/Fargate deployment.
  // The output is written to .next/standalone/
  output: "standalone",

  // Tell Next.js to transpile the local workspace packages through its compiler
  // so TypeScript source files (*.ts) are resolved correctly without a pre-build step.
  transpilePackages: ["@phm/database", "@phm/stripe", "@phm/types"],

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
