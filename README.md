# Anurag Singh — Portfolio

A single-page portfolio site (Navy & Gold theme) with a small Node/Express backend
for the contact form.

## Structure

```
portfolio/
├── index.html                 → the whole site (landing, about, experience,
│                                 education, projects, skills, certifications,
│                                 highlights, contact)
├── css/style.css               → all styling & animations
├── js/main.js                  → scroll reveal, nav, skill bars, stat counters,
│                                 contact form submission
├── assets/
│   ├── images/                 → profile photo, candid photos, AWS badge
│   └── certificates/           → your 8 PDF certificates
├── backend/
│   ├── server.js                → Express API that receives contact-form messages
│   ├── package.json
│   └── .env.example             → copy to .env and fill in your email credentials
├── private-docs/                → sensitive documents (see note below) — NOT pushed to GitHub
└── .gitignore
```

## Running it locally

**Frontend** — no build step needed, it's plain HTML/CSS/JS:
```bash
# from the portfolio/ folder
python3 -m http.server 8080
# then open http://localhost:8080
```

**Backend** (needed for the contact form to actually send you an email):
```bash
cd backend
npm install
cp .env.example .env
# edit .env with your real SMTP credentials (see instructions inside the file)
npm start
```
The frontend is already pointed at `http://localhost:4000/api/contact` in `js/main.js`.
If you don't configure `.env`, the form will still work — it just logs the message
to your backend console instead of emailing it.

## Before you push this live

1. **Add your LinkedIn URL.** Open `js/main.js` and set `CONFIG.linkedInUrl`.
   The LinkedIn icons on the site will automatically light up once it's set.
2. **Configure email.** Fill in `backend/.env` with a Gmail App Password (or any
   SMTP provider) so contact-form messages actually reach your inbox.
3. **Deploy the backend somewhere** (Render, Railway, Fly.io all have free tiers)
   and update `CONFIG.contactEndpoint` in `js/main.js` to point at the live URL.
4. **Deploy the frontend** — since it's static, GitHub Pages, Netlify, or Vercel
   all work with zero configuration. Just point them at this folder.

## Pushing to GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/AnuragCyde/YOUR-REPO-NAME.git
git push -u origin main
```

`.gitignore` already excludes `node_modules/`, `.env`, and the `private-docs/` folder.

## A note on `private-docs/`

This folder holds documents that contain personal information you probably don't
want on a public GitHub repo or website — semester marksheets, Class 10/12
certificates, your signature, your source resume, and enrollment/roll numbers.
They're kept here for your own reference (e.g. if you need them for a job
application) but are excluded from git via `.gitignore` so they never get pushed
publicly. If you ever do want one of them on the live site, move it into
`assets/` deliberately and remove the corresponding `.gitignore` rule.

## Certificates included on the public site

All 8 PDF certificates plus the AWS Academy badge are in `assets/certificates/`
and `assets/images/`, linked from the Certifications section. They open in a new
tab when clicked.
