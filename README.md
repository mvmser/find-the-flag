# 🌍 Find the Flag

A mobile-first, fully static flag guessing web game available in English and French. Test your knowledge of world flags in this fun and educational game!

## 📖 About the Game

Find the Flag is an interactive web game where players guess which country a flag belongs to. The game is designed with a mobile-first approach, ensuring a smooth experience on all devices, from smartphones to desktops.

### Game Features

- **Mobile-First Design**: Optimized for touch interactions and small screens
- **Bilingual Support**: Play in English (EN) or French (FR)
- **Score Tracking**: Keep track of your performance across rounds
- **Lives System**: Limited attempts to keep the challenge engaging
- **Progressive Difficulty**: Questions get harder as you advance
- **Fully Static**: No backend required, runs entirely in the browser

## 🛠️ Tech Stack

This project is built with modern web technologies:

- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling for fast development
- **[React](https://react.dev/)**: Component-based UI library
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript for better developer experience
- **CSS3**: Modern styling with responsive design principles

### Project Structure

```
find-the-flag/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, flags, icons
│   ├── components/      # React components
│   ├── locales/         # i18n translations (EN/FR)
│   ├── styles/          # CSS files
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Application entry point
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 🎯 Goals

1. **Educational**: Help players learn world flags and geography
2. **Accessible**: Easy to use for all age groups and skill levels
3. **Performant**: Fast loading times and smooth interactions
4. **Responsive**: Works seamlessly on mobile, tablet, and desktop
5. **Deployable**: Easy deployment to GitHub Pages with zero backend costs

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mvmser/find-the-flag.git

# Navigate to the project directory
cd find-the-flag

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌐 Deployment

This project is configured for GitHub Pages deployment. The build output will be in the `dist/` directory.

To deploy:

```bash
# Build the project
npm run build

# The dist/ folder can be deployed to GitHub Pages
```

## 🔮 Future Features

The following features are planned for future releases:

- [ ] **Difficulty Levels**: Easy, Medium, Hard modes with different flag sets
- [ ] **Timed Mode**: Race against the clock for bonus points
- [ ] **Leaderboard**: Track high scores locally
- [ ] **Hint System**: Get clues about the country (continent, population, capital)
- [ ] **Regional Challenges**: Focus on specific continents or regions
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Sound Effects**: Audio feedback for correct/incorrect answers
- [ ] **Achievements**: Unlock badges for milestones
- [ ] **Share Results**: Share your score on social media
- [ ] **Offline Support**: Progressive Web App (PWA) capabilities
- [ ] **More Languages**: Expand beyond EN/FR (ES, DE, IT, etc.)
- [ ] **Flag Details**: Learn interesting facts about each country

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**mvmser**

- GitHub: [@mvmser](https://github.com/mvmser)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Note**: This is currently a project structure setup. Implementation of game features is in progress.
