# RideGear

Next.js + Tailwind frontend, Node/Express backend, MongoDB.

## Run locally
```bash
# 1. backend
cd backend && cp .env.example .env     # put your MongoDB URI in .env
npm install && npm run seed && npm run dev

# 2. frontend (new terminal)
cd frontend && cp .env.local.example .env.local
npm install && npm run dev             # http://localhost:3000
```

## Deploy
GitHub -> Vercel (frontend, set NEXT_PUBLIC_API_URL) -> Render (backend, set MONGO_URI and CLIENT_ORIGIN) -> Atlas (DB).
