const removeImports = require("next-remove-imports")({});

/** @type {import('next').NextConfig} */
const nextConfig = removeImports();

module.exports = nextConfig;
