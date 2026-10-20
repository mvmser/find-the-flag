# 🌍 Find the Flag

A mobile-first, fully static flag guessing web game available in English and French. Test your knowledge of world flags in this fun and educational game!

## 🎮 Play Now!

**[Play Find the Flag](https://mvmser.github.io/find-the-flag/)** - Available now on GitHub Pages!

## 🎮 What is Find the Flag?

**Find the Flag** is an interactive web-based quiz game where players test their knowledge of world flags. Each round presents a flag image, and players must identify which country it belongs to from four multiple-choice options.

### Features

- **🌐 Bilingual**: Full support for English and French with instant language switching
- **📱 Mobile-First Design**: Optimized for touch interactions and fits on one screen without scrolling
- **📊 Score Tracking**: Keep track of correct answers with persistent total score saved locally
- **⚙️ Customizable Settings**: Choose between 4, 6, or 8 answer options, toggle timer, select game mode, and set question count
- **🎮 Game Modes**: Multiple choice or free-text input for different skill levels
- **🗺️ 197 Countries**: Every sovereign state, with English and French names
- **🌍 Regional Challenges**: Play the whole world or focus on Europe, Africa, Asia, the Americas or Oceania
- **🎚️ Difficulty Levels**: Easy (famous flags), Medium, or Hard (look-alike flags as wrong answers)
- **⏱️ Timer Challenge**: Optional 20-second countdown with visual progress bar
- **🎯 Smart Question Generation**: No flag repeats within a game
- **✍️ Forgiving Free Text**: Accepts English, French and common alternative names (USA, UK, RDC…), accents optional
- **💾 localStorage Persistence**: Total score and settings saved across sessions
- **📲 PWA Support**: Install as an app on iPhone/Android with offline capability and flag image caching
- **🔄 Auto-Update**: Automatic detection of new versions with prompt to update
- **♿ Accessible**: Proper ARIA labels, focus states, and keyboard navigation
- **🌙 Dark Mode**: Automatic dark mode support based on system preferences
- **🚀 Zero Backend**: Fully static site with no server required
- **🖼️ Graceful Fallbacks**: Image error handling with fallback placeholders

## 🛠️ Tech Stack

This project uses modern web technologies with minimal dependencies:

- **[Vite](https://vitejs.dev/)**: Lightning-fast development and optimized builds
- **[React](https://react.dev/)**: Component-based UI library with TypeScript
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development with strict mode
- **CSS3**: Modern styling with CSS variables, flexbox, and grid
- **No UI Framework**: Clean, custom CSS for complete control and minimal bundle size

### Key Technical Features

- Pure TypeScript game logic with testable functions
- Custom lightweight i18n system (no external library)
- Context-based state management for language preferences
- localStorage persistence for language selection and settings
- Service worker with automatic update detection and cache management
- Progressive Web App (PWA) with offline support
- Flag SVGs bundled from [flag-icons](https://github.com/lipis/flag-icons) and loaded on demand, so the game works fully offline
- Unit tests for game logic with Vitest

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/mvmser/find-the-flag.git
cd find-the-flag

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

### Development Commands

```bash
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Run tests
npm test
```

## 🌐 Deployment to GitHub Pages

This project is automatically deployed to GitHub Pages using GitHub Actions.

### Automatic Deployment

The app is automatically built and deployed to GitHub Pages whenever changes are pushed to the `main` branch. The deployment workflow:

1. Builds the project using `npm run build`
2. Uploads the built files to GitHub Pages
3. Makes the app accessible at `https://mvmser.github.io/find-the-flag/`

### Manual Deployment

You can also trigger a deployment manually:

1. Go to the "Actions" tab in the GitHub repository
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

### Local Build

To build the project locally:

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Base Path Configuration

The project is configured to deploy to a subdirectory (`https://mvmser.github.io/find-the-flag/`) with the base path set in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/find-the-flag/', // Match your repo name
  // ...rest of config
})
```

### Auto-Update Functionality

The application includes an automatic update detection system that ensures users always have the latest version:

#### How It Works

1. **Service Worker Updates**: The service worker checks for updates every 60 seconds
2. **Cache Versioning**: Each deployment increments the cache version, forcing cache invalidation
3. **Update Notification**: When a new version is detected, a notification banner appears at the top of the page
4. **One-Click Update**: Users can click "Update Now" to reload the app with the latest version

#### Version Management

The app version is displayed in the footer of the home page and should be incremented with each pull request. When incrementing the version, you need to update it in **three places**:

1. **Update `package.json`**:
   ```json
   {
     "version": "0.4.0"
   }
   ```

2. **Update the version constant in `src/components/HomePage.tsx`**:
   ```typescript
   const APP_VERSION = '0.4.0';
   ```

3. **Update the service worker cache versions in `public/sw.js`** (increment the suffix number):
   ```javascript
   const CACHE_NAME = 'find-the-flag-v2';
   const IMAGE_CACHE_NAME = 'find-the-flag-images-v2';
   ```
   
   **Note:** The cache version suffix (e.g., `v2`, `v3`, etc.) is independent of the app's semantic version number. It should be incremented sequentially with each deployment, regardless of whether the app version bump is a patch, minor, or major update. This ensures that users always receive the latest assets and that old caches are properly invalidated.
   
   Example: When updating from v0.4.0 to v0.5.0, change `v2` to `v3`:
   ```javascript
   // Before (v0.4.0)
   const CACHE_NAME = 'find-the-flag-v2';
   const IMAGE_CACHE_NAME = 'find-the-flag-images-v2';
   
   // After (v0.5.0)
   const CACHE_NAME = 'find-the-flag-v3';
   const IMAGE_CACHE_NAME = 'find-the-flag-images-v3';
   ```

**Version Increment Guidelines:**
- **Patch version** (0.4.x): Bug fixes, minor UI tweaks, translation updates
- **Minor version** (0.x.0): New features, settings additions, game mode enhancements
- **Major version** (x.0.0): Breaking changes, complete redesigns, major feature overhauls

## 📁 Project Structure

```
find-the-flag/
├── src/
│   ├── components/          # React components
│   │   ├── FlagImage.tsx   # Flag display with error handling
│   │   ├── GamePage.tsx    # Main game interface
│   │   ├── HomePage.tsx    # Landing page
│   │   ├── SettingsPage.tsx # Settings and preferences
│   │   ├── Timer.tsx       # Countdown timer component
│   │   └── LanguageToggle.tsx
│   ├── contexts/           # React context providers
│   │   ├── LanguageContext.tsx
│   │   └── useLanguage.ts
│   ├── data/
│   │   ├── countries.ts    # 197 countries (names, region, difficulty, aliases)
│   │   └── flags.ts        # Bundled flag image URLs
│   ├── i18n/               # Internationalization
│   │   ├── en.ts           # English translations
│   │   ├── fr.ts           # French translations
│   │   └── index.ts        # i18n utilities
│   ├── lib/
│   │   ├── game.ts         # Pure game logic functions
│   │   └── game.test.ts    # Vitest unit tests
│   ├── styles/
│   │   ├── index.css       # Global styles & CSS variables
│   │   └── App.css         # Component styles
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   ├── utils/
│   │   └── storage.ts      # localStorage utilities
│   ├── App.tsx             # Root component with routing
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
│   ├── icon.svg            # App icon
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker with auto-update
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🎯 How to Play

1. **Start**: Click "Start Game" on the home page
2. **Customize**: Visit Settings to adjust options count (4/6/8), difficulty level (Easy/Medium/Hard), region, game mode, timer, and question count
3. **Identify**: Look at the flag and choose the correct country from multiple options
4. **Beat the Clock**: Answer within 20 seconds if timer is enabled
5. **Track Progress**: Your total score persists across sessions
6. **Feedback**: Get instant feedback on your answer with the correct answer shown
7. **Continue**: Click "Next" to get a new flag or "Restart" to reset your round score
8. **Switch Language**: Toggle between EN/FR at any time
9. **Install**: Add to your home screen for a native app experience

## 🖼️ Flag Images Attribution

Flag images come from [flag-icons](https://github.com/lipis/flag-icons) (MIT License). They are bundled with the app at build time and cached by the service worker, so no third-party server is needed.

## 🔮 Roadmap

Future enhancements planned for this game:

- [x] **Variable Answer Options**: Choose between 4, 6, or 8 options ✅
- [x] **Timer Challenge**: Race against the clock with configurable timer ✅
- [x] **Persistent Score Tracking**: Total score saved with localStorage ✅
- [x] **PWA Support**: Offline capability and installable app with flag image caching ✅
- [x] **Free-Text Input Mode**: Type the country name for expert mode ✅
- [x] **Difficulty Levels**: Easy, Medium, Hard modes ✅
- [x] **Configurable Question Count**: Choose how many questions per game ✅
- [x] **Score Sharing**: Share your achievements with friends ✅
- [x] **Regional Challenges**: Focus on specific continents ✅
- [x] **All Countries**: 197 flags, playable offline ✅
- [ ] **Hint System**: Get clues about population, capital, or continent
- [ ] **Achievements**: Unlock badges for milestones (10 correct, 50 correct, etc.)
- [ ] **Sound Effects**: Audio feedback for correct/incorrect answers
- [ ] **More Languages**: Spanish, German, Italian, Portuguese, etc.
- [ ] **Statistics**: Track performance over time with charts

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**mvmser**

- GitHub: [@mvmser](https://github.com/mvmser)
- Repository: [find-the-flag](https://github.com/mvmser/find-the-flag)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Flag images from [flag-icons](https://github.com/lipis/flag-icons)
- Inspired by geography quiz games and educational tools
- Built with modern web technologies and best practices

---

**Enjoy playing Find the Flag! 🎉**
