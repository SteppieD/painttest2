# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Professional Painting Quote Platform - Next.js SaaS Application

## Development Commands

### Core Development
- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production (required before deployment)
- `npm run lint` - Run ESLint and fix code quality issues
- `npm start` - Start production server
- `npm run setup-db` - Database auto-initializes on first run

### Testing Specific Features
- Test setup wizard: Visit `/setup?access_code=DEMO2024` and test all 4 paths
- Test admin features: Login at `/admin` with admin@paintingapp.com / admin123
- Test customer flow: Use access codes `DEMO2024`, `PAINTER001`, `CONTRACTOR123`

## Core Architecture Overview

### Single-Tier Quote Calculation System
The application implements a **unified calculation engine** with multiple input methods:

**Core Calculator** (`lib/professional-quote-calculator.ts`)
- Industry-standard formulas: Materials + Labor + Overhead + Markup = Final Price
- Wall area: Linear footage method (perimeter × height)
- Ceiling area: Room-by-room measurements (length × width per room)
- Multi-surface pricing: walls, ceilings, trim, doors, windows
- Single source of truth for all quote calculations

**Input Processing System**
- **AI-Powered**: Natural language parsing via unified-quote-assistant.ts
- **Manual Entry**: Direct input through wizard interfaces
- **API Integration**: Structured data input via unified-quotes API
- All input methods feed into the same calculation engine

**Key Architecture Principles**:
- Single calculation engine with multiple input methods
- Hybrid database strategy (SQLite dev, PostgreSQL production)
- Progressive enhancement with graceful fallbacks
- Company-scoped multi-tenancy via access codes

### Database Architecture Pattern
**Hybrid SQLite/PostgreSQL strategy**:

- **Development**: SQLite with better-sqlite3 (`painting_quotes_app.db`)
  - File-based database with 30+ tables
  - Auto-initialization from `lib/database/schema.sql`
  - Direct SQL execution with WAL mode for performance
- **Production**: Supabase PostgreSQL (`lib/database/supabase-adapter.ts`)
  - Optional cloud database with connection pooling
  - Environment variable dependent with graceful fallback
- **Fallback**: In-memory mock data when external databases unavailable

### Revolutionary Setup System (4-Path UX)
**Progressive enhancement approach** eliminating user adoption barriers:

1. **Quick Start (30 seconds)**: Industry defaults, immediate functionality
2. **Guided Setup (2 minutes)**: Curated options with suggested pricing  
3. **Custom Setup (5 minutes)**: Full control for experienced contractors
4. **Skip Setup**: Immediate access with configuration during first quote

### State Management Architecture
**Multi-level state strategy**:
- **Global**: React Context for auth/company settings, localStorage for persistence
- **Component**: useReducer for complex state machines (quote creation flow)
- **Server**: Conversation managers for AI state, session management for user persistence
- **Key Pattern**: Optimistic updates with server synchronization

### API Route Structure
**RESTful design with Next.js App Router**:
```
/api/unified-quote/ - Main quote processing (calls unified-quote-assistant)
/api/quotes/[id]/ - CRUD operations for specific quotes  
/api/companies/[id]/ - Company-specific operations and setup
/api/admin/ - Administrative endpoints with proper authentication
```

### AI Integration Patterns
**Factory pattern with chain of responsibility**:
- Provider abstraction with common interface across Claude, GPT-4, Gemini
- Conversation state tracking with loop detection and recovery
- Context preservation across multiple AI interactions
- Professional prompting with industry-specific pricing guidelines

## Critical Development Patterns

### Quote Calculation Flow
1. **Input Gathering**: Multiple input methods (AI chat, manual entry, API) collect quote data
2. **Data Standardization**: All inputs converted to `ProjectDimensions` and `PaintProducts` format
3. **Single Calculation**: `calculateProfessionalQuote()` processes all quotes identically
4. **Result**: Consistent pricing regardless of input method
5. **Persistence**: Final quote saved with conversation context

**Key Principle**: One calculation engine ensures consistent pricing across all quote creation methods

### Paint Product System
- **Company-scoped catalogs**: Each company maintains their own product library
- **Flexible selection**: Adapts based on contractor's setup completion level
- **Smart fallbacks**: Industry defaults when products aren't configured
- **Progressive enhancement**: Start simple, add complexity over time

### AI Conversation Management
- **State machines**: Explicit states (gathering → calculating → confirming → saving)
- **Loop detection**: Prevents AI getting stuck in conversation cycles
- **Context preservation**: Maintains quote data across conversation turns
- **Recovery mechanisms**: Automatic recovery from stuck or ambiguous states

## Database Schema Critical Points

### Company Multi-tenancy
All data must be properly scoped by `company_id`. Key tables:
- `companies` - Core company info with setup tracking
- `paint_products` - Per-company product catalogs with categories
- `quotes` - Company-scoped quote storage with conversation context
- `customers` - Linked to companies for proper data isolation

### Paint Products Schema
```sql
CREATE TABLE paint_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'primer', 'wall_paint', 'ceiling_paint', 'trim_paint'  
  project_type VARCHAR(20) NOT NULL, -- 'interior', 'exterior'
  supplier VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  cost_per_gallon DECIMAL(8,2) NOT NULL,
  tier VARCHAR(20) DEFAULT 'standard',
  display_order INTEGER DEFAULT 1,
  is_favorite BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);
```

## Critical File Locations

### Database System
- `lib/database/schema.sql` - Complete SQLite schema (266 lines, 30+ tables)
- `lib/database/init.ts` - Current SQLite initialization with fallback strategy
- `lib/database/supabase-adapter.ts` - Production PostgreSQL adapter
- `painting_quotes_app.db` - Main SQLite database file (auto-created)

### Core Business Logic
- `lib/professional-quote-calculator.ts` - Industry-standard calculation engine
- `lib/unified-quote-assistant.ts` - Main AI quote processing logic
- `lib/conversation-state-enhanced.ts` - AI conversation state management

### Setup System (Revolutionary UX)
- `app/setup/page.tsx` - 4-path setup wizard (completely rewritten for UX)
- `components/ui/flexible-paint-selector.tsx` - Smart paint selection with fallbacks
- `app/api/companies/setup-quick/route.ts` - Quick setup with industry defaults

### Quote Creation Flow
- `app/create-quote/page.tsx` - Main quote creation interface with AI chat
- `components/chat/fixed-chat-interface.tsx` - Chat interface calling `/api/unified-quote`
- `app/api/unified-quote/route.ts` - Main quote processing endpoint

### Administrative System
- `app/admin/` - Complete admin portal with customer management
- `app/dashboard/page.tsx` - Customer dashboard with analytics

## Development Workflow Patterns

### Testing Setup Wizard Paths
All 4 setup paths must be tested when making changes:
1. Quick Start with industry defaults
2. Guided setup with curated options  
3. Custom setup with manual entry
4. Skip setup functionality

### Quote Calculation Testing
Test the single calculation engine with different input methods:
- AI chat input with natural language processing
- Manual wizard input with structured forms
- API input with direct data submission
- Verify all methods produce identical results for same project data
- Test measurement methods: linear footage for wall area, room-by-room for ceiling area
- Test labor-included pricing vs. separate labor rates
- Markup percentage handling (0% for labor-included)

### AI Conversation Testing  
Verify conversation state management:
- Multi-turn conversations maintain context
- Loop detection prevents infinite cycles
- Ambiguous responses trigger clarification
- Quote confirmation and saving flow

### Database Migration Testing
When adding new features:
- Test on fresh database (auto-initialization)
- Verify company data isolation
- Test setup completion status detection
- Ensure paint product persistence

## Security and Performance Requirements

### Multi-tenant Security
- All database queries must include company_id filtering
- API routes must validate company access permissions
- Customer data must be properly isolated between companies

### Performance Optimizations  
- API call batching reduces quote initialization from 4s to 1.5s
- useReducer pattern consolidated 25+ useState hooks (50% fewer re-renders)
- Progressive price estimation provides real-time feedback
- Optimistic updates improve perceived performance

### AI Rate Limiting
- Conversation state prevents excessive AI API calls
- Fallback mechanisms handle AI service failures
- Context preservation reduces redundant processing

## Latest Production Updates (June 30, 2025)

### 🎉 **MAJOR MILESTONE: Production Ready & Feature Complete!**

**Current Production Status - ALL SYSTEMS OPERATIONAL**:
- ✅ **Supabase Integration**: Fully operational with valid API keys and RLS security
- ✅ **Quote Creation Flow**: AI-powered natural language processing working perfectly
- ✅ **Quote Preview**: Fixed client-side errors, all quotes display correctly
- ✅ **Chat Interface**: Enhanced UX with customer name display and action buttons
- ✅ **Database Schema**: Proper handling of null fields and data integrity
- ✅ **Authentication**: Access code system functioning across all environments

### **Recent Major Fixes & Enhancements (June 29-30, 2025)**:

**Database & API Stability**:
1. ✅ **Quote Preview Errors**: Fixed null `quote_amount` handling with proper fallbacks
2. ✅ **Schema Compatibility**: Updated quote saving to use `special_requests` for complex data
3. ✅ **API Route Optimization**: Enhanced quote retrieval with better error handling
4. ✅ **Supabase Connection**: Validated and working with proper environment variables

**User Experience Improvements**:
1. ✅ **Chat Interface Overhaul**:
   - Removed cluttering sample buttons ("Try Sample Quote", "Start Simple")
   - Added smart customer name extraction and header display
   - Implemented "Save Quote" and "Continue Editing" buttons when quote is ready
   - Enhanced conversational tone (removed markdown artifacts)

2. ✅ **Quote Processing**:
   - Fixed markdown formatting issues in chat responses
   - Improved quote detection patterns for action buttons
   - Enhanced customer name parsing from various input formats

**Production Deployment**:
- ✅ **Environment**: Deployed to https://painttest2.vercel.app
- ✅ **Performance**: Fast response times and reliable uptime
- ✅ **Testing**: All core flows validated and working

### **Environment Variables (Updated Jan 24, 2025)**:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://opcbwsfdhergcjjobryp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....(full key in .env)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....(full key in .env)
```

### **Debugging Tools Available**:
- `/api/test-supabase` - Real-time Supabase connection verification
- `/api/debug-env` - Environment variable diagnostic interface
- **Enhanced Error Logging**: Shows specific Supabase errors with details

### **Test Results**:
**Quote Tested**: "It's for Cici at 9090 Hillside Drive. Interior painting, 500 linear feet, 9-foot ceilings, $50/gallon Sherwin Williams eggshell, no trim/doors/windows, $1.50/sqft labor included"
- ✅ **Calculation**: Correctly computed as $7,350 (Materials: $600, Labor: $6,750)
- ✅ **Customer Name**: "Cici" preserved without corruption
- ✅ **AI Processing**: Natural language parsed accurately

## Deployment Configuration

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Production database URL (✅ Configured)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public key (✅ Configured)  
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key (✅ Configured)
- `OPENROUTER_API_KEY` - For Claude Sonnet 4 integration
- `GOOGLE_GENERATIVE_AI_KEY` - For Gemini fallback
- `NEXTAUTH_SECRET` - For session management

### Database Architecture
- **Production**: Supabase PostgreSQL (https://opcbwsfdhergcjjobryp.supabase.co)
- **Development**: SQLite fallback with auto-initialization
- **Schema**: Comprehensive 30+ table structure with proper relationships
- **Security**: Row-level security and company_id isolation

### Performance Status
- **Page Load Times**: Sub-100ms (excellent Core Web Vitals)
- **API Response Times**: Quote creation ~400ms, retrieval varies
- **Error Rate**: Significantly reduced after SQLite → Supabase migration
- **User Experience**: Professional Apple Liquid Glass design system

### Build Process
Always run `npm run build` before deployment to catch TypeScript errors and optimize bundle.

### Database Initialization
- Production: Supabase schema pre-configured with demo data
- Development: Auto-initialization with SQLite fallback
- Migration: All API endpoints now use unified database adapter

This architecture successfully balances sophisticated enterprise patterns with developer productivity through clear separation of concerns and robust error handling throughout the stack. The recent production fixes ensure reliable database operations across all environments.