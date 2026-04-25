# StudyHub 📚

Ek free resource sharing platform jahan aap Google Drive links ke through books, notes, aur past papers share kar sakte hain.

## Features

- ✅ Books, Notes, aur Past Papers share karein
- ✅ Google Drive link paste karo — download directly Drive se hoga
- ✅ Search by title, subject, tags, ya naam
- ✅ Filter by type (Books / Notes / Papers)
- ✅ Download counter
- ✅ Admin mode (delete resources)
- ✅ Beautiful dark UI
- ✅ Mobile friendly
- ✅ No backend needed — sab kuch browser mein save hota hai

## Local Run Karne Ka Tarika

```bash
npm install
npm run dev
```

Browser mein `http://localhost:5173` kholen.

## Vercel Par Free Deploy Karna

### Method 1: GitHub ke through (Recommended)

1. Is folder ko GitHub par upload karein:
   - github.com par jayen
   - New Repository banayein (jaise: `studyhub`)
   - Ye saare files upload karein

2. Vercel par deploy karein:
   - vercel.com par jayen (free account banayein)
   - "New Project" click karein
   - GitHub se apna `studyhub` repo select karein
   - Framework: **Vite** select karein
   - "Deploy" click karein — bas! ✅

### Method 2: Vercel CLI se

```bash
npm install -g vercel
vercel login
vercel --prod
```

## Admin Password

Default admin password: `studyhub123`

Password change karne ke liye `src/App.jsx` mein yeh line edit karein:
```js
const ADMIN_PASSWORD = 'studyhub123'
```

## Google Drive Link Kaise Share Karein

1. Google Drive par file upload karein
2. File par right-click → "Share"
3. "Anyone with the link" select karein
4. Link copy karein
5. StudyHub mein "Add Resource" mein paste karein

## Customize Karna

- **Rang/Colors**: `src/index.css` mein `:root` variables change karein
- **Naam**: `index.html` mein title aur `App.jsx` mein "StudyHub" change karein
- **Default data**: `src/data/useResources.js` mein `SAMPLE_DATA` edit karein
