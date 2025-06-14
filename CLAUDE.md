# Painting Quote App - Project Instructions

## Project Overview
This is a Next.js painting quote application with SQLite database, Google Gemini AI integration, and a comprehensive quoting system.

## Key Commands
- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm start` - Start production server

## User Flow Overview
1. **Access Code Entry** (`/access-code`) - Enter company access code (DEMO2024, PAINTER001, CONTRACTOR123)
2. **Customer Dashboard** (`/dashboard`) - Quote management and business overview
3. **Quote Creation** (`/create-quote`) - AI-powered conversational quote generation
4. **Admin Portal** (`/admin`) - Complete business management (admin@paintingapp.com / admin123)

## Product Management
- **Settings Page** (`/settings/products`) - Manual product editing
- **Chat Interface** (`/settings/products/chat`) - Conversational updates
- **Bulk Operations** - Percentage price increases, product additions

## Enhanced Quote Creation System (LATEST UPDATES)
- **Smart Measurement Logic** - Only asks for measurements actually needed based on selected surfaces
- **Surface-Specific Flow** - Ceiling-only projects skip wall dimensions and doors/windows count
- **Interactive Paint Selection** - Brand and product selection with visual styling and quality indicators
- **Paint Cost Validation** - Category-by-category cost validation questions
- **Required Surface Selection** - Users must select surfaces before proceeding to measurements
- **Quote Editing Menu** - Comprehensive editing with customer info, dimensions, and paint selection options
- **Real-time Updates** - Live price calculations and measurement explanations

## Current Status (Updated Jun 14, 2025)
- **Smart Measurement Collection**: ✅ Surface-specific measurement logic implemented
- **Enhanced Paint Selection**: ✅ Interactive brand/product selection with 12 products across 4 brands
- **Customer Name Parsing**: ✅ Fixed possessive pronoun parsing issues
- **Surface Selection UX**: ✅ Required surface selection before measurements
- **Quote Editing**: ✅ Comprehensive quote editing menu with real-time updates
- **Admin Portal**: ✅ Fully operational with customer management and analytics
- **Quote Calculations**: ✅ Fixed NaN errors, all pricing working correctly
- **Customer Base**: 3 active companies, 9 quotes, $25,398+ total revenue tracked
- **Mobile Ready**: ✅ Responsive design on all devices
- **Docker Ready**: ✅ Production build tested and operational

## Architecture & Structure
- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom UI components in `/components/ui/`
- **Database**: SQLite with better-sqlite3, full admin tables
- **AI Integration**: Google Generative AI for quote assistance
- **State Management**: React Hook Form with Zod validation
- **Admin System**: JWT-based authentication with session management

## Code Standards
- Use TypeScript strictly - no `any` types unless absolutely necessary
- Follow existing component patterns in `/components/`
- Use the custom UI components from `/components/ui/` instead of creating new ones
- Maintain consistent file naming: kebab-case for files, PascalCase for components
- Keep API routes in `/app/api/` following Next.js 14 conventions

## Database Guidelines
- Database file: `painting_quotes_app.db`
- Schema initialization handled automatically via `/lib/database/init.ts`
- Use prepared statements for all queries
- Handle database errors gracefully with proper error messages

## Enhanced Quote Creation Logic
- **Customer Name Parsing** (`/lib/improved-conversation-parser.ts`) - Fixed "Name and his/her/their address" patterns
- **Smart Measurement Collection** (`/app/create-quote/page.tsx`) - Surface-specific measurement logic
- **Paint Selection System** (`/api/paint-products/brands`, `/components/ui/paint-*-selector.tsx`) - Interactive brand/product selection
- **Conversation Stages** - `paint_brand_selection`, `paint_product_selection`, `paint_cost_validation`, `quote_editing`, `ready_for_paint_selection`

## Component Best Practices
- Use server components by default, client components only when needed
- Implement proper loading states and error boundaries
- Keep components focused and single-purpose
- Use the existing toast system for user notifications

## Testing & Quality
- Run `npm run lint` before committing
- Test responsive design on mobile and desktop
- Verify database operations don't block the UI
- Ensure all forms have proper validation

## Common Workflows
1. **Adding new features**: Check existing patterns in similar components first
2. **Database changes**: Update schema in `/lib/database/schema.sql`
3. **UI updates**: Use existing components from `/components/ui/`
4. **API endpoints**: Follow RESTful conventions in `/app/api/`

## Security Considerations
- Sanitize all user inputs
- Use parameterized queries for database operations
- Validate API requests with Zod schemas
- Keep sensitive configuration in environment variables

@README.md
@package.json

## Personal Preferences
@~/.claude/CLAUDE.md

## Efficiency Instructions
@~/.claude/efficiency-instructions.md

## Latest Test Results (Jun 14, 2025)
- **Smart Measurement Logic**: ✅ Ceiling-only projects skip unnecessary measurements
- **Customer Name Parsing**: ✅ "Sarah Martinez and her address is 456 Oak Street" → Name: "Sarah Martinez"
- **Paint Selection System**: ✅ 12 products across 4 brands (Sherwin-Williams, Benjamin Moore, Kilz, Zinsser)
- **Surface Selection UX**: ✅ Required surface selection prevents user confusion
- **Quote Creation API**: ✅ New quotes created successfully (QUOTE-MBWSOJ29-B55ID8)
- **Docker Deployment**: ✅ Production build and end-to-end testing completed
- **Database Integrity**: ✅ 9 quotes, $25,398+ revenue tracked across 3 companies
- **Git Branch**: ✅ `feature/smart-measurement-collection` created with all improvements

## Key File Updates (Jun 14, 2025)
- `app/create-quote/page.tsx` - Smart measurement logic and paint selection stages
- `lib/improved-conversation-parser.ts` - Fixed customer name parsing with possessive pronouns
- `app/api/paint-products/brands/route.ts` - Brand/category grouping API
- `components/ui/paint-brand-selector.tsx` - Visual brand selection component
- `components/ui/paint-product-selector.tsx` - Product selection with quality indicators