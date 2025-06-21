# OpenRouter API Setup Guide

## 🚀 Quick Setup

### 1. Get Your OpenRouter API Key
1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Add credit ($5 minimum, lasts for ~1,850 quotes with GPT-4o mini)
3. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
4. Create a new API key

### 2. Local Development
Add to your `.env.local` file:
```bash
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### 3. Vercel Deployment
Add to Vercel Environment Variables:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add new variable:
   - Name: `OPENROUTER_API_KEY`
   - Value: `sk-or-v1-your-key-here`
   - Environment: Production (and Preview if desired)
4. Redeploy your application

## 💰 Cost Breakdown

**GPT-4o mini pricing:**
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens

**Per Quote Cost:**
- ~10K input tokens + ~2K output tokens
- Cost: ~$0.0027 per quote
- 1000 quotes = $2.70/month

## 🔧 Testing Your Integration

### Option 1: Test Page
Visit `/test-claude` to compare AI responses with current system

### Option 2: AI Quote Creation
Visit `/create-quote-ai` to try the full AI-powered quote flow

### Option 3: API Test
```bash
curl -X POST http://localhost:3001/api/test-gpt4o \
  -H "Content-Type: application/json" \
  -d '{"message": "500 by 9", "stage": "measurements"}'
```

## 🎯 Current Implementation

The AI assistant is ready to use in:
- `/lib/gpt4o-mini-assistant.ts` - Core AI logic
- `/app/create-quote-ai/page.tsx` - AI-powered quote creation
- `/app/api/test-gpt4o/route.ts` - API endpoint for testing

## 🚨 Common Issues

**"API key not configured"**
- Make sure `OPENROUTER_API_KEY` is in your `.env.local`
- Restart your dev server after adding the key

**"Insufficient credits"**
- Add credits at [openrouter.ai/account](https://openrouter.ai/account)
- $5 minimum purchase

**Rate limits**
- GPT-4o mini: 500 requests/minute
- Should handle 8+ concurrent users easily