# L.A Center Jewelry Inc - Haute Joaillerie E-Commerce Platform

A production-grade, modern luxury fine jewelry e-commerce website and administrative back-office atelier designed for **L.A Center Jewelry Inc** (720 S Broadway, Los Angeles, CA 90014).

---

## 🌟 Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion
- **Database & Real-time Cloud:** Google Cloud Firestore (`firebase/firestore`, real-time `onSnapshot` sync)
- **Deployment Platform:** Vercel (Configured with Single Page App rewrites in `vercel.json`)

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📦 Deploying to GitHub & Vercel

### Step 1: Push Code to GitHub
1. Open your terminal in this project root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: L.A Center Jewelry luxury storefront & admin atelier"
   git branch -M main
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Link and push your repository:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

### Step 2: Deploy on Vercel
1. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** > **Project**.
3. Select your GitHub repository and click **Import**.
4. Configure Project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**. Vercel will automatically build and provide a live production URL!

---

## 🔐 Admin Panel Access
- **URL Route:** Navigate to `/admin` or `#/admin` on your live domain.
- **Default Username:** `admin@lacenterjewelry.com`
- **Default Password:** `admin123`
- *Note:* Credentials can be updated at any time under the **Security** tab inside the Admin Panel.
