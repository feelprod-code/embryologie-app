# Apple Design Context: Embryo App

## Project Overview
Embryo App is an educational web application built with React, Vite, and Tailwind CSS. It is designed to be fully responsive, targeting the following platforms:
- **Mobile:** iPhone (compact width)
- **Tablet:** iPad (regular width, both portrait and landscape)
- **Desktop:** Mac/PC

## Design Goals
The primary design goal is to create a premium, "native-like" iOS experience across all devices, strictly adhering to the Apple Human Interface Guidelines (HIG). The layout must intelligently adapt to the user's screen size without feeling stretched or compromised.

## Platform Specifics
1. **iPhone (Compact):** Use vertical stacking, single-column layouts, and bottom tab bars for primary navigation.
2. **iPad (Regular):** Utilize Split Views (sidebar for navigation, main content area for details). Content should expand gracefully (e.g., 2-3 column grids for courses/videos).
3. **Mac (Desktop):** Optimize for large screens. Utilize wider grids (4+ columns), persistent sidebars or top navigation, and include hover states for mouse interaction.

## Key HIG Principles (to be enforced via Antigravity Skills)
- **Safe Areas:** Always respect hardware safe areas (notches, Dynamic Island, home indicator) using Tailwind's padding/margin utilities.
- **Typography:** Ensure legible, platform-compliant typography (using San Francisco or a similar clean sans-serif font).
- **Spacing:** Maintain generous and consistent margins and padding, characteristic of Apple's design language.

## Relevant Antigravity Skills
When working on UI/UX for this project, the AI MUST reference and apply the principles from the following skills:
- `@hig-platforms`
- `@hig-components-layout`
- `@hig-foundations`
- `@hig-components-content`
