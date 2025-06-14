# Painting Quote App - Project Instructions

## Project Overview
This is a Next.js painting quote application with SQLite database, Google Gemini AI integration, and a comprehensive quoting system.

## Key Commands
- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm start` - Start production server

## New User Onboarding Flow
1. **Access Code Entry** (`/access-code`) - Enter company access code
2. **Welcome Page** (`/success`) - New companies redirected to onboarding
3. **Conversational Setup** (`/onboarding/setup`) - AI-guided product configuration
4. **Dashboard** - Complete setup and start creating quotes

## Product Management
- **Settings Page** (`/settings/products`) - Manual product editing
- **Chat Interface** (`/settings/products/chat`) - Conversational updates
- **Bulk Operations** - Percentage price increases, product additions

## Quote Editing System
- **Interactive Edit Page** (`/quotes/[id]/edit`) - Component-based quote editing
- **Edit Buttons** - Click to edit specific parts: Customer info, rooms, measurements, paint quality
- **Auto-Calculation** - Automatic quote recalculation when measurements change
- **Room Editor** - Individual room dimension and feature editing
- **Live Updates** - Real-time price updates as changes are made

## Architecture & Structure
- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom UI components in `/components/ui/`
- **Database**: SQLite with better-sqlite3
- **AI Integration**: Google Generative AI for quote assistance
- **State Management**: React Hook Form with Zod validation

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

## AI Assistant Integration
- AI logic is in `/lib/enhanced-assistant.ts` and `/lib/professional-friend-ai.ts`
- Keep AI responses professional yet friendly
- Ensure quote calculations are accurate and transparent

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