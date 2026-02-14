# Aline et Felix - Wedding Website Project Recap

## Project Overview

This is a wedding website for **Aline & Felix** (September 12, 2026) featuring interactive games themed as "Le Bac de notre Amour" (The Baccalaureate of Our Love). The website presents wedding information and entertainment through a playful academic examination metaphor.

## Project Structure

```
Aline_et_Felix/
├── index.html              # Landing page with navigation
├── jeu.html                # Game selection hub
├── biologie.html           # Biology quiz game
├── musique.html            # Music quiz game
├── jeux/
│   ├── jeu_aline.html     # Aqua Rhythm game (synchronized swimming)
│   └── jeu_felix.html     # Alpine Extreme game (skiing)
├── style.css               # Main landing page styles
├── style-jeu.css           # Game hub styles
├── style-quiz.css          # Quiz game styles
├── jeu.js                  # Game hub logic (score tracking)
├── biologie.js             # Biology quiz logic
├── musique.js              # Music quiz logic
├── images/                 # Decorative assets and icons
├── audio/                  # Audio files for games
└── videos/                 # Video assets
```

## Architecture & Design Patterns

### 1. **Self-Contained HTML Files**
Each game is a standalone HTML file with embedded CSS and JavaScript. This approach:
- Eliminates build dependencies
- Makes each game independently functional
- Simplifies deployment (just upload files)

### 2. **Vanilla JavaScript**
All interactivity uses pure JavaScript without frameworks:
- Direct DOM manipulation
- Canvas API for game rendering
- LocalStorage for score persistence
- Web Audio API for sound generation

### 3. **Responsive Design**
- Uses `clamp()` and viewport units (`vw`, `vh`) for fluid scaling
- Media queries for mobile optimization (breakpoint: 768px)
- Touch-friendly controls for mobile devices

## Style Guide

### Typography
- **Headings**: `'Dancing Script', cursive` - Elegant, wedding-appropriate script font
- **Body Text**: `'Nunito', sans-serif` - Clean, readable sans-serif
- **Fonts loaded from**: Google Fonts

### Color Palette
- **Background**: `#F8F3E9` (warm cream)
- **Text**: `#5a4e49`, `#796c66` (warm browns)
- **Buttons**: Colorful themed buttons (pink, blue, green, orange, violet, yellow)
- **Game-specific palettes**:
  - Aqua Rhythm: Cyan/teal ocean theme (`#006064`, `#00BCD4`)
  - Alpine Extreme: Sky blue/white snow theme (`#87CEEB`, white)

### Layout Patterns
- **Centered card design**: Main content in a centered container with decorative corner images
- **Fixed decorative corners**: Four corner images (`top_left.png`, `top_right.png`, etc.) positioned absolutely
- **Flexbox navigation**: Buttons arranged with flexbox for responsive wrapping

### Button Styling
- Background images for buttons (e.g., `blue_button.png`, `red_button.png`)
- Hover effect: `transform: scale(1.05)`
- Consistent sizing with `max-width` constraints

## Game Implementations

### 1. **Le Bac de notre Amour** (jeu.html)
- **Type**: Game hub/dashboard
- **Features**:
  - 6 subjects (Histoire, Géographie, Maths, Biologie, Musique, Sport)
  - Score tracking with LocalStorage
  - Progress display (completed exams, average score)
  - Final grade calculation ("mention")

### 2. **Biologie Quiz** (biologie.html)
- **Type**: Multiple-choice quiz
- **Features**:
  - Question progression with visual feedback
  - Score calculation (out of 20)
  - Results saved to LocalStorage
  - Themed questions about the couple

### 3. **Musique Quiz** (musique.html)
- **Type**: Audio-based quiz
- **Features**:
  - Audio playback with play/pause controls
  - Multiple-choice answers
  - Score tracking and persistence

### 4. **Aqua Rhythm** (jeu_aline.html)
- **Type**: Rhythm game (synchronized swimming theme)
- **Canvas-based**: 800x600px game area
- **Gameplay**:
  - Arrow key inputs (←, ↑, ↓, →)
  - Touch-friendly mobile controls
  - Timing-based scoring (Perfect/Good/Miss)
  - Combo system
  - 60-second time limit
- **Technical Features**:
  - Web Audio API for procedural music generation
  - Canvas 2D rendering for swimmers and animations
  - Particle effects for visual feedback
  - AI swimmers that mirror player movements

### 5. **Alpine Extreme** (jeu_felix.html)
- **Type**: Endless runner (skiing theme)
- **Canvas-based**: 900x500px game area
- **Gameplay**:
  - SPACE to jump, DOWN to duck
  - Obstacles: trees, birds, crevasses, kids
  - Blue ramps enable backflip tricks (+500 points)
  - Progressive difficulty (speed increases)
  - Helicopter rescue animation on crash
- **Technical Features**:
  - Physics simulation (gravity, jumping)
  - Collision detection
  - Rotation animations for tricks
  - Multi-state game flow (playing, crashed, rescuing)

## Technical Highlights

### Canvas Rendering
Both main games use HTML5 Canvas with:
- **2D context** for all rendering
- **Transform stack** (`save()`/`restore()`) for complex positioning
- **Particle systems** for visual effects
- **Animation loops** using `requestAnimationFrame`

### Audio Implementation
- **Aqua Rhythm**: Procedural audio using Web Audio API
  - Oscillators for kick, snare, hi-hat
  - Noise generation for percussion
  - Scheduled beat system with tempo control
- **Musique Quiz**: HTML5 `<audio>` elements for playback

### State Management
- **LocalStorage** for persistence:
  ```javascript
  localStorage.setItem('biologie_score', score);
  localStorage.getItem('biologie_score');
  ```
- **In-memory state** for game logic (player position, obstacles, scores)

### Responsive Scaling
```css
/* Fluid typography */
font-size: clamp(1rem, 4vw, 2.6rem);

/* Responsive sizing */
width: 90vw;
max-width: 1800px;

/* Media queries for mobile */
@media (max-width: 768px) { ... }
```

## Code Style Conventions

### JavaScript
- **No semicolons** in some files (inconsistent)
- **ES6 features**: Arrow functions, `const`/`let`, template literals
- **Naming**: camelCase for variables and functions
- **Comments**: Minimal, mostly section headers
- **Object literals** for game state and configuration

### CSS
- **BEM-like naming** in some places (e.g., `.subject-wrapper`, `.nav-button`)
- **Utility classes**: `.hidden { display: none !important; }`
- **Inline comments** for clarity
- **Mobile-first approach** with desktop enhancements

### HTML
- **Semantic elements**: `<header>`, `<main>`, `<footer>`, `<nav>`
- **French language**: `lang="fr"` on most pages
- **Accessibility**: Alt text on decorative images (empty alt="")
- **Viewport meta**: Configured for mobile responsiveness

## Key Features

1. **Score Persistence**: All quiz and game scores saved to browser LocalStorage
2. **Mobile-Optimized**: Touch controls and responsive layouts
3. **Visual Polish**: Smooth animations, particle effects, hover states
4. **Thematic Consistency**: Wedding theme with playful academic metaphor
5. **No Dependencies**: Pure HTML/CSS/JS, no build process required

## Deployment Notes

- **Static hosting**: Can be deployed to any static host (GitHub Pages, Netlify, etc.)
- **No backend required**: All logic runs client-side
- **Asset dependencies**: Ensure `images/`, `audio/`, and `videos/` folders are uploaded
- **Browser compatibility**: Modern browsers with Canvas and Web Audio API support

## Future Enhancement Opportunities

1. **Remaining games**: Histoire, Géographie, Maths, Sport (currently placeholder links)
2. **RSVP functionality**: Form submission (would require backend)
3. **Information page**: Wedding details, venue, schedule
4. **Leaderboard**: Compare scores across visitors (would require backend)
5. **Accessibility improvements**: Keyboard navigation, screen reader support
6. **Progressive Web App**: Offline support, installability

## Development Workflow

1. **Edit files directly**: No build step required
2. **Test locally**: Open HTML files in browser or use local server
3. **Deploy**: Upload all files maintaining directory structure
4. **Iterate**: Make changes and refresh browser

---

**Last Updated**: December 7, 2025  
**Project Status**: Active development - 2 of 6 games complete
