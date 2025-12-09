# Scientific Articles Platform

A modern platform for creating and publishing scientific articles built with Next.js, Clerk, Prisma, and PostgreSQL.

## ✨ Features

- 🔐 User authentication with Clerk
- ✍️ Markdown editor with live preview
- 📊 KaTeX support for mathematical formulas
- 🎯 Tag-based filtering and search
- 📱 Responsive design with shadcn/ui
- 🚀 Server-side rendering with Next.js App Router
- 💾 PostgreSQL database with Prisma ORM

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React, TypeScript
- **UI Components:** shadcn/ui, Tailwind CSS
- **Authentication:** Clerk
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Markdown:** react-markdown, KaTeX

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Clerk account (for authentication)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Edit `.env.local` file in the root directory and add your credentials:

```env
# Clerk Authentication (Get from https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database (Update with your PostgreSQL credentials)
DATABASE_URL="postgresql://user:password@localhost:5432/scientific_articles?schema=public"
```

### 3. Setup Clerk

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your API keys to `.env.local`

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 MVP Features Implemented

### Sprint 1 - Base System ✅

- ✅ Next.js with App Router
- ✅ Tailwind CSS + shadcn/ui
- ✅ Clerk authentication
- ✅ Prisma + PostgreSQL setup
- ✅ Protected dashboard

### Sprint 2 - Article Creation ✅

- ✅ Create article form
- ✅ Markdown editor with tabs
- ✅ Live preview with react-markdown
- ✅ KaTeX math rendering
- ✅ Save as draft functionality

### Sprint 3 - Publishing ✅

- ✅ Publish/unpublish articles
- ✅ Public article pages with slug
- ✅ Articles listing page
- ✅ Tag filtering
- ✅ Search by title/abstract/tags

### Sprint 4 - Polish ✅

- ✅ Search functionality
- ✅ Toast notifications (Sonner)
- ✅ Loading states
- ✅ Empty states
- ✅ User avatar menu

## 🔑 Key Routes

- `/` - Landing page
- `/sign-in` - Sign in
- `/sign-up` - Sign up
- `/dashboard` - User dashboard (protected)
- `/dashboard/new` - Create new article (protected)
- `/dashboard/edit/[id]` - Edit article (protected)
- `/articles` - Browse all published articles (public)
- `/article/[slug]` - View article (public)

## 📝 Usage

1. **Sign up** for an account
2. Go to **Dashboard**
3. Click **New Article**
4. Write your article in Markdown
5. Preview using the Preview tab
6. Click **Save Draft** to save
7. Click **Publish** to make it public
8. Share the article URL with others

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

Built with ❤️ using Next.js and modern web technologies
