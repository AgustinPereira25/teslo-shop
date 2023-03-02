/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 1000, //Agregado para que Render solucione el error
}

module.exports = nextConfig
