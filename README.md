# Professional Painting Quote Platform

A modern, AI-powered painting quote platform built with Next.js 14, TypeScript, and Tailwind CSS. Features instant quote calculations, professional service management, and SEO-optimized landing pages.

## Features

- 🎨 **AI-Powered Quote System** - Natural language quote requests with intelligent parsing
- 💰 **Instant Price Calculator** - Real-time estimates with professional calculations
- 📍 **Location-Based Landing Pages** - SEO-optimized pages for each service area
- 🏢 **Service Management** - Interior, exterior, commercial, and specialty painting
- 📱 **Mobile-First Design** - Fully responsive on all devices
- 🔍 **SEO Optimized** - Structured data, sitemap, and optimized meta tags
- 💼 **Professional Dashboard** - Customer management and analytics
- 🎯 **Lead Generation** - Optimized conversion funnels

## Tech Stack

- **Framework**: Next.js 14.2.23 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Radix UI + Custom Components
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd my-painting-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
my-painting-app/
├── app/                    # Next.js app router pages
│   ├── calculator/         # Quote calculator
│   ├── locations/          # Location-based landing pages
│   ├── services/           # Service pages
│   └── ...
├── components/             # React components
│   ├── layout/            # Header, Footer
│   ├── ui/                # Reusable UI components
│   └── ...
├── lib/                    # Utilities and services
│   ├── constants.ts       # App constants
│   ├── services/          # Business logic
│   ├── supabase/          # Database client
│   └── utils.ts           # Helper functions
└── public/                 # Static assets
    └── images/            # Optimized images
```

## Key Features Implementation

### Quote Calculator
- Real-time price calculations based on room dimensions
- Support for multiple paint brands and products
- Labor and material cost breakdown
- Professional markup and tax calculations

### SEO Landing Pages
- Dynamic generation for all service areas
- Schema.org structured data
- Optimized meta tags and descriptions
- Mobile-friendly design

### AI Quote System (Planned)
- Natural language understanding
- Intelligent room dimension parsing
- Paint preference detection
- Progressive pricing disclosure

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
```bash
vercel
```

### Environment Variables for Production
Ensure all environment variables are set in your deployment platform:
- Database credentials
- AI API keys (when implemented)
- Site URL

## SEO Optimization

The platform includes:
- Automatic sitemap generation
- Robots.txt configuration
- Structured data for local business
- Optimized meta tags
- Fast page load times
- Mobile-first responsive design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@propaintsolutions.com.