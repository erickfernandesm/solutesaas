/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gera um site estático em /out, pronto para qualquer hospedagem (Hostinger, Vercel, Netlify, IIS).
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
