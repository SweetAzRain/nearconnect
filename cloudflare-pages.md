# Cloudflare Pages Deployment Instructions

## Quick Setup

1. **Fork/Clone** this repository to your GitHub account

2. **Connect to Cloudflare Pages:**
   - Go to Cloudflare Dashboard > Pages
   - Click "Create a project" > "Connect to Git"
   - Select your repository

3. **Configure Build Settings:**
   ```
   Build command: npx vite build --config vite.config.static.ts
   Build output directory: dist/public
   Root directory: (leave empty)
   Node.js version: 18.x or higher
   ```

4. **Environment Variables** (optional):
   - No environment variables required for basic functionality
   - NEAR Connect library will work with mainnet/testnet automatically

## Files Structure

- `_routes.json` - Configures client-side routing for SPA
- `build-static.sh` - Optional build script for manual deployment
- `vite.config.static.ts` - Static build configuration

## Build Process

The build process:
1. Installs dependencies with `npm install`
2. Builds React client app with Vite using static config
3. Outputs static files to `dist/public/` directory
4. `_routes.json` handles SPA routing for React Router
5. All assets are optimized and ready for CDN delivery

## Features Included

✅ **Full NEAR Connect Integration** - Real wallet connections
✅ **Session Persistence** - localStorage-based session management  
✅ **Network Switching** - Mainnet/Testnet support
✅ **Transaction Demo** - Message signing and transaction interfaces
✅ **Activity Logging** - Complete interaction history
✅ **Responsive Design** - Works on desktop and mobile
✅ **Real Wallet Support** - Connects to actual NEAR wallets

## Testing

After deployment:
1. Visit your Cloudflare Pages URL
2. Click "Connect Wallet" 
3. Choose your NEAR wallet (MyNearWallet, HERE Wallet, etc.)
4. Test message signing and transaction features
5. Verify session persistence by refreshing the page

## Troubleshooting

- **Blank page**: Check build logs for CSS/JS errors
- **Routing issues**: Verify `_routes.json` is in root directory
- **Wallet connection fails**: Check browser console for errors
- **Build fails**: Ensure Node.js version is 18+ in Cloudflare settings

The app is fully functional with real NEAR wallet integration - no mock data or demo wallets.