/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { unoptimized: true },
    output: 'export',
    distDir: './build',
}

export default nextConfig