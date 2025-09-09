# Cleanup Note

## Files Organized:

1. **knowledgeDomains.json** - Moved from root to `/data/knowledgeDomains.json` where it belongs with other data files
2. **CosmicLandingPage1.tsx** - Removed duplicate file (was backup with particles that caused performance issues)
3. **Fetch path updated** - CosmicLandingPage.tsx now fetches from `./data/knowledgeDomains.json`

## Image Paths:
The figma:asset paths in the JSON are correct and will work from any location since they're absolute asset references.

## Current Structure:
- `/data/knowledgeDomains.json` - Knowledge domains data (moved here)
- `/data/mockData.ts` - Mock data for the main application
- `/components/CosmicLandingPage.tsx` - Cosmic landing page (optimized, no particles)
- All image references use `figma:asset/` paths which are location-independent