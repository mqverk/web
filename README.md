<div align="center">
  <h1 align="center">Maverick's Portfolio</h1>
  <p align="center">
    <strong>A high-signal, minimalist developer portfolio.</strong>
    <br />
    Designed for performance, built with precision, and focused on showcasing practical engineering.
  </p>
</div>

---

## 🚀 Features
- **High-Performance Architecture**: Route & Component-level lazy loading (Code Splitting) using React `lazy`/`Suspense`.
- **Minimalist Aesthetic**: Dark-themed, bento-grid inspired design built with Tailwind CSS v4 and Framer Motion micro-interactions.
- **Dynamic Integrations**: 
  - **Spotify API**: Displays currently playing tracks or top artists dynamically.
  - **GitHub API**: Showcases pinned/latest repositories and tech stacks.
  - **Medium API**: Pulls recent articles and publications directly via RSS to JSON proxy.
- **Serverless View Counter**: A live total portfolio view counter powered by Vercel KV (Redis) Serverless Functions (`api/view.ts`).
- **Responsive 100%**: Layout structurally handles constraints gracefully from mobile screens up to ultraship displays.

## 🛠️ Tech Stack
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix Primitives)
- **Animations**: Framer Motion
- **Database/Storage**: Vercel KV (Redis)
- **Deployment**: Vercel Serverless Ready

## ⚙️ Setup & Installation

Follow these steps to deploy or run the portfolio locally.

### 1. Clone the Repository
```bash
git clone https://github.com/mqverk/web.git
cd web
```

### 2. Install Dependencies
Ensure you are using Node.js v18+.
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory. You will need your own keys for the dynamic components.
```env
# Spotify Integration (Get these from Spotify Developer Dashboard)
SPOTIFY_CLIENT_ID="your_spotify_client_id"
SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"

# Vercel KV (Redis View Counter)
KV_REST_API_URL="your_redis_rest_url"
KV_REST_API_TOKEN="your_redis_rest_token"

# Optional: Medium Profile Name
VITE_MEDIUM_URL=""
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. 
*(Note: Serverless API routes under `/api` will not fire dynamically natively under normal `vite dev`, but will function perfectly when pushed to Vercel).*

## 🚢 Deployment (Vercel)

This application is configured out-of-the-box for Vercel. With `vercel.json` already defined to route the Single Page Application effectively while serving Serverless Functions.

1. Create a project in [Vercel](https://vercel.com/) and link it to your GitHub Repository.
2. Under Project Settings -> Environment Variables, add the `.env` values provided above.
3. Vercel will auto-detect the Vite build. Make sure the build command is `npm run build` and output directory is `dist`.
4. Deploy!

## 🤝 Contact

Feel free to reach out via [GitHub](https://github.com/mqverk)

---
*Built with ❤️ by Maverick. 2026.*
