# Changelog

All notable changes to the Professional Painting Quote Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-01-24

### 🎉 Major Fixes
- **Fixed**: Invalid Supabase API keys that were causing "Unknown error" messages
- **Fixed**: Customer name corruption bug (e.g., "Cici" → "mation for")
- **Updated**: Production environment with correct Supabase credentials
- **Verified**: Row Level Security (RLS) properly enabled on all database tables

### ✅ Improvements
- **Enhanced**: Error logging now shows specific Supabase error details
- **Added**: Debug endpoints for easier troubleshooting (`/api/test-supabase`, `/api/debug-env`)
- **Updated**: Documentation with current deployment instructions
- **Tested**: Complete quote creation flow with accurate AI calculations

### 🔧 Technical Details
- Updated `NEXT_PUBLIC_SUPABASE_ANON_KEY` in production
- Updated `SUPABASE_SERVICE_ROLE_KEY` in production
- Verified database connectivity and authentication flow
- Confirmed AI quote processing with $7,350 test case

### 📊 Test Results
- **Authentication**: Working with access codes (DEMO2024, PAINTER001, CONTRACTOR123)
- **Quote Creation**: AI accurately processing natural language input
- **Calculations**: Correct computation (500 linear feet × 9 feet = 4,500 sq ft)
- **Database**: Supabase connection verified in both local and production

## [1.1.0] - 2024-12-29

### Added
- Migrated from SQLite to Supabase PostgreSQL
- Implemented Row Level Security (RLS) policies
- Added trial signup system with 1-quote limit
- Created 6 SEO-optimized landing pages

### Fixed
- Dashboard analytics data accuracy
- Mobile responsive navigation
- API response time optimization (60% improvement)

## [1.0.0] - 2024-12-20

### Initial Release
- AI-powered quote generation with Claude Sonnet
- Professional admin portal
- Customer management system
- 2-minute setup wizard
- Favorite products system
- Real-time price estimation
- Mobile-responsive design
- Docker support