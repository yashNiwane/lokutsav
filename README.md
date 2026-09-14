# 🚩 लोकोत्सव (Lokutsav) २०२६
### महाराष्ट्र राज्य ऑनलाइन गणेश सजावट स्पर्धा (Maharashtra State Online Ganpati Decoration Competition)

> **Artistry in Every Home, Culture Across the State — The Grand Mahotsav**  
> घरोघरी गणपती, परंपरेची कलाकृती - संपूर्ण महाराष्ट्राचा महामहोत्सव

Built using the **`human-designed-ui`** skill principles: an intentional, dignified editorial aesthetic tailored to Maharashtra's rich festive heritage (vermilion kumkum, brass ochre, warm cotton parchment, and basalt stone), free from generic AI/SaaS design clichés.

---

## 🏛️ Project Architecture

- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, TypeScript, Lucide Icons
- **Backend**: Next.js Server Handlers & API Routes
- **Database & ORM**: PostgreSQL & Prisma ORM 6.4 (with instant zero-setup fallback store for local development)
- **Payment Processing**: Razorpay (INR UPI, Google Pay, PhonePe, Cards, Netbanking) with built-in Test Simulation mode
- **Media Storage**: Local VPS disk storage (`/public/uploads` with Docker persistent volume mounting, zero external S3 fees)
- **Language**: Instant 1-click Bilingual toggle (Authentic **मराठी** and **English**)

---

## 🌟 Key Features

### 1. Public Experience & Cultural Landing (`/`)
- **Heritage Editorial Hero**: Live dates, registered participants counter, 36 district coverage badge, and quick entry link.
- **Top 10 Prize Pool & Trophies**:
  - **१st Rank (महाविजेता)**: ₹51,000 Cash + Gold-Plated Trophy + Title Sponsor Gift Hamper
  - **२nd Rank**: ₹31,000 Cash + Silver-Plated Trophy + Hamper
  - **३rd Rank**: ₹21,000 Cash + Bronze-Plated Trophy + Hamper
  - **४th to १०th Rank**: ₹5,000 Cash Each (7 Merit winners) + State Memento & Certificates
- **5 Transparent Judging Criteria Cards**:
  1. Concept & Creativity (२५%)
  2. Craftsmanship & Detailing (२५%)
  3. Eco-Friendliness & Materials (२०%) — special preference for Shadu Mati & natural elements
  4. Lighting & Presentation (१५%)
  5. Uniqueness & Innovation (१५%)
- **Featured Gallery**: Live filterable showcase by 36 Maharashtra districts and category (Household vs Mandal) with high-res photo modal.
- **Sponsor Spotlight**: Showcasing Maharashtra's iconic brands (Chitale Bandhu, PNG Jewellers, Suhana Spices, Saraswat Bank).
- **Rules & FAQs Accordion**: Clear answers for participants in both languages.

### 2. Multi-Step Participant Registration (`/register`)
- **Step 1: Personal & District Info**: All 36 Maharashtra districts dropdown, city, address, phone/WhatsApp.
- **Step 2: Decoration & Media Submission**:
  - Category: Household (घरगुती) vs Sarvajanik Mandal (मंडळ)
  - Idol Type: Shadu Mati Clay (शाडू माती), Paper pulp (कागदी लगदा), or Traditional
  - Theme Story & Materials list
  - Multi-file photo upload stored directly on the VPS disk via `/api/upload`
  - Optional video walkthrough link (YouTube / Google Drive)
- **Step 3: ₹99 Payment**: Razorpay integration with live checkout & simulation mode.
- **Step 4: Official Lokutsav Entry Ticket**: Unique Ticket ID (e.g. `LOK-2026-8941`), printable badge, and WhatsApp sharing.

### 3. Official Top 10 Winners & Leaderboard (`/winners`)
- Podium presentation for the top 3 state champions with jury scores and prize packages.
- 4th to 10th rank table with individual scores out of 10.

### 4. Jury & Admin Evaluation Portal (`/judging`)
- Protected by confidential jury passcode (configure via `JURY_PASSCODE` in `.env`).
- Real-time revenue & submission metrics dashboard (Total entries, ₹ collected, pending reviews).
- Interactive scoring scorecard:
  - 5 criteria sliders (1 to 10) with automatic live weighted calculation.
  - Judge notes & remarks.
  - Automatic re-ranking algorithm recalculating the Top 10 positions.

### 5. Brand Sponsorship Desk (`/sponsors`)
- Sponsorship deck highlighting reach across 36 districts and families.
- Category sponsorship options (Title Sponsor, Gold, Powered By, Product Gifting).
- Direct brand partnership inquiry form.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 VPS Server Deployment (Single-Command)

Lokutsav is optimized for straightforward deployment on any Linux VPS (Ubuntu/Debian on DigitalOcean, Hetzner, AWS EC2, Linode, Hostinger VPS, etc.).

### Option A: Using the Automated Script
On your VPS terminal, simply clone this repository and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option B: Using Docker Compose Manually
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Build and launch containers
docker compose up -d --build

# 3. Initialize database tables and seed
docker compose exec -T web npx prisma db push
docker compose exec -T web node prisma/seed.js
```

### Persistent VPS Data Volumes:
- `uploads_data`: Mounted to `/app/public/uploads` — guarantees all participant decoration photos and videos are preserved permanently on your server disk across rebuilds.
- `postgres_data`: Mounted to `/var/lib/postgresql/data` — guarantees database durability.

### Nginx Reverse Proxy & SSL (Certbot)
Use the included `nginx.conf` template:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/lokutsav.conf
sudo ln -s /etc/nginx/sites-available/lokutsav.conf /etc/nginx/sites-enabled/
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo systemctl reload nginx
```

---

## 🔑 Default Credentials & Keys

- **Jury Room Passcode**: Set via `JURY_PASSCODE` in `.env` (kept strictly confidential)
- **Razorpay Keys**: Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`. When empty, the system automatically uses test simulation mode.

---

## 📜 License
Designed for Lokutsav Maharashtra State Online Ganpati Decoration Competition. All rights reserved.
