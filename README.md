# Mora Winter - Website

Official website for **Mora Winter**, a calming winter exploration game by ZOP Games.

## Viewport Architecture

All 4 sections adhere to strict responsive viewport boundaries:
- **Minimum Height**: `min-height: calc(100dvh * 2 / 3);` (at least 66.67% of viewport height)
- **Maximum Height**: `max-height: 100dvh;` (at most 100% viewport height)
- **Internal Overflow**: `overflow-y: auto;` preserves accessibility on smaller screens.

## The 4 Sections

1. **3D Cartoon Snowfall in the Dark**:
   - Built with Three.js (and canvas fallback).
   - Low-poly 3D cartoonish dodecahedron & faceted ice crystal flakes tumbling gently through dark midnight atmosphere.
   - Interactive wind response tracking mouse movements with cozy hearth ambient rim lighting.

2. **Mora Winter Title Display**:
   - Giant typography (`~24em` max clamp) in Google Font **Fraunces**.
   - Curated to feel cozy (soft editorial serif curves) and cold (frosty crystalline gradient, icy highlights).

3. **Game Features & Atmosphere**:
   - 6 detailed cards translated into English from the original Hungarian lore & pitch.
   - Highlights the 2-tailed fox protagonist, gentle survival gathering, the mysterious monumental door, and hot cocoa vibes.

4. **16:9 Gameplay Video Player**:
   - Strict `16:9` aspect ratio container.
   - Interactive play/pause toggle with live scrubber progression.

## Certified Open-Source Slopware™
