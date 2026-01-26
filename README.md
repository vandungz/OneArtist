# 🎵 ArtistOne - Music Artist Portfolio

Modern music artist portfolio website built with **Next.js 16** and **Supabase**. A serverless, full-stack solution for independent artists to showcase their music, albums, and professional profile.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)

## ✨ Features

- 🎨 **Artist Profile** - Professional artist bio, avatar, and social links
- 💿 **Discography** - Album grid with Singles, EPs, and Albums
- 🎧 **Spotify Embed** - Integrated Spotify player for streaming music
- 📺 **YouTube Embed** - Music video integration
- 🖼️ **Hero Gallery** - Animated image gallery with blur-wipe reveal effect
- 🌓 **Dark/Light Theme** - Toggle between themes with smooth transitions
- 📱 **Responsive Design** - Mobile-first, works on all devices
- ⚡ **Server-Side Rendering** - Fast page loads with Next.js App Router

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Frontend** | React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, Custom CSS |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage (Images, Media) |
| **Icons** | Lucide React |
| **Fonts** | DM Sans (Google Fonts) |
| **Deployment** | Vercel |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout with Navbar
│   ├── globals.css        # Global styles entry
│   └── albums/[slug]/     # Dynamic album detail pages
├── components/
│   ├── album/             # Album-related components
│   │   ├── AlbumInfo.tsx
│   │   ├── SpotifyEmbed.tsx
│   │   └── YouTubeEmbed.tsx
│   ├── layout/            # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroGallery.tsx
│   │   └── HeroImage.tsx
│   ├── shared/            # Reusable components
│   │   ├── AlbumCard.tsx
│   │   ├── ProfileCard.tsx
│   │   └── SocialLinks.tsx
│   └── ui/                # UI primitives
│       └── ThemeToggle.tsx
├── services/              # Data fetching layer
│   ├── albums.ts          # Album CRUD operations
│   ├── artists.ts         # Artist data operations
│   └── storage.ts         # Supabase Storage utilities
├── lib/
│   ├── utils.ts           # Utility functions
│   └── supabase/          # Supabase client config
│       ├── client.ts      # Browser client
│       ├── server.ts      # Server client
│       └── database.types.ts
├── styles/                # Modular CSS architecture
│   ├── variables.css      # CSS custom properties
│   ├── base.css           # Base/reset styles
│   ├── typography.css     # Typography system
│   ├── responsive.css     # Responsive breakpoints
│   ├── components/        # Component-specific styles
│   ├── layout/            # Layout styles
│   └── pages/             # Page-specific styles
├── providers/
│   └── ThemeProvider.tsx  # Theme context provider
└── types/
    └── index.ts           # TypeScript interfaces
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account (free tier available)

### 1. Clone & Install

```bash
git clone <repository-url>
cd artist-one
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migrations from `supabase/migrations/` in Supabase SQL Editor
3. Create a storage bucket named `artist_assets` (set to public)

### 3. Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📊 Database Schema

### Tables

**`artists`**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Artist name |
| bio | TEXT | Artist biography |
| avatar_url | TEXT | Avatar image URL |

**`albums`**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| artist_id | UUID | Foreign key to artists |
| title | TEXT | Album title |
| slug | TEXT | URL-friendly identifier |
| bio | TEXT | Album description |
| release_year | INT | Year of release |
| album_type | TEXT | Album, EP, Single, Mixtape |
| genre | TEXT | Music genre |
| featured_artists | TEXT | Comma-separated featured artists |
| cover_url | TEXT | Cover image URL |
| youtube_video_id | TEXT | YouTube video ID |
| spotify_album_id | TEXT | Spotify album/track ID |
| spotify_url | TEXT | Full Spotify URL |
| is_featured | BOOLEAN | Show on homepage |
| display_order | INT | Sort order |

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 Customization

### Theme Colors

Edit CSS variables in `src/styles/variables.css`:

```css
:root {
  --primary-color: #your-color;
  --background: #your-bg;
  --text-color: #your-text;
}
```

### Adding New Albums

See [docs/SETUP_SUPABASE_DATA.md](docs/SETUP_SUPABASE_DATA.md) for detailed instructions on adding albums via SQL.

## 🚢 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js)

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 👨‍💻 Author

**Nguyễn Văn Dũng**  
Fullstack Developer  

## 📄 License

This project is for portfolio/demonstration purposes.
