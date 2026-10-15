# 💕 Dev Meme Date Proposal & Interactive Planner

An interactive, responsive single-page web application built for immediate deployment on **Vercel** with full mobile and desktop support.

---

## 📱 How Data Reaches You via WhatsApp (Zero Server / Vercel Setup Needed!)

### **Why you don't need any database or backend on Vercel:**
When hosted as a static web app on Vercel:
1. **Client-Side WhatsApp Integration**: When she finishes selecting her date, time, and location, the website formats her exact choices into a WhatsApp dispatch link:
   ```text
   https://wa.me/919811323875?text=<HER_CUSTOM_DATE_CHOICES>
   ```
2. **Instant Delivery**: When she clicks **"Send Plan Directly to Ayush on WhatsApp 💬"**, WhatsApp opens directly on her phone or browser with the message already typed out for your number (`+91 9811323875`).
3. **What You Receive in WhatsApp**:
   ```text
   Hey Ayush! ❤️ YAAAY! IT'S A DATE! 🎉🥰

   Our date plan is officially sealed:
   🗓️ Date: Saturday, Oct 24, 2026
   ⏰ Time: 06:30 PM
   📍 Place: Connaught Place (CP), Delhi 🏛️
   🍽️ Food: Golgappe, Dosa, Rasmalai 😋
   💌 Secret Note: Wear your best smile! 🌸

   Counting down the seconds! See you soon 💕
   ```

---

## ✨ Features Built In

1. **Interactive "No" Button Dodge (No 404 Errors)**:
   - On Desktop: Repositions playfully on hover / mouseover.
   - On Mobile: Teleports playfully on touch / tap.
   - Plays a cartoon swoosh sound effect.
   - The **"YES, Absolutely!"** button grows larger and glows with each dodge attempt.
   - Shows cute teasing captions (*"Wrong button! Try the other one 👉👈"*, *"Oops! Too fast for you! 🏃‍♀️💨"*).

2. **Full Audio Sound Effects (Web Audio API)**:
   - Celebratory fanfare chords on YES.
   - Playful dodge boing when "No" teleports.
   - Crisp circular dial ticking for the clock.
   - Bubble pops on button clicks and chips.
   - Chimes on place card selection.
   - Arpeggio romantic chime on final date confirmation.
   - *(Zero external .mp3 files needed — works 100% offline and in all modern browsers!)*

3. **Calendar Date Picker**:
   - Monthly calendar with past dates disabled.
   - Quick chips for upcoming weekend days (Friday, Saturday, Sunday).
   - Real-time date preview.

4. **Samsung Alarm Clock Circular Dial**:
   - Authentic circular clock dial interface with center hub and rotating indicator hand.
   - Toggle between **Hour (1–12)** and **Minute (00–55)** modes.
   - **AM / PM** toggle capsule.
   - Quick presets (12:30 PM Lunch, 4:30 PM Coffee, 6:30 PM Sunset, 8:00 PM Dinner).
   - Drag or click anywhere on the circle with haptic tick audio.

5. **Curated Place Suggestions**:
   - 🛕 **Gurudwara Shri Bangla Sahib**: Serene vibes, peaceful evening by the Sarovar & blessed Kada Prashad.
   - 🏛️ **Connaught Place (CP), Delhi**: Strolling through iconic colonial colonnades, vibrant streets, central park, bookshops & cafes.
   - ☕🍰 **Cute Aesthetic Cafe**: Warm ambient lighting, coffees, delicious desserts & intimate deep conversations.
   - ✨✍️ **Have Another Favorite Spot?**: Interactive blank input allowing her to type any custom destination!

6. **Food & Cravings Selection**:
   - **Street Snacks & Bites**: Golgappe 🥟, Chaat 🥗, Momos 🥟, Pizza 🍕, Burger 🍔
   - **Hearty Main Course**: Dosa 🥞, Chole Bhature 🫓, Rajma Chawal 🍚
   - **Sweet Cravings**: Brownie 🍫, Ice Cream 🍨, Softy Cone 🍦, Rasmalai 🍮
   - **Surprise Me Option 🎁**: Chef Ayush will curate the feast!
   - 💌 **Secret Demands**: Optional text box for song requests, food allergies, or dress code.

7. **VIP Boarding Pass & Confirmation**:
   - **Exit Screen Title**: `"YAAAY! IT'S A DATE! 🎉❤️"`
   - **Confirmed Subtext**: *"Our date plan is officially sealed and locked in! Can't wait to see you and spend the most unforgettable time together. 🥰✨"*
   - Boarding pass with ticket cutout notches, barcode, approved stamp, date, time, venue, and food cravings.
   - Direct WhatsApp dispatch button to **Ayush (+91 9811323875)**.
   - Add to Calendar (`.ics` download for Google Calendar / Apple Calendar).
   - Copy Itinerary button.

---

## 🚀 How to Deploy on Vercel

Since this is a clean, static web application:

### Option 1: Drag-and-Drop or GitHub via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New... > Project**.
3. Import your GitHub repository (or use the Vercel CLI).
4. Framework Preset: **Other** (Static HTML).
5. Click **Deploy** — your live romantic date link will be live in 10 seconds!

### Option 2: Using Vercel CLI in Terminal
```powershell
# In this directory:
npm i -g vercel   # If not already installed
vercel
```
Follow the prompts (accept default settings) and get your instant production URL!
