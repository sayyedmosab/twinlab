// This file has been disabled due to critical performance issues:
// 1. 100 particles created causing memory leaks
// 2. Infinite requestAnimationFrame loop causing 60+ fps React re-renders
// 3. setCubeRotation() being called continuously during drag operations
//
// Use the clean CosmicLandingPage.tsx instead.
//
// Performance killers that were removed:
// - Lines 82-125: particles state with 100 particle objects
// - Lines 154-159: infinite animate() loop with setCubeRotation()
//
// This file is now disabled to prevent accidental usage.

export function CosmicLandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Component Disabled</h1>
        <p className="text-gray-400">
          This component contained critical performance issues and has been disabled.
          <br />
          Use the main CosmicLandingPage.tsx instead.
        </p>
      </div>
    </div>
  );
}