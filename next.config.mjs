/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'shrug-person-78902957.figma.site' },
      { protocol: 'https', hostname: 'motionsites.ai' },
      { protocol: 'https', hostname: 'images.higgs.ai' },
      { protocol: 'https', hostname: 'd8j0ntlcm91z4.cloudfront.net' },
    ],
  },
};

export default nextConfig;
