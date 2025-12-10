<div align="center">

# <span style="font-family: 'Merriweather', serif;">Atheno</span>

A modern platform for creating and publishing scientific articles with support for mathematical notation, rich markdown editing, and collaborative features.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/) [![Prisma](https://img.shields.io/badge/Prisma-5.22-darkgreen)](https://www.prisma.io/) [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-cyan)](https://tailwindcss.com/)

</div>

## <span style="font-family: 'Merriweather', serif;">Overview</span>

Atheno is a full-stack web application designed for researchers, academics, and scientific writers who need a streamlined platform to compose, manage, and publish technical articles. Built with modern web technologies, it provides a seamless writing experience with real-time preview, LaTeX math rendering, and customizable article covers.

## <span style="font-family: 'Merriweather', serif;">Features</span>

- **User Authentication**: Secure authentication system powered by Clerk
- **Markdown Editor**: Write articles using Markdown with live preview
- **Mathematical Notation**: Full KaTeX support for rendering complex mathematical formulas
- **Article Management**: Create, edit, publish, and organize articles with draft support
- **Custom Covers**: Design article covers with gradient backgrounds or custom images
- **Table of Contents**: Auto-generated navigation from article headings
- **Dark Mode**: System-aware dark mode with smooth transitions
- **References Section**: Dedicated section for citations and references
- **Search and Filtering**: Tag-based filtering and full-text search capabilities
- **Responsive Design**: Mobile-first design that works on all devices

<details>
<summary><span style="font-family: 'Merriweather', serif;">Technology Stack</span></summary>

| Category              | Technologies                                                           |
| --------------------- | ---------------------------------------------------------------------- |
| **Frontend**          | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend**           | Next.js API Routes, Prisma ORM, PostgreSQL (Supabase)                  |
| **Authentication**    | Clerk                                                                  |
| **Content Rendering** | react-markdown, KaTeX, remark-gfm                                      |

</details>

## <span style="font-family: 'Merriweather', serif;">Prerequisites</span>

Before running this project, ensure you have the following installed:

- Node.js 18.0 or higher
- npm or yarn package manager
- Supabase account (for PostgreSQL database)
- Clerk account for authentication

## <span style="font-family: 'Merriweather', serif;">Getting Started</span>

### <span style="font-family: 'Merriweather', serif;">Installation</span>

1. Clone the repository:

```bash
git clone https://github.com/gabrieldorodrigues/atheno.git
cd atheno
```

2. Install dependencies:

```bash
npm install
```

### <span style="font-family: 'Merriweather', serif;">Environment Configuration</span>

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database Connection (Supabase PostgreSQL)
DATABASE_URL="postgresql://user:password@host.supabase.co:5432/postgres"
```

**Clerk Setup:**

1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the API keys from your Clerk dashboard
4. Add them to your `.env.local` file

**Supabase Setup:**

1. Create an account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > Database
4. Copy the connection string (URI format)
5. Add it to your `.env.local` file as `DATABASE_URL`

### <span style="font-family: 'Merriweather', serif;">Database Setup</span>

1. Generate Prisma Client:

```bash
npx prisma generate
```

2. Run database migrations:

```bash
npx prisma migrate dev
```

3. (Optional) Open Prisma Studio to inspect your database:

```bash
npx prisma studio
```

### <span style="font-family: 'Merriweather', serif;">Running the Application</span>

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

<details>
<summary><span style="font-family: 'Merriweather', serif;">Project Structure</span></summary>

```
atheno/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── article/           # Public article pages
│   ├── articles/          # Article listing
│   ├── dashboard/         # Protected dashboard pages
│   └── sign-in/           # Authentication pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

</details>

## <span style="font-family: 'Merriweather', serif;">Usage</span>

### <span style="font-family: 'Merriweather', serif;">Creating an Article</span>

1. Sign up or sign in to your account
2. Navigate to the Dashboard
3. Click "New Article" in the sidebar
4. Fill in the article details (title, abstract, tags)
5. Write your content using Markdown syntax
6. Use the Preview tab to see the rendered output
7. Save as draft or publish immediately

### <span style="font-family: 'Merriweather', serif;">Markdown Support</span>

Atheno supports GitHub Flavored Markdown with additional features:

- **Headings**: `# H1` through `###### H6`
- **Emphasis**: `*italic*` or `**bold**`
- **Lists**: Ordered and unordered lists
- **Code blocks**: With syntax highlighting
- **Tables**: Full table support
- **Math**: Inline `$equation$` or block `$$equation$$` using KaTeX

### <span style="font-family: 'Merriweather', serif;">Customizing Article Covers</span>

1. Edit an article
2. Use the Cover Customizer panel on the right
3. Choose between gradient or image backgrounds
4. Apply filters (blur, grayscale, brightness, grain)
5. Toggle title visibility on the cover

<details>
<summary><span style="font-family: 'Merriweather', serif;">API Routes</span></summary>

- `GET /api/articles` - Fetch all published articles
- `GET /api/articles/:id` - Fetch a specific article
- `POST /api/articles` - Create a new article
- `PUT /api/articles/:id` - Update an article
- `DELETE /api/articles/:id` - Delete an article

</details>

</details>

<details>
<summary><span style="font-family: 'Merriweather', serif;">Deployment</span></summary>

### <span style="font-family: 'Merriweather', serif;">Vercel</span>

1. Push your code to a Git repository
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### <span style="font-family: 'Merriweather', serif;">Other Platforms</span>

The application can be deployed to any platform that supports Next.js applications (Railway, Render, AWS, etc.). Ensure you:

- Set all required environment variables
- Use a PostgreSQL database (Supabase, Railway, etc.)
- Configure the build command: `npm run build`
- Configure the start command: `npm start`

</details>

</details>

<details>
<summary><span style="font-family: 'Merriweather', serif;">Development</span></summary>

### <span style="font-family: 'Merriweather', serif;">Available Scripts</span>

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

</details>

## <span style="font-family: 'Merriweather', serif;">Contributing</span>

Contributions are welcome! Please feel free to submit a Pull Request.

## <span style="font-family: 'Merriweather', serif;">License</span>

This project is licensed under the MIT License. See the LICENSE file for details.

## <span style="font-family: 'Merriweather', serif;">Acknowledgments</span>

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Authentication by [Clerk](https://clerk.com)
- Database management with [Prisma](https://www.prisma.io/)
- Math rendering by [KaTeX](https://katex.org/)
