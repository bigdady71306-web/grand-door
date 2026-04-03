# Quote Notification Setup

## Step 1: Set Up FormSpree (Free)

1. Go to https://formspree.io/
2. Sign up with John's email: granddoorsrefinishing21@gmail.com
3. Create a new form called "Grand Doors Quotes"
4. Copy the form endpoint (looks like `https://formspree.io/f/XXXXXXXX`)
5. In the form settings:
   - Set "Email To" to: granddoorsrefinishing21@gmail.com
   - Enable file uploads
   - Set max upload size to 10MB

## Step 2: Update Website

Replace `YOUR_FORM_ID` in index.html (line with `action="https://formspree.io/f/YOUR_FORM_ID"`) with your actual form ID.

## Step 3: Set Up Notifications to Jeremiah

**Option A: Email Forwarding (Simplest)**
1. Set up Gmail forwarding from granddoorsrefinishing21@gmail.com to Jeremiah's email
2. Set up push notifications on Jeremiah's phone for that email

**Option B: Zapier/IFTTT (Recommended)**
1. Sign up for Zapier (free tier works)
2. Create a Zap:
   - Trigger: New FormSpree submission
   - Action: Send SMS to Jeremiah's phone
3. Or send to Telegram: New FormSpree → Send Telegram message to Jeremiah

**Option C: OpenClaw Monitoring (Most Advanced)**
I can create a cron job that:
1. Checks FormSpree for new submissions every 15 minutes
2. Sends you a Telegram message: "New quote request from [Name] for [Service]"
3. You can then follow up immediately

Which option do you prefer?

## Current Status
- ✅ Form sends to John's email via FormSpree
- ⏳ Needs FormSpree form ID
- ⏳ Needs notification method setup

## Quick Test
Once FormSpree is set up, submit a test quote and verify:
1. John receives the email
2. Photos upload correctly
3. You get notified (depending on method chosen)
