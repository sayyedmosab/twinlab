# TwinLab Development Guidelines

## Three.js and React Three Fiber Guidelines

### Bump Mapping Best Practices

#### **CRITICAL: Proper Bump Map Configuration**
To achieve visible bump mapping effects in Three.js materials, follow these essential settings:

#### **Material Properties for Maximum Bump Visibility**
```typescript
// ✅ CORRECT - Proven working bump mapping material (from successful project)
{
  color: yourColor,
  transparent: false,        // Essential for solid appearance
  opacity: 1.0,             // Full opacity
  depthWrite: true,         // CRITICAL: enables proper depth rendering
  depthTest: true,          // Proper depth ordering
  side: THREE.DoubleSide,   // Render both sides
  metalness: 0.25,          // Moderate metalness - shows bumps without over-reflection
  roughness: 0.5,           // Balanced surface - not too shiny, not too matte
  emissive: new THREE.Color(0x000000),  // No glow
  emissiveIntensity: 0.0,   // No glow intensity
  bumpMap: yourTexture,     // Your bump texture
  bumpScale: 1.0,           // Maximum bump effect
  polygonOffset: true,      // Anti z-fighting
  polygonOffsetFactor: -4,
  polygonOffsetUnits: -4,
}

// ❌ WRONG - Common mistakes that break rendering
{
  depthWrite: false,  // CAUSES TRANSPARENCY ISSUES
  metalness: 1.0,     // High reflectivity MASKS bump details
  roughness: 0.1,     // Too shiny - reflects environment instead of showing bumps
  transparent: true,  // Can cause rendering artifacts
}
```

#### **CRITICAL: Material Property Insights**
- **`depthWrite: true`** - ESSENTIAL to prevent transparency artifacts
- **`metalness: 0.25`** - Sweet spot that shows bumps without excessive reflection
- **`roughness: 0.5`** - Balanced surface that reveals bump detail through light interaction
- **`transparent: false` + `opacity: 1.0`** - Ensures solid, opaque rendering
- **`emissive: black` + `emissiveIntensity: 0.0`** - No glow to interfere with bump lighting
- High metalness (0.8-1.0) creates mirror reflections that mask bump details
- Low metalness with moderate roughness allows proper light-bump interaction

#### **Lighting Setup for Bump Visibility**
```typescript
// Optimal lighting configuration
<ambientLight intensity={0.1} />  {/* Very low ambient */}
<directionalLight 
  position={[10, 6, 8]}           {/* Angled directional light */}
  intensity={4}                   {/* Strong intensity */}
  castShadow 
/>
```

#### **Texture Configuration**
```typescript
// Proper texture setup for bump mapping
if (bumpTexture) {
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.RepeatWrapping;
  bumpTexture.repeat.set(1, 1);
  bumpTexture.generateMipmaps = true;
  bumpTexture.flipY = false;
}
```

#### **Three.js Version Requirements**
- **Use Three.js 0.180.0** via CDN for Figma Make compatibility
- Import via: `import * as THREE from 'https://unpkg.com/three@0.180.0/build/three.module.js'`
- Avoid npm packages - use direct CDN imports

#### **Performance Considerations**
- Use `meshPhysicalMaterial` for best bump map support
- High geometry subdivision (512x512 for spheres, 128x128x128 for cubes) for smooth bump appearance
- **`depthWrite: true`** is essential - setting to false causes transparency issues
- Use `polygonOffset` properties to prevent z-fighting without affecting depth rendering

#### **Common Mistakes to Avoid**
1. **Setting `depthWrite: false`** - CAUSES TRANSPARENCY ARTIFACTS - always use `true`
2. **Setting metalness too high** - values above 0.5 mask bump details with reflections
3. **Using `transparent: true` unnecessarily** - can cause rendering issues
4. **Forgetting emissive properties** - set to black/0.0 to prevent glow interference
5. **Using too low bumpScale** - use 1.0 for maximum effect
6. **Wrong texture repeating** - ensure proper wrapS/wrapT settings

#### **Reference Material from Successful Project**
```typescript
// This exact configuration is proven to work for solid, bump-mapped materials
const workingMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x0066CC),
    transparent: false,
    opacity: 1.0,
    depthWrite: true,        // CRITICAL
    depthTest: true,
    side: THREE.DoubleSide,
    metalness: 0.25,         // PROVEN VALUE
    roughness: 0.5,          // PROVEN VALUE
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0.0
});
```

**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
