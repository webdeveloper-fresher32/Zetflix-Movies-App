# ZetFlix 🎬

A modern, responsive web application for discovering and exploring movies and TV shows. Built with React, TypeScript, and Tailwind CSS, ZetFlix provides an intuitive interface for browsing popular media content with advanced filtering and search capabilities.

## ✨ Features

- **🎭 Multi-Media Support**: Browse both movies and TV shows
- **🔍 Advanced Search**: Search across movies and TV shows with real-time results
- **🎨 Genre Filtering**: Filter content by genres for personalized discovery
- **💾 Watchlist Management**: Save your favorite movies and TV shows to a personal watchlist
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **⚡ Fast Performance**: Built with Vite for lightning-fast development and builds
- **🎨 Modern UI**: Beautiful, Netflix-inspired interface with dark theme
- **📊 Detailed Information**: View comprehensive details for each movie and TV show
- **🔄 Infinite Scroll**: Load more content seamlessly with pagination

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API Integration**: TMDB (The Movie Database)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd zetflix-movie-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add your TMDB API key:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```
   
   To get a TMDB API key:
   - Visit [TMDB](https://www.themoviedb.org/)
   - Create an account
   - Go to Settings → API
   - Request an API key for developer use

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application.

## 📁 Project Structure

```
src/
├── api/
│   └── tmdb.ts              # TMDB API integration
├── components/
│   ├── ErrorMessage.tsx     # Error display component
│   ├── GenreFilter.tsx      # Genre filtering component
│   ├── Hero.tsx             # Hero section component
│   ├── LoadingSpinner.tsx   # Loading indicator
│   ├── MediaCard.tsx        # Movie/TV show card component
│   ├── MediaRow.tsx         # Horizontal media row
│   └── Navbar.tsx           # Navigation component
├── context/
│   └── WatchlistContext.tsx # Watchlist state management
├── pages/
│   ├── Home.tsx             # Home page
│   ├── MovieDetails.tsx     # Movie details page
│   ├── Movies.tsx           # Movies listing page
│   ├── Search.tsx           # Search results page
│   ├── TVShows.tsx          # TV shows listing page
│   └── Watchlist.tsx        # Watchlist page
├── App.tsx                  # Main app component
├── main.tsx                 # App entry point
└── index.css                # Global styles
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🎨 Key Features Explained

### Home Page
- Hero section with featured content
- Quick access to popular movies and TV shows
- Recent additions to your watchlist

### Movies & TV Shows Pages
- Grid layout with responsive design
- Genre filtering capabilities
- Load more functionality with pagination
- Client-side genre filtering

### Search Functionality
- Real-time search across movies and TV shows
- Debounced search input for optimal performance
- Search results with media type indicators

### Watchlist Management
- Add/remove movies and TV shows
- Persistent storage using localStorage
- Cross-page watchlist synchronization

### Media Details
- Comprehensive information display
- Cast and crew details
- Similar content recommendations
- Add to watchlist functionality

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

### TypeScript
TypeScript configuration is set up in `tsconfig.json` and `tsconfig.app.json`.

### Vite
Vite configuration is in `vite.config.ts` with React plugin enabled.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

### Recommended Hosting Platforms
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie and TV show data API
- [Lucide React](https://lucide.dev/) for the beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for movie and TV show enthusiasts** 