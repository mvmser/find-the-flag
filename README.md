# 🌍 Find the Flag

A mobile-first, fully static flag guessing web game available in English and French. Test your knowledge of world flags in this fun and educational game!

## 🎮 What is Find the Flag?

**Find the Flag** is an interactive web-based quiz game where players test their knowledge of world flags. Each round presents a flag image, and players must identify which country it belongs to from four multiple-choice options.

### Features

- **🌐 Bilingual**: Full support for English and French with instant language switching
- **📱 Mobile-First Design**: Optimized for touch interactions and responsive across all devices
- **📊 Score Tracking**: Keep track of correct answers across multiple rounds
- **🎯 Smart Question Generation**: Avoids repeating the same country consecutively
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
- localStorage persistence for language selection
- Flag images hotlinked from Wikimedia Commons (free, no downloads needed)

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
```

## 🌐 Deployment to GitHub Pages

This project is designed to be deployed to GitHub Pages with zero configuration:

### Basic Deployment Steps

1. **Build the project**:
   ```bash
   npm run build
   ```
   This creates an optimized production build in the `dist/` folder.

2. **Deploy to GitHub Pages**:
   - The `dist/` folder contains all static files needed
   - You can use GitHub Actions, `gh-pages` npm package, or manual deployment
   - Configure your repository settings to serve from the appropriate branch

3. **GitHub Actions Example** (optional):
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

### Base Path Configuration

If deploying to a subdirectory (like `https://username.github.io/find-the-flag/`), update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/find-the-flag/', // Match your repo name
  // ...rest of config
})
```

## 📁 Project Structure

```
find-the-flag/
├── src/
│   ├── components/          # React components
│   │   ├── FlagImage.tsx   # Flag display with error handling
│   │   ├── GamePage.tsx    # Main game interface
│   │   ├── HomePage.tsx    # Landing page
│   │   └── LanguageToggle.tsx
│   ├── contexts/           # React context providers
│   │   ├── LanguageContext.tsx
│   │   └── useLanguage.ts
│   ├── data/
│   │   └── countries.ts    # 48 countries with flag URLs
│   ├── i18n/               # Internationalization
│   │   ├── en.ts           # English translations
│   │   ├── fr.ts           # French translations
│   │   └── index.ts        # i18n utilities
│   ├── lib/
│   │   └── game.ts         # Pure game logic functions
│   ├── styles/
│   │   ├── index.css       # Global styles & CSS variables
│   │   └── App.css         # Component styles
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   ├── App.tsx             # Root component with routing
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🎯 How to Play

1. **Start**: Click "Start Game" on the home page
2. **Identify**: Look at the flag and choose the correct country from 4 options
3. **Feedback**: Get instant feedback on your answer with the correct answer shown
4. **Continue**: Click "Next" to get a new flag or "Restart" to reset your score
5. **Switch Language**: Toggle between EN/FR at any time

## 🖼️ Flag Images Attribution

All flag images are sourced from **Wikimedia Commons** and are in the public domain or licensed under Creative Commons. Flags are hotlinked directly from Wikimedia's servers, requiring no local storage or downloads.

- Flag images: [Wikimedia Commons](https://commons.wikimedia.org/)
- Format: PNG files, 320px width for optimal performance
- No attribution required for public domain flags, but we acknowledge Wikimedia's excellent resource

## 🔮 Roadmap

Future enhancements planned for this game:

- [ ] **8 Answer Options**: Increase difficulty with more choices
- [ ] **Free-Text Input Mode**: Type the country name for expert mode
- [ ] **Timer Challenge**: Race against the clock for bonus points
- [ ] **Difficulty Levels**: Easy (common flags), Medium, Hard (similar flags)
- [ ] **Regional Challenges**: Focus on specific continents (Africa, Asia, Europe, etc.)
- [ ] **Hint System**: Get clues about population, capital, or continent
- [ ] **Leaderboard**: Track high scores using localStorage
- [ ] **Achievements**: Unlock badges for milestones (10 correct, 50 correct, etc.)
- [ ] **Sound Effects**: Audio feedback for correct/incorrect answers
- [ ] **PWA Support**: Offline capability and installable app
- [ ] **More Languages**: Spanish, German, Italian, Portuguese, etc.
- [ ] **Statistics**: Track performance over time with charts
- [ ] **Share Results**: Share your score on social media

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

- Flag images from [Wikimedia Commons](https://commons.wikimedia.org/)
- Inspired by geography quiz games and educational tools
- Built with modern web technologies and best practices

---

**Enjoy playing Find the Flag! 🎉**
