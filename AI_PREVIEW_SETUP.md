# AI Door Preview - Setup Guide

## What It Does

Customers upload a photo of their door → AI generates a realistic preview showing what it could look like after refinishing.

## Features Added

1. **Standalone Preview Page** (`preview.html`)
   - Drag & drop or click to upload
   - Choose finish type (7 options: natural, dark stain, light stain, paint colors)
   - Choose condition level (light/moderate/heavy wear)
   - Side-by-side before/after comparison
   - CTA buttons to quote form or phone call

2. **Navigation Link** 
   - Added "AI Preview" to main nav menu
   - Hero section now has "✨ See Your Door Transformed" button

3. **Backend API** (`api/generate-preview.js`)
   - Serverless function for Vercel
   - Uses Replicate API + Stable Diffusion
   - img2img transformation for realistic results

## Setup Steps

### 1. Get Replicate API Key (Free Tier Available)

1. Go to https://replicate.com/
2. Sign up for free account
3. Go to Account Settings → API Tokens
4. Copy your API token
5. Cost: ~$0.002 per preview (500 previews for $1)

### 2. Add Environment Variable to Vercel

```bash
cd /Users/jarvis/.openclaw/workspace/grand-doors-site
vercel env add REPLICATE_API_TOKEN
# Paste your Replicate API token when prompted
# Select: Production, Preview, Development (all three)
```

Or via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your grand-doors project
3. Settings → Environment Variables
4. Add: `REPLICATE_API_TOKEN` = `your_token_here`

### 3. Install Dependencies & Deploy

```bash
cd /Users/jarvis/.openclaw/workspace/grand-doors-site
npm install
git add .
git commit -m "Add AI door preview feature"
git push
```

Vercel will auto-deploy with the API endpoint.

### 4. Update Frontend to Use Real API

The `preview.html` currently has a mock/demo mode. Once the API is deployed, the backend will automatically work.

## How It Works

1. **User uploads photo** → Converted to base64
2. **Selects finish type** → Generates AI prompt
3. **Clicks "Generate"** → Sends to `/api/generate-preview`
4. **Backend processes** → Stable Diffusion img2img (30-60 sec)
5. **Returns transformed image** → Shows before/after comparison
6. **User sees result** → CTAs to quote or call

## Pricing & Usage

- **Replicate API**: ~$0.002 per generation
- **Expected volume**: 50-100 previews/month initially
- **Monthly cost**: $0.10-$0.20 (negligible)
- **Upgrade**: If you hit 10,000 previews/month, cost is ~$20/month

## Alternative Options (If Budget Constrained)

### Option 1: Manual Preview Service
Instead of real-time AI:
- Form says "Upload photo, we'll email you a preview in 24 hours"
- You manually edit 1-2 photos in Photoshop
- Shows commitment, gets leads, zero API cost

### Option 2: Pre-Generated Gallery
- Create 10-15 AI-generated examples
- Show as a gallery: "Results You Can Expect"
- Simpler, no per-use cost
- Less personalized but still effective

### Option 3: Simple Photo Filter
- Apply Instagram-style filters to uploaded photos
- No AI, instant results, free
- Less impressive but better than nothing

## Current Status

✅ Frontend built (`preview.html`)  
✅ Navigation links added  
✅ Backend API created (`api/generate-preview.js`)  
⏳ Replicate API token needed  
⏳ Deploy with `npm install && git push`

## Testing

Once deployed, test at:
- https://granddoorsrefinishing.com/preview.html

To test locally:
```bash
cd /Users/jarvis/.openclaw/workspace/grand-doors-site
vercel dev
# Visit http://localhost:3000/preview.html
```

---

**Want me to deploy this now?** Just get the Replicate API key and I'll finish the setup in 5 minutes.

**OR prefer a simpler approach?** Let me know and I can build Option 1 or 2 instead (no API costs).
