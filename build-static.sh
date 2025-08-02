#!/bin/bash
# Static build script for Cloudflare Pages deployment
# This builds only the client-side React app for static hosting

echo "Building static client for Cloudflare Pages..."

# Build the client app using custom vite config
npx vite build --config vite.config.static.ts

# Copy static files to root for Cloudflare Pages (optional)
# cp -r dist/public/* .
# cp dist/public/index.html ./index.html

echo "Static build complete. Files ready for Cloudflare Pages deployment."
echo "Upload the entire repository to Cloudflare Pages."
echo "Set build command: npx vite build --config vite.config.static.ts --emptyOutDir"
echo "Set build output directory: dist/public"