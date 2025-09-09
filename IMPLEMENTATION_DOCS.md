# TwinLab Implementation Documentation

## Project Overview
TwinLab is a knowledge hub for a mixed community of architects and learners focused on digital twins of organizations, structured around 4 chapters with 4 episodes each containing 4 content pieces. The platform uses a spaceship command interface concept with a cosmic landing page entry point.

## Design System Requirements
- **Primary Font**: Inter (weights: 400,500,600,700,800,900) - applied via .font-inter class
- **Title Font**: Allerta Stencil - applied via .font-allerta class for "TwinLab" branding only
- **Typography**: Uses Tailwind v4 base layer typography - NO font-size, font-weight, or line-height Tailwind classes should be used unless explicitly requested
- **Color Scheme**: Bright white (#ffffff) and light blue glow (rgba(59, 130, 246, 0.6-0.8)), professional sharp-edged icons
- **Chapter Gradients**: 4 specific purple gradients (see exact specifications below)
- **Visual Elements**: Thin panel edges, panel bolts, neon light tracks, Rusty Silver colored frames
- **Content Displays**: Different displays for different media types (Audio 🎧, Video 🎥, Wiki 📚, Study Guide 📝)

## Exact Chapter Gradient Specifications
```css
Chapter 1: linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #9333EA 100%)
Chapter 2: linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #7C2D12 100%)  
Chapter 3: linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #5B21B6 100%)
Chapter 4: linear-gradient(135deg, #5B21B6 0%, #6D28D9 50%, #4C1D95 100%)
```

## Application Architecture

### Main App Structure (`/App.tsx`)
- **State Management**: Uses React useState for view management
  - `currentUser: User | null` - Authentication state
  - `isAuthModalOpen: boolean` - Controls AuthModal visibility
  - `currentView: AppView` - 'landing' | 'universe' | 'content'
  - `selectedContent: {content: ContentPiece, topic: Topic, domain: Domain} | null`
- **Navigation Flow**: 
  - Landing (CosmicLandingPage) → Universe (KnowledgeMapSpaceship) → Content (ContentViewer)
  - AuthModal overlays any view when `isAuthModalOpen === true`
- **Key Functions**:
  - `handleLogin()` - Sets user, navigates to 'universe'
  - `handleContentSelect()` - Sets content, navigates to 'content'  
  - `handleBackToMap()` - Clears content, returns to 'universe'
  - `handleEnterUniverse()` - Direct navigation to 'universe'
  - `handleBackToLanding()` - Returns to 'landing', clears content

### Current Views

#### 1. Landing View (`CosmicLandingPage`)
**Purpose**: Entry point with cosmic theme
**Props**: `onLoginClick: () => void`, `onEnterUniverse: () => void`

**Layout Structure**:
- Fixed cosmic background layer (z-0)
- Particle effects layer (z-10, pointer-events-none)
- Main content container (z-20, min-h-screen flex flex-col)

**Background System**:
- **Cosmic Background**: `cosmicBackground` figma asset, full viewport cover
  - `imageRendering: 'crisp-edges'`, `transform: 'scale(1.1)'`
  - Overlay: `bg-black/30` for readability enhancement
- **Animated Particles**: 100 particles, white circles with opacity 40%
  - Size: `Math.random() * 2 + 1` pixels
  - Position: Random 0-100% x/y
  - Speed: `Math.random() * 0.5 + 0.1`
  - Animation: Y: [0, -15, 0], opacity: [0.4, 0.8, 0.4]
  - Duration: `4 + particle.speed * 2` seconds
  - Delay: `particle.id * 0.15` seconds

**Header Section** (`pt-8 pb-8`):
- **Logo & Title**: 
  - Logo: `twinLabLogo` figma asset, `w-12 h-12`, cyan glow effect
  - Glow: `bg-cyan-400/20 rounded-full blur-lg animate-pulse`
  - Title: "TwinLab - The Future, Ready Today", `text-4xl font-allerta text-white tracking-wider`
- **Buttons**: 2 buttons, `px-8 py-3 border-2 border-white/30 text-white`
  - "LOGIN / REGISTER" - triggers `onLoginClick`
  - "CONTRIBUTE KNOWLEDGE" - triggers `onLoginClick`
  - Hover: `border-white/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm font-inter`

**Central HUD System**:
- **Container**: `max-w-4xl mx-auto px-8, flex items-center justify-center relative`
- **Rotating HUD**: `centralHUD` figma asset
  - Animation: `rotate: [0, 360]`, duration: 60s, repeat: Infinity, ease: "linear"
  - Transform: `scale(1.5)`, `imageRendering: 'crisp-edges'`
  - Positioning: `translate(${debugOffset.x}px, ${debugOffset.y}px)` where debugOffset = {x: -4, y: -28}

**Central Sphere** (Lines 295-424):
- **Position**: Absolute center of HUD, `top: '50%', left: '50%', transform: 'translate(-50%, -50%)'`
- **Size**: `${sphereSize * 4}px` where sphereSize = 32 (results in 128px)
- **Base Gradient**:
```css
background: `
  radial-gradient(ellipse at 30% 20%, #ffffff 0%, #e5e7eb 15%, #d1d5db 35%, #9ca3af 60%, #6b7280 80%, #4b5563 100%),
  radial-gradient(ellipse at 70% 80%, #374151 0%, #1f2937 30%, #111827 60%, #000000 100%),
  linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 25%, transparent 50%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0.6) 100%)
`
```
- **Box Shadow**:
```css
boxShadow: `
  inset -12px -12px 24px rgba(0,0,0,0.4),
  inset 12px 12px 24px rgba(255,255,255,0.6),
  inset 0 0 20px rgba(255,255,255,0.2)
`
```
- **Texture Layers**:
  1. Grid Surface: `sphereSurface` asset, opacity: 25%, mixBlendMode: 'multiply'
  2. Metallic Texture: `metallicTexture2` asset, opacity: 20%, mixBlendMode: 'soft-light'
  3. Primary Light: Positioned at `top: ${sphereSize * 0.15}px, left: ${sphereSize * 0.2}px`
     - Size: `${sphereSize * 1.2}px × ${sphereSize * 0.8}px`
     - Background: `radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 20%, rgba(255,255,255,0.3) 50%, transparent 80%)`
- **Interaction**: 
  - Mouse/touch drag to rotate on X/Y axes
  - Rotation speed: 0.5x sensitivity
  - Spring animation: stiffness: 200, damping: 30

**Knowledge Domain Spheres** (4 spheres):
- **Orbital System**: Radius 300px from center, Y positions reduced by 10% (`y * 0.9`)
- **Fixed Positions**: 
  - Chapter 1: 315° (top-left)
  - Chapter 2: 45° (top-right) 
  - Chapter 3: 135° (bottom-right)
  - Chapter 4: 225° (bottom-left)
- **Sphere Specs**: `w-48 h-48` (192px), `border-8 border-white`
  - Border glow: `boxShadow: '0 0 20px rgba(255, 255, 255, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3)'`
  - Background: Chapter-specific gradient (see gradient specifications)
- **Glow Animation**: 
  - Filter cycles: `drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))` to `drop-shadow(0 0 40px rgba(59, 130, 246, 0.8))`
  - Duration: 3s, delay: `index * 0.7`s
- **Content**: Figma icon asset + text overlay with `bg-black/20`

**Episode Cubes** (16 total, 4 per domain):
- **Orbital System**: 120px radius from each domain sphere center
- **Positioning**: 90° spacing (0°, 90°, 180°, 270° per sphere)
- **Size**: `w-8 h-8` (32px), `perspective: '200px'`
- **3D Structure**: 6 faces with `transformStyle: 'preserve-3d'`
  - Front: `translateZ(16px)`, gradient: `#ffffff 0%, #e5e7eb 50%, #d1d5db 100%`
  - Back: `translateZ(-16px) rotateY(180deg)`, gradient: `#d1d5db 0%, #9ca3af 50%, #6b7280 100%`
  - Right: `rotateY(90deg) translateZ(16px)`, gradient: `#e5e7eb 0%, #d1d5db 50%, #9ca3af 100%`
  - Left: `rotateY(-90deg) translateZ(16px)`, gradient: `#9ca3af 0%, #6b7280 50%, #4b5563 100%`
  - Top: `rotateX(90deg) translateZ(16px)`, gradient: `#ffffff 0%, #f3f4f6 50%, #e5e7eb 100%`
  - Bottom: Similar structure with darker gradients
- **Animations**:
  - Continuous rotation: `rotateY: [0, 360], rotateX: [0, 360]`, 8s linear infinite
  - Floating: `y: [0, -5, 0]`, 3s ease-in-out infinite, delay: `episodeIndex * 0.5`s
  - Hover: `scale: 1.2`
- **Interaction**: onClick sets `selectedCube: {chapterId, episodeId}` state

#### 2. Universe View (`KnowledgeMapSpaceship`)
**Purpose**: Main navigation interface
**Features**: Spaceship command interface for knowledge navigation

#### 3. Content View (`ContentViewer`)
**Purpose**: Individual content piece display
**Features**: Shows selected content with navigation back to map

## Current Data Structure

### Knowledge Domains (4 Chapters) - Exact Structure:
```typescript
const knowledgeDomains = [
  {
    id: 'chapter-1',
    title: 'CHAPTER 1',
    subtitle: 'The Mechanics of Transformation',
    image: urbanFabricIcon, // figma:asset/da675ef43a920905acce551f8e42797f4ca0dd62.png
    angle: 315, // Top-left 
    backgroundColor: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #9333EA 100%)',
    episodes: [
      { 
        id: 'ep1-1', 
        title: 'What is an Organizational Transformation?',
        description: 'Defines transformation as a fundamental re-engineering of an organization\'s core logic to meet a new strategic ambition that exceeds its current capacity.'
      },
      { 
        id: 'ep1-2', 
        title: 'What is a Sector Transformation?',
        description: 'Elevates the transformation challenge from a single entity to an entire ecosystem. It redesigns how value flows across multiple, interdependent organizations.'
      },
      { 
        id: 'ep1-3', 
        title: 'What is the People Transformation?',
        description: 'Addresses the human and political resistance inherent in public sector reform. Acknowledging that a perfect plan can be derailed by cultural inertia.'
      },
      { 
        id: 'ep1-4', 
        title: 'The Entangled Transformation Battleground',
        description: 'Introduces "entangled" transformations where multiple entities must change simultaneously. Presents the Complexity Index (CI) as a risk assessment tool.'
      }
    ]
  },
  // ... similar structure for chapters 2-4
]
```

### Complete Chapter Data (All 4 Chapters, 16 Episodes):

**CHAPTER 1** (chapter-1, angle: 315°, urbanFabricIcon):
- ep1-1: "What is an Organizational Transformation?" - "Defines transformation as a fundamental re-engineering of an organization's core logic to meet a new strategic ambition that exceeds its current capacity."
- ep1-2: "What is a Sector Transformation?" - "Elevates the transformation challenge from a single entity to an entire ecosystem. It redesigns how value flows across multiple, interdependent organizations."  
- ep1-3: "What is the People Transformation?" - "Addresses the human and political resistance inherent in public sector reform. Acknowledging that a perfect plan can be derailed by cultural inertia."
- ep1-4: "The Entangled Transformation Battleground" - "Introduces \"entangled\" transformations where multiple entities must change simultaneously. Presents the Complexity Index (CI) as a risk assessment tool."

**CHAPTER 2** (chapter-2, angle: 45°, futureCitiesIcon):  
- ep2-1: "Strategic Performance (KPIs)" - "Explains how to create a \"golden thread\" from a high-level national objective (L0) down to a frontline process metric (L3)."
- ep2-2: "Portfolios & Initiatives" - "Defines the portfolio as the control system that translates strategy into funded work with direct links to strategic KPIs."
- ep2-3: "Process Architecture" - "Establishes that strategy is executed through processes. Defining L3 executable processes and linking them to owners and metrics."
- ep2-4: "Organizational Design" - "Frames organizational structure as the backbone of accountability. A dynamic structure where every role maps to specific L3 processes and KPIs."

**CHAPTER 3** (chapter-3, angle: 135°, buildingLifecycleIcon):
- ep3-1: "The Integrated Governance" - "Defines governance as the decision-making \"operating system\" that integrates strategy, execution (PMO), and operations through structured reviews."
- ep3-2: "The Delivery Engine" - "Outlines the dual disciplines of Value Assurance (Program Management) and Delivery Assurance (Project Management) that execute governance decisions."
- ep3-3: "Change Architecture" - "Presents Change Architecture as the discipline for mitigating adoption risk by integrating human readiness activities with technical deliverables."
- ep3-4: "The Enablers" - "Describes foundational capabilities required for sustainable transformation: Digital Support, Corporate Knowledge Management, and talent culture."

**CHAPTER 4** (chapter-4, angle: 225°, infrastructureIcon):
- ep4-1: "Day 1-15: Diagnose Your Starting Point" - "Using the Public Sector Complexity Index (CI) to assess your transformation readiness and identify key risk factors."
- ep4-2: "Day 16-60: Architect Your First Golden Thread" - "Using the open source DTO Entity-Relationship Diagram (ERD) to create your strategic alignment framework."
- ep4-3: "Day 61-90: Launch Your First GenAI-powered Use Case" - "Implementing your first AI-powered transformation use case to demonstrate value and build momentum for broader adoption."
- ep4-4: "Beyond 90 Days: Scale and Sustain" - "Strategies for scaling successful transformation initiatives and building sustainable change management capabilities across the organization."

### Content Types Array (Currently Defined but Not Used):
```typescript
const contentTypes = [
  { name: 'Audio Podcast', icon: '🎧', color: '#FF6B6B' },
  { name: 'Video Presentation', icon: '🎥', color: '#4ECDC4' },
  { name: 'TWiki Read', icon: '📚', color: '#45B7D1' },
  { name: 'Study Guide', icon: '📝', color: '#96CEB4' }
]
```

## Assets Used - Exact Import Statements
```typescript
import cosmicBackground from 'figma:asset/ee1d60b6da6ffbe59028c887ab600f760e18e0fd.png';
import centralHUD from 'figma:asset/c6d76206b55efd4e478665a24d810b12f592c316.png';
import urbanFabricIcon from 'figma:asset/da675ef43a920905acce551f8e42797f4ca0dd62.png';
import futureCitiesIcon from 'figma:asset/ef5503dd4088387aaa2896030c8428aaadf85a66.png';
import buildingLifecycleIcon from 'figma:asset/c80b4788f34c09f4111ad6d7302dc08ac0a6fd28.png';
import infrastructureIcon from 'figma:asset/9a7512aa78450bb20185392d88b764bd99bd1a7f.png';
import metallicTexture1 from 'figma:asset/7ae65ccd4c8c3645e458ddb3822f2cda77548187.png';
import metallicTexture2 from 'figma:asset/d229292f51891a9efb4aec57adad62b8c612a8d1.png';
import sphereSurface from 'figma:asset/8edd631711f8516143acaf62fd25366417eb9ebd.png';
import twinLabLogo from 'figma:asset/ce140d08c83da0d1ba52cf9a1573bf2859276974.png';
```

### Asset Usage:
- **cosmicBackground**: Fixed background, scale(1.1), crisp-edges rendering
- **centralHUD**: Rotating HUD overlay, scale(1.5), 60s rotation
- **urbanFabricIcon-infrastructureIcon**: Domain sphere content, full size with opacity-80
- **metallicTexture1**: Currently imported but not used
- **metallicTexture2**: Central sphere overlay, opacity-20, soft-light blend
- **sphereSurface**: Central sphere overlay, opacity-25, multiply blend  
- **twinLabLogo**: Header logo, w-12 h-12, with cyan glow

## Current Interactive Features

### State Variables:
```typescript
const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>([]);
const [debugOffset, setDebugOffset] = useState({ x: -4, y: -28 });
const [showDebugPanel, setShowDebugPanel] = useState(true);
const [sphereSize, setSphereSize] = useState(32); // Results in 128px sphere
const [sphereRotation, setSphereRotation] = useState({ x: 0, y: 0, z: 0 });
const [selectedCube, setSelectedCube] = useState<{ chapterId: string; episodeId: string } | null>(null);
const [cubeRotation, setCubeRotation] = useState(0);
```

### Central Sphere Interaction (Lines 331-386):
- **Mouse Events**: 
  - onMouseDown: Captures start position, prevents default
  - mousemove handler: `deltaX/Y * 0.5` rotation sensitivity
  - X rotation: `-deltaY * rotationSpeed` (vertical drag)
  - Y rotation: `+deltaX * rotationSpeed` (horizontal drag)
  - Z rotation: Kept stable
- **Touch Events**: Identical logic using `e.touches[0]`
- **Spring Animation**: Motion component with stiffness: 200, damping: 30
- **Cursor States**: `cursor-grab active:cursor-grabbing select-none`

### Episode Cube Interaction (Lines 502-507):
- **Event Handling**: `onClick` with `e.stopPropagation()` and `e.preventDefault()`
- **State Update**: `setSelectedCube({ chapterId: domain.id, episodeId: episode.id })`
- **Hover Animation**: Motion `whileHover={{ scale: 1.2 }}`
- **Current Issue**: Sets state but doesn't trigger any content display

### Button Interactions:
- **Login/Register Button**: `onClick={() => setIsAuthModalOpen(true)}`
- **Contribute Knowledge Button**: `onClick={() => setIsAuthModalOpen(true)}`
- Both buttons use identical styling and behavior

## Current Styling System

### Typography System (globals.css):
- **Base Typography**: Applied via @layer base, uses CSS custom properties
- **Font Classes**: 
  - `.font-inter`: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
  - `.font-allerta`: `'Allerta Stencil', monospace`
- **Rule**: NEVER use Tailwind font-size, font-weight, or line-height classes unless explicitly requested

### Color System (globals.css):
- **CSS Custom Properties**: Defined in :root and .dark variants
- **Key Colors**:
  - Background: #ffffff (light) / oklch(0.145 0 0) (dark)
  - Foreground: oklch(0.145 0 0) (light) / oklch(0.985 0 0) (dark)
  - Primary: #030213 (light) / oklch(0.985 0 0) (dark)
- **Tailwind Integration**: Via @theme inline with --color-* mappings

### Motion/React Animation Specifications:
- **Import**: `import { motion } from 'motion/react'`
- **Particle Animation**:
  - `animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}`
  - `transition={{ duration: 4 + particle.speed * 2, repeat: Infinity, ease: "easeInOut", delay: particle.id * 0.15 }}`
- **HUD Rotation**: 
  - `animate={{ rotate: [0, 360] }}`
  - `transition={{ rotate: { duration: 60, repeat: Infinity, ease: "linear" } }}`
- **Domain Sphere Glow**:
  - `animate={{ filter: ['drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))', 'drop-shadow(0 0 40px rgba(59, 130, 246, 0.8))', 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))'] }}`
  - `transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.7 }}`
- **Cube Rotation**:
  - `animate={{ rotateY: [0, 360], rotateX: [0, 360] }}`
  - `transition={{ duration: 8, repeat: Infinity, ease: "linear" }}`
- **Cube Float**:
  - `animate={{ y: [0, -5, 0] }}`
  - `transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: episodeIndex * 0.5 } }}`

## Current Issues & Limitations

### Central Sphere
- **CSS-based 3D**: Limited to CSS gradients and shadows
- **No Real Bump Mapping**: Cannot use true 3D textures
- **Performance**: Multiple texture overlays may impact performance

### Episode Cubes
- **No Content Activation**: Clicking sets state but doesn't navigate to content
- **Static Content**: No preview or content type indicators

### Visual Polish
- **Landing Page**: Needs minor visual enhancements
- **Responsiveness**: May need mobile optimization testing

### Responsive Behavior:
- **Container**: `max-w-4xl mx-auto px-8` (max 896px width, auto margins, 32px padding)
- **Mobile Considerations**: Touch events handled, but no specific mobile breakpoints defined
- **Viewport**: `min-h-screen` ensures full viewport height coverage

---

## View Rendering Logic (App.tsx)

### Exact View Switch Implementation:
```typescript
const renderContent = () => {
  switch (currentView) {
    case 'landing':
      return (
        <CosmicLandingPage
          onLoginClick={() => setIsAuthModalOpen(true)}
          onEnterUniverse={handleEnterUniverse}
        />
      );
    case 'universe':
      return (
        <div className="min-h-screen bg-background">
          <Header 
            currentUser={currentUser}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onBackToLanding={handleBackToLanding}
            showBackButton={true}
          />
          <KnowledgeMapSpaceship
            domains={mockDomains}
            onContentSelect={handleContentSelect}
            searchQuery=""
          />
        </div>
      );
    case 'content':
      return (
        <div className="min-h-screen bg-background">
          <Header 
            currentUser={currentUser}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onBackToLanding={handleBackToLanding}
            showBackButton={true}
          />
          <main className="container mx-auto">
            <ContentViewer
              content={selectedContent!.content}
              topic={selectedContent!.topic}
              domain={selectedContent!.domain}
              onBack={handleBackToMap}
              currentUser={currentUser}
              onLoginRequired={handleLoginRequired}
            />
          </main>
        </div>
      );
    default:
      return null;
  }
};

return (
  <>
    {renderContent()}
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      onLogin={handleLogin}
    />
  </>
);
```

---

## File Dependencies & Imports

### Critical Files
- `/App.tsx`: Main entry point with exact view switching logic above
- `/components/CosmicLandingPage.tsx`: Landing page (lines 1-596+ documented above)
- `/components/KnowledgeMapSpaceship.tsx`: Spaceship interface (not landing focus)
- `/components/ContentViewer.tsx`: Content display (not landing focus)
- `/styles/globals.css`: Typography system and color variables

### Required Imports for CosmicLandingPage:
```typescript
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
// + all 10 figma asset imports listed above
```

### Component Dependencies:
- **Motion/React**: ALL animations use motion components with exact specifications above
- **ImageWithFallback**: Used for all figma asset images
- **React hooks**: useState for state management, useEffect for particle initialization
- **NO external libraries** for 3D effects (current implementation is pure CSS)