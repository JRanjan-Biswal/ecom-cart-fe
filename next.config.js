/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: 'https://ecom-cart-be-dphn.vercel.app/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

