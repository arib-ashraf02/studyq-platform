StudyQ — Collaborative Doubt-Solving Platform 🚀
StudyQ is a modern, responsive, and collaborative Q&A platform built for students and developers to ask questions, share knowledge, and build reputation. It features a stunning glassmorphism design, real-time feedback, and a seamless developer experience.

✨ Features
Authentication: Secure email/password and Google OAuth login using NextAuth.
Dynamic Dashboard: Ask questions, view leaderboards, and browse tags.
Rich Interaction: Upvote/downvote questions and answers, and track views.
Reputation System: Earn reputation points by providing accepted answers.
Modern UI: Built with Tailwind CSS and Framer Motion for beautiful, fluid animations and a dark "glassmorphism" aesthetic.
Responsive: Fully optimized for mobile and desktop screens.
🛠️ Tech Stack
Framework: Next.js 14 (App Router)
Styling: Tailwind CSS & Framer Motion
Database: Prisma ORM with SQLite (local dev) / Neon PostgreSQL (production)
Authentication: NextAuth.js
Icons: Lucide React
🚀 Getting Started
Prerequisites
Node.js 18+
npm or yarn
1. Clone & Install
git clone https://github.com/danish975/StudyQ-Collaborative-Doubt-Solving-Platform.git
cd StudyQ-Collaborative-Doubt-Solving-Platform
npm install
2. Environment Variables
Create a .env file in the root directory (you can copy .env.example if available) and add the following:

NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# SQLite for local development
DATABASE_URL="file:./dev.db"
3. Database Setup (Local)
Generate the Prisma client and push the schema to create your local SQLite database:

npx prisma generate
npx prisma db push
(Optional) Seed the database with demo data:

npx tsx prisma/seed.ts
4. Run the Development Server
npm run dev
Open http://localhost:3000 in your browser.

🗄️ Database Management
To view and manage your database locally, run Prisma Studio:

npx prisma studio
This opens a visual database browser at http://localhost:5555.

🌍 Production Deployment
When deploying to a production environment (like Render or Vercel), update your .env to use your remote PostgreSQL connection strings:

DATABASE_URL="postgresql://user:password@host/db_name?sslmode=require"
And make sure to update your prisma/schema.prisma provider to postgresql.

📄 License
This project is licensed under the MIT License.
