# Mora Winter - Website

Official website for **Mora Winter**, a calming winter exploration and atmospheric survival game by **Spring Flow Games**.

## Viewport Architecture

All 4 sections adhere to strict responsive viewport boundaries:
- **Minimum Height**: `min-height: calc(100dvh * 2 / 3);` (at least 66.67% of viewport height)
- **Maximum Height**: `max-height: 100dvh;` (at most 100% viewport height)
- **Internal Overflow**: `overflow-y: auto;` preserves accessibility on smaller screens.

## The 4 Sections

1. **3D Cartoon Snowfall in the Dark**:
   - Built with Three.js (and canvas fallback) in a deep midnight obsidian backdrop.
   - Bright, radiant white 3D cartoonish snowflake crystals tumbling peacefully with natural, steady physics without overlay text.

2. **Mora Winter Title & Cadmium Orange Glowing Hexagonal Crystal Campfire**:
   - Giant typography (`~24em` max clamp) in Google Font **Fraunces**.
   - Massive 3D campfire with authentic criss-crossed & leaning charred wood logs grounded in a stone hearth ring, positioned so about half rests off-screen.
   - Radiant **cadmium orange glowing hexagonal crystal prism with a pointed hexagonal cap** (earthy, rich, de-saturated warmth).
   - Dynamically casts warm, flickering cadmium orange light and rising embers onto the title text from below.

3. **Game Features & Atmosphere**:
   - Cohesive storybook typography using **Fraunces** for headings and **Lora** for body copy.
   - 6 detailed cards translated into English from the original Hungarian lore & pitch.
   - Highlights the 2-tailed fox protagonist, gentle survival gathering, the mysterious monumental door, and hot cocoa vibes.

4. **16:9 Gameplay Video Player**:
   - Strict `16:9` aspect ratio container.
   - Interactive play/pause toggle with live scrubber progression.
