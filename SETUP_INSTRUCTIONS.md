# Grand Doors Website - Setup Instructions

## ✅ What's Been Added

### 1. **Quote Request Form** (#quote section)
- Full contact form with name, phone, email, address
- Service selection dropdown
- Project details textarea
- Photo upload capability (for door photos)
- Form validation
- Success message on submission

### 2. **Square Payment Integration** (Contact section)
- "Pay Deposit or Full Amount" button
- Modal with two payment options:
  - Pay 50% Deposit
  - Pay Full Amount
- Ready for Square payment links

### 3. **Google Analytics** (Head section)
- Tracking code added
- Conversion tracking for quote submissions
- Event tracking for payment intent

### 4. **Facebook Pixel** (Head section)
- Pixel code added
- Lead tracking on quote form submission
- Checkout initiation tracking on payment modal

### 5. **UX Improvements**
- Sticky header (stays visible while scrolling)
- Smooth scrolling navigation
- Mobile responsive design maintained
- Better CTAs throughout

---

## 🔧 Required Setup Steps

### Step 1: Google Analytics
1. Go to https://analytics.google.com/
2. Create a new property for "Grand Doors"
3. Get your Measurement ID (looks like `G-XXXXXXXXXX`)
4. Replace `G-XXXXXXXXXX` in line 8 of index.html
5. Replace `G-XXXXXXXXXX` in line 11 of index.html

### Step 2: Facebook Pixel
1. Go to https://business.facebook.com/events_manager
2. Create a new pixel for "Grand Doors"
3. Get your Pixel ID (numeric, like `1234567890`)
4. Replace `YOUR_PIXEL_ID` in line 20 of index.html (appears twice)

### Step 3: Square Payment Links
1. Go to https://squareup.com/dashboard/online/checkout/payment-links
2. Create two payment links:
   - **Deposit Link**: Set amount to 50% of average job ($50-$100)
   - **Full Payment Link**: Variable amount or specific packages
3. Copy the payment link URLs
4. Replace `https://square.link/u/YOURLINKHERE` in lines 282 and 286 of index.html

### Step 4: Form Backend (Email Notifications)
**Options:**
- **FormSpree** (easiest): https://formspree.io/
  - Create account, get form endpoint
  - Add `action="https://formspree.io/f/YOUR_ID"` to form tag
- **EmailJS** (free): https://www.emailjs.com/
  - Client-side email sending
  - Add script and configure
- **Custom Backend**: Build Node.js/PHP script to handle form submissions

### Step 5: Calendly/Square Appointments (Optional)
If you want booking functionality:
- **Calendly**: https://calendly.com/ (free tier available)
- **Square Appointments**: https://squareup.com/us/en/appointments
  - Integrate scheduling widget into website

---

## 📊 Testing Checklist

- [ ] Test quote form submission
- [ ] Verify form validation works
- [ ] Test photo upload
- [ ] Check payment modal opens/closes
- [ ] Test Square payment links (don't complete payment)
- [ ] Verify analytics tracking in Google Analytics dashboard
- [ ] Check Facebook Pixel events in Events Manager
- [ ] Test mobile responsiveness
- [ ] Verify all navigation links work
- [ ] Test smooth scrolling

---

## 🚀 Deployment

The website is configured to auto-deploy via Vercel when you push to GitHub.

**Current Status:**
- ✅ Code pushed to GitHub
- ✅ Vercel will auto-deploy within 2-3 minutes
- ✅ Live at: https://granddoorsrefinishing.com

**To verify deployment:**
```bash
cd /Users/jarvis/.openclaw/workspace/grand-doors-site
git status
```

---

## 🎨 AI Door Preview Tool (Future Enhancement)

For the AI door preview feature ("upload photo → see refinished result"):

**Options:**
1. **Replicate API** + Stable Diffusion inpainting
2. **OpenAI DALL-E** API with image editing
3. **Custom ML model** (more complex, higher quality)

**Estimated cost:** $50-$200 to build + $10-50/month API costs

Would you like me to build this next?

---

## 📞 Next Steps

1. **Get John's approval** on the new website features
2. **Set up Square payment links** (priority!)
3. **Configure Google Analytics** and **Facebook Pixel**
4. **Choose form backend** solution (FormSpree recommended for quick start)
5. **Launch marketing campaigns** once tracking is live

---

**Questions? Need help with setup?** Let me know and I'll walk you through each step.
