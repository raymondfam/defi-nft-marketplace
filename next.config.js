/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        loader: "akamai",
        path: "",
    },
    basePath: "/defi-nft-marketplace",
    assetPrefix: "/defi-nft-marketplace",
}

module.exports = nextConfig
