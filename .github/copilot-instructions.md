# GitHub Copilot Instructions for Find the Flag

## Project Overview

Find the Flag is a mobile-first, fully static flag guessing web game built with React, TypeScript, and Vite. The game is bilingual (English and French) and requires no backend server.

### Current Features (v0.4.0)

- **Bilingual Support**: Full English and French translations with instant language switching
- **Game Modes**: Multiple choice or free-text input
- **Difficulty Levels**: Easy, Medium, and Hard modes
- **Customizable Settings**: 
  - Answer options: 4, 6, or 8 choices
  - Timer: Configurable duration or disabled
  - Question count: Set number of questions per game
  - Pseudonym: Custom player name for score sharing
- **Score System**: Persistent total score tracking with localStorage
- **Score Sharing**: Share achievements via encoded URLs
- **PWA Support**: Installable app with offline capability and service worker
- **Auto-Update**: Automatic detection of new versions with update notification
- **Dark Mode**: Automatic theme based on system preferences

## Tech Stack & Architecture

- **Framework**: React 18 with TypeScript (strict mode)
- **Build Tool**: Vite
- **Styling**: Pure CSS3 (no UI frameworks)
- **State Management**: React Context API for language preferences
- **i18n**: Custom lightweight implementation (no external library)
- **Deployment**: Static site for GitHub Pages

## TypeScript Guidelines

- **Strict Mode**: Always use TypeScript strict mode. All code must be type-safe.
- **Type Definitions**: Define types in `src/types/index.ts` or co-located with their usage
- **No `any`**: Avoid using `any` type. Use proper type definitions or `unknown` when necessary.
- **Interfaces**: Use interfaces for object shapes and data structures
- **Type Exports**: Re-export shared types from `src/types/index.ts`

## React Component Patterns

### Functional Components
- Use functional components exclusively (no class components)
- Use TypeScript for component props interfaces
- Name props interfaces as `ComponentNameProps`

### Hooks
- Prefer `useState` for local component state
- Use `useLanguage` custom hook for accessing language context
- Keep hooks at the top of the component (React rules of hooks)

### Component Organization
```typescript
// 1. Imports
import { useState } from 'react';
import { useLanguage } from '../contexts/useLanguage';
import { t } from '../i18n';

// 2. Type definitions
interface ComponentProps {
  onAction: () => void;
}

// 3. Component definition
export function Component({ onAction }: ComponentProps) {
  // 4. Hooks
  const { language } = useLanguage();
  const [state, setState] = useState();
  
  // 5. Event handlers
  const handleClick = () => {
    // ...
  };
  
  // 6. Render helpers
  const getClassName = () => {
    // ...
  };
  
  // 7. JSX return
  return (
    <div>
      <h1>{t('section.title', language)}</h1>
    </div>
  );
}
```

## Internationalization (i18n)

### Translation Keys
- Use the `t()` function from `src/i18n/index.ts` for all user-facing text
- Signature: `t(key, language)` where:
  - `key` is a `TranslationKey` (derived type from nested keys with auto-completion)
  - `language` is `'en' | 'fr'` (Language type)
  - Returns: `string`
- Translation keys use dot notation: `'section.key'`
- Define translations in both `src/i18n/en.ts` and `src/i18n/fr.ts`

### Language Support
- Support both English (`en`) and French (`fr`)
- Get current language from `useLanguage()` hook
- Pass language to `t()` function: `t('home.title', language)`
- Never hard-code user-facing strings; always use `t()` function

### Country Names
- Country data includes both `name_en` and `name_fr` fields
- Select the appropriate name based on current language
- Pattern: `language === 'fr' ? country.name_fr : country.name_en`

## Game Logic

### Pure Functions
- Keep game logic pure and separate from UI in `src/lib/game.ts`
- Pure functions should:
  - Not mutate input parameters
  - Return new values instead of modifying existing ones
  - Be testable without React dependencies
  - Use immutable patterns (spread operators, array methods)

### Random Selection
- Use the `shuffle()` function for randomizing arrays (Fisher-Yates algorithm)
- Use `pickRandomCountry()` for selecting countries with optional exclusions
- Use `buildQuestion()` to generate questions with 4 options

### State Management
- Game state follows `GameState` interface with `score`, `total`, `previousCorrectCode`, and `startTime`
- Game settings follow `GameSettings` interface with:
  - `optionCount`: 4 | 6 | 8 (number of answer choices)
  - `timerEnabled`: boolean (whether timer is active)
  - `timerDuration`: number (seconds for timer)
  - `gameMode`: 'multiple-choice' | 'free-text'
  - `questionCount`: number (questions per game)
  - `difficulty`: 'easy' | 'medium' | 'hard'
- Settings are persisted in localStorage via `src/utils/storage.ts`
- Avoid consecutive questions with the same correct answer
- Update state immutably using spread operators

## Styling Guidelines

### CSS Organization
- Global styles and CSS variables in `src/styles/index.css`
- Component-specific styles in `src/styles/App.css`
- Use semantic class names (BEM-like: `component-element--modifier`)

### CSS Patterns
- Use CSS custom properties (variables) for colors and spacing
- Mobile-first responsive design (base styles for mobile, media queries for larger screens)
- Flexbox and Grid for layouts
- Dark mode support via `@media (prefers-color-scheme: dark)`

### Class Names
- Use descriptive, semantic class names
- Avoid inline styles; use CSS classes
- Dynamic classes: build class name strings using one of these patterns:
  - **Preferred (immutable)**: `const classNames = ['base-class', condition && 'modifier'].filter(Boolean).join(' ');`
  - **Acceptable (local scope)**: Within a local helper function, you may use `push()` on a local array variable, as seen in `getButtonClass()` in GamePage

## Data Management

### Country Data
- All countries defined in `src/data/countries.ts`
- Each country has: `code`, `name_en`, `name_fr`, `flagUrl`
- Flag images hotlinked from Wikimedia Commons (320px PNG format)
- Use public domain or Creative Commons licensed images only

### Image Handling
- Use the `FlagImage` component for displaying flag images
- Include error handling and fallback placeholders
- Always provide `alt` text for accessibility

## Code Quality

### Linting
- Run `npm run lint` to check code quality
- Follow ESLint rules (configured in `.eslintrc.cjs`)
- Zero warnings tolerance (`--max-warnings 0`)

### TypeScript Compilation
- Run `tsc` to check type errors before building
- Build command: `npm run build` (runs `tsc && vite build`)

### Comments
- Use JSDoc comments for exported functions and complex logic
- Keep comments concise and meaningful
- Explain "why" not "what" when the code is self-explanatory

## Accessibility

- Use semantic HTML elements (`button`, `nav`, `main`, etc.)
- Include proper ARIA labels where needed
- Ensure keyboard navigation works correctly
- Use `disabled` attribute appropriately on buttons
- Test with screen readers in mind

## Performance

- Keep bundle size minimal (no unnecessary dependencies)
- Lazy load components when appropriate
- Optimize images (use 320px width for flags)
- Avoid unnecessary re-renders (use proper React keys)

## File Structure

- **`src/components/`**: React components (`.tsx` files)
- **`src/contexts/`**: React Context providers and hooks
- **`src/data/`**: Static data (countries, etc.)
- **`src/i18n/`**: Translation files and i18n utilities
- **`src/lib/`**: Pure utility functions and game logic
- **`src/types/`**: TypeScript type definitions
- **`src/styles/`**: CSS files
- **`src/utils/`**: General utility functions

## Common Patterns to Follow

### Adding a New Component
1. Create `.tsx` file in `src/components/`
2. Define props interface as `ComponentNameProps`
3. Export as named export: `export function ComponentName()`
4. Use functional component with hooks
5. Add styles to `src/styles/App.css` with component-specific classes

### Adding a New Translation
1. Add key to `src/i18n/en.ts`
2. Add French translation to `src/i18n/fr.ts`
3. Use `t('your.key', language)` in component
4. Pass `language` from `useLanguage()` hook

### Adding Game Logic
1. Add pure function to `src/lib/game.ts`
2. Use existing types from `src/types/index.ts`
3. Write JSDoc comment explaining the function
4. Return new values (don't mutate inputs)
5. Handle edge cases (e.g., empty arrays)

## What to Avoid

- **No external UI libraries**: Use pure CSS, no Material-UI, Chakra, etc.
- **No external i18n libraries**: Use the custom `t()` function
- **No class components**: Use functional components only
- **No inline styles**: Use CSS classes instead
- **No `any` types**: Use proper TypeScript types
- **No mutating state**: Always create new objects/arrays
- **No hard-coded strings**: Use translation keys
- **No backend dependencies**: Keep the app fully static
- **No localStorage except for language preference**: Minimal client-side storage

## Development Workflow

### Setting Up the Development Environment
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev` (opens at `http://localhost:5173`)
3. Make changes with hot reload active
4. Run linter: `npm run lint` (must pass with zero warnings)
5. Type check: `tsc` (must pass with no errors)
6. Build for production: `npm run build` (compiles TypeScript + builds with Vite)
7. Preview production build: `npm run preview`

### Testing
- **No test framework**: This project currently has no automated tests (no Jest, Vitest, etc.)
- When making changes, manually verify functionality by:
  1. Running the dev server (`npm run dev`)
  2. Testing the feature in the browser
  3. Checking both English and French languages
  4. Testing on mobile viewport and desktop
  5. Verifying dark mode if styling changes were made
- Do not add test infrastructure unless explicitly requested

### Running and Previewing
- **Development**: `npm run dev` starts Vite dev server with hot module replacement
- **Production Preview**: `npm run build && npm run preview` to test production build locally
- **Base Path**: When running locally, the app runs at root (`/`), but deploys to `/find-the-flag/` on GitHub Pages
- **Browser Testing**: Test in Chrome/Firefox/Safari, with mobile viewport (375px width minimum)

## Git Workflow

- **Branches**: Work on feature branches, not directly on `main`
- **Commits**: Write clear, descriptive commit messages
- **Before Committing**: Always run `npm run lint` and `npm run build` to ensure code quality
- **Build Artifacts**: Never commit the `dist/` folder or `node_modules/` (already in `.gitignore`)

## Debugging

### Common Issues
- **Import Errors**: Check file paths are correct and use `.tsx` extension for React components
- **Type Errors**: Run `tsc` to see all TypeScript errors at once
- **Runtime Errors**: Check browser console, use React DevTools for component inspection
- **Styling Issues**: Inspect with browser DevTools, check CSS class names match
- **Translation Missing**: Ensure key exists in both `en.ts` and `fr.ts`

### Development Tools
- **React DevTools**: Browser extension for inspecting component tree and state
- **Vite DevTools**: Built-in HMR (Hot Module Replacement) shows updates in console
- **TypeScript**: Run `tsc --watch` in separate terminal for continuous type checking
- **ESLint**: Integrated in most IDEs for real-time linting feedback

## Deployment

- **Target**: GitHub Pages (`https://mvmser.github.io/find-the-flag/`)
- **Trigger**: Automatic deployment on push to `main` branch via GitHub Actions
- **Build Process**: GitHub Actions runs `npm run build` and deploys `dist/` folder
- **Base Path**: Configured in `vite.config.ts` as `base: '/find-the-flag/'`
- **Manual Deploy**: Can be triggered from GitHub Actions tab in repository

## Version Management

The app includes automatic update detection to ensure users always have the latest version.

### Version Updates

When incrementing the version (with each PR), update these **3 locations**:

1. **`package.json`**: Update the `version` field
   ```json
   {
     "version": "0.4.0"
   }
   ```

2. **`src/components/HomePage.tsx`**: Update the `APP_VERSION` constant
   ```typescript
   const APP_VERSION = '0.4.0';
   ```

3. **`public/sw.js`**: Increment the cache version numbers
   ```javascript
   const CACHE_NAME = 'find-the-flag-v2';
   const IMAGE_CACHE_NAME = 'find-the-flag-images-v2';
   ```
   When updating from v0.4.0 to v0.5.0, change `v2` to `v3`

### Version Increment Guidelines

- **Patch** (0.4.x): Bug fixes, minor UI tweaks, translation updates
- **Minor** (0.x.0): New features, settings additions, game mode enhancements
- **Major** (x.0.0): Breaking changes, complete redesigns, major feature overhauls

### Auto-Update System

- Service worker checks for updates every 60 seconds
- When new version detected, notification banner appears (bilingual)
- User clicks "Update Now" / "Mettre à jour" to reload with new version
- Old cache is automatically cleared on activation

## Best Practices Summary

- **Type Safety**: Leverage TypeScript's strict mode for maximum type safety
- **Immutability**: Always use immutable patterns for state updates
- **Separation of Concerns**: Keep UI logic in components, game logic in `lib/`
- **Internationalization**: Support both English and French from the start
- **Accessibility**: Build with screen readers and keyboard navigation in mind
- **Performance**: Keep bundle size small, optimize images
- **Code Quality**: Maintain zero ESLint warnings and TypeScript errors
- **Manual Testing**: Always test changes in browser before committing (no automated tests)
