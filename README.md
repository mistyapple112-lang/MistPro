# MistPro

A modern React + Vite web application built with TypeScript and Tailwind CSS.

## Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mistyapple112-lang/MistPro.git
cd MistPro
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
VITE_APP_ID=your_app_id
VITE_APP_BASE_URL=your_backend_url
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Vercel Deployment

This project is configured for easy deployment on Vercel.

### Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy via GitHub

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the settings from `vercel.json`
6. Click "Deploy"

## Project Structure

```
├── src/
│   ├── components/    # React components
│   ├── pages/        # Page components
│   ├── lib/          # Utility functions and contexts
│   ├── App.jsx       # Main app component
│   └── main.jsx      # Entry point
├── public/           # Static assets
├── vite.config.js    # Vite configuration
├── vercel.json       # Vercel configuration
└── package.json      # Project dependencies
```

## Technologies

- **React** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Radix UI** - Accessible component library

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run typecheck` - Type check with TypeScript

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
