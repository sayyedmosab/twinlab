# Removed Components for Performance Cleanup

These components were removed to fix performance issues and iframe conflicts:

## Performance Issues Found:
- Multiple Canvas instances creating competing WebGL contexts
- Heavy shadow mapping (4096x4096) 
- Massive geometry (512x512 spheres, 128x128x128 cubes)
- Multiple Three.js imports causing conflicts
- Wrong material settings causing rendering issues

## Files Removed:
- Enhanced3DSphere.tsx - Uses ThreeJSWrapper (iframe issues)
- Enhanced3DTest.tsx - Multiple heavy 3D objects with wrong material settings
- ThreeJSWrapper.tsx - Creates additional Canvas instances
- TwinLabPhysicsSphere.tsx - Conflicting sphere component
- TextureManager.tsx - Unused texture management
- SimpleThreeDTest.tsx - Old test component
- ThreeDSphere.tsx - Old sphere implementation
- ThreeDTest.tsx - Old test file

## Only Keeping:
- CosmicLandingPage.tsx with optimized React Three Fiber sphere
- Single Canvas instance
- Proper material settings following Guidelines.md