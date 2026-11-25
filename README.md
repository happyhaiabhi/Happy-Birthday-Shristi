# Happy Birthday, Shristi! 🎂

A small, self-contained birthday site made for Shristi. No build step, no dependencies — just HTML, CSS, and a little JavaScript.

## What's inside

- ✨ An animated hero with balloons, sparkles, and confetti
- 💌 An envelope you can open to read a personal note
- 🕯️ An interactive cake — blow out all five candles to grant a wish
- ☀️ A "reasons we love you" section with a compliment generator
- ♫ A synthesized birthday tune you can play or pause
- 📱 A fully responsive layout with reduced-motion support

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Make it yours

- **The name and hero copy:** `index.html` (search for `Shristi`)
- **The letter in the envelope:** `index.html`, inside `#letter`
- **The compliments:** `compliments` array in `script.js`
- **Colors and fonts:** the `:root` variables at the top of `styles.css`

## Publish with GitHub Pages

The site is ready to serve straight from the repository root. In GitHub, go to **Settings → Pages**, choose **Deploy from a branch**, select this branch and `/ (root)`, then save.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page content and inline SVG cake |
| `styles.css` | All styling and animations |
| `script.js` | Confetti, interactions, and music |
| `assets/favicon.svg` | Site icon |
