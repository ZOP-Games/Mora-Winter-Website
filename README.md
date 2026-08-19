# Mora Winter - Website

Official website for **Mora Winter**, a calming winter exploration and atmospheric survival game by **Spring Flow Games**.

## Viewport Architecture

All sections adhere to strict responsive viewport boundaries:
- **Minimum Height**: `min-height: calc(100dvh * 2 / 3);` (at least 66.67% of viewport height)
- **Maximum Height**: `max-height: 100dvh;` (at most 100% viewport height)
- **Internal Overflow**: `overflow-y: auto;` preserves accessibility on smaller screens.

## The 3 Sections

1. **Merged Hero (3D Snowfall Behind Title & Campfire)**:
   - Deep midnight obsidian backdrop.
   - Bright, radiant white 3D cartoonish snowflake crystals falling smoothly across the background **behind** the giant **Mora Winter** title.
   - Massive 3D campfire with authentic criss-crossed & leaning charred wood logs grounded in a stone hearth ring, positioned half off-screen at the bottom.
   - Radiant **cadmium orange glowing hexagonal crystal** casting warm, flickering light and rising embers onto the title.

2. **Game Features & Atmosphere**:
   - Cohesive storybook typography using **Fraunces** for headings and **Lora** for body copy.
   - 6 detailed cards translated into English from the original Hungarian lore & pitch.
   - Highlights the 2-tailed fox protagonist, gentle survival gathering, the mysterious monumental door, and hot cocoa vibes.

3. **16:9 Gameplay Video Player**:
   - Strict `16:9` aspect ratio container centered horizontally with matching left-aligned header.
   - Interactive play/pause toggle with live scrubber progression.