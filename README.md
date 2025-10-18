# 🌟 Portfolio Website - Full Stack Application

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express.js-5-green?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

A modern, feature-rich personal portfolio website built with **Next.js 15**, **Express.js**, **Prisma**, and **PostgreSQL**. This project showcases professional work, blogs, and skills with a powerful admin dashboard for content management.

---

## 🌐 Live Demo

- **🌍 Frontend**: [https://nifazur.vercel.app](https://nifazur.vercel.app)
- **🔌 Backend API**: [https://portfolio-backend-smoky-five.vercel.app/api/v1](https://portfolio-backend-smoky-five.vercel.app)
- **🔐 Admin Dashboard**: [https://nifazur.vercel.app/dashboard](https://nifazur.vercel.app/dashboard)

**Demo Credentials**:
- Email: `nifazurrahman2872@gmail.com`
- Password: `**********`

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [🎯 Key Highlights](#-key-highlights)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔐 Environment Variables](#-environment-variables)
- [📖 API Documentation](#-api-documentation)
- [🚀 Deployment](#-deployment)
- [⚡ Performance](#-performance)
- [🐛 Troubleshooting](#-troubleshooting)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [💬 Support](#-support)
- [📄 License](#-license)

---

## ✨ Features

### 🌍 Public Features (No Login Required)

- **🏠 Hero Section**: Dynamic role rotation with animated background effects and social links
- **👤 About Me**: Personal information with skills progress bars, work experience timeline, and education timeline
- **💼 Projects Showcase**: Portfolio projects with live demos, GitHub links, categories, and detailed project pages
- **📝 Blog Platform**: Public blog posts with categories, tags, reading time estimates, and rich content display
- **📧 Contact Form**: Fully functional contact form with server-side validation
- **🎨 Responsive Design**: Mobile-first approach with Tailwind CSS v4
- **⚡ ISR & SSG**: Incremental Static Regeneration for dynamic content with 60s revalidation
- **🔍 SEO Optimized**: Meta tags, Open Graph, robots.txt, dynamic sitemaps, and Google verification
- **♿ Accessibility**: WCAG 2.1 compliant with keyboard navigation

### 🔐 Private Features (Owner/Admin Only)

- **🔑 Secure Authentication**: JWT-based authentication with bcrypt password hashing and httpOnly cookies
- **📊 Admin Dashboard**: 
  - Real-time statistics (total blogs, projects, messages, views)
  - Recent blogs and messages preview
  - Quick action buttons
  - Auto-refresh every 30 seconds
  
- **✍️ Blog Management**: 
  - Rich text editor (TipTap) with formatting toolbar (bold, italic, underline, links, images, lists)
  - Create, edit, delete, and publish blogs
  - Tag management and category organization
  - View count tracking
  - Draft/Published status toggle
  - Featured blogs selection
  
- **🚀 Project Management**: 
  - Full CRUD operations for projects
  - Technology stack tagging
  - Status tracking (Completed, In Progress, Planned)
  - Feature lists and project insights
  - Image gallery support (thumbnail + multiple images)
  - Live URL and GitHub URL links
  - Order management for display priority
  
- **📬 Message Management**: 
  - View contact form submissions
  - Mark messages as read/unread
  - Search and filter functionality
  - Delete unwanted messages
  - Message statistics
  
- **👤 Profile Management**: 
  - Update personal information (name, bio, phone, picture)
  - Change password securely with validation
  - Avatar display with fallback
  - Account creation and update timestamps

---

## 🎯 Key Highlights

✅ **Modern Tech Stack** - Next.js 15, React 19, TypeScript 5  
✅ **ISR & SSG** - Lightning-fast performance with 60s revalidation  
✅ **Rich Text Editor** - TipTap with full formatting support  
✅ **Responsive Design** - Mobile-first Tailwind CSS v4 with dark theme  
✅ **Secure Auth** - JWT with httpOnly cookies and middleware protection  
✅ **Database** - PostgreSQL with Prisma ORM for type-safe queries  
✅ **SEO Optimized** - Meta tags, Open Graph, sitemaps, robots.txt  
✅ **Production Ready** - Error handling, validation, logging  
✅ **Developer Experience** - TypeScript strict mode, ESLint 9  
✅ **Deployment Ready** - Vercel (frontend) and Railway/Render (backend)  

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 15.5.5 | React framework with App Router |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **shadcn/ui** | Latest | UI component library |
| **TipTap** | 2.5.8 | Rich text editor |
| **React Hook Form** | 7.65.0 | Form management |
| **Zod** | 4.1.12 | Schema validation |
| **React Hot Toast** | 2.6.0 | Notifications |
| **Lucide React** | 0.545.0 | Icon library |
| **js-cookie** | 3.0.5 | Cookie management |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 20+ | Runtime environment |
| **Express.js** | 5.1.0 | Web framework |
| **TypeScript** | 5.x | Type safety |
| **Prisma** | 6.3.0 | ORM for database |
| **PostgreSQL** | 16 | Relational database |
| **JWT** | 9.0.2 | Authentication |
| **bcrypt** | 5.1.1 | Password hashing |
| **CORS** | 2.8.5 | Cross-origin requests |
| **compression** | 1.8.1 | Response compression |
| **cookie-parser** | 1.4.7 | Cookie parsing |

### DevOps & Tools

- **Package Manager**: Bun (recommended) / npm
- **Linting**: ESLint 9
- **Version Control**: Git & GitHub
- **Deployment**: Vercel (Frontend) / Railway/Render (Backend)
- **Database Hosting**: Neon / Supabase / Railway

---

## ⚡ Quick Start

### Prerequisites

Ensure you have the following installed:

- **Bun** `1.0+` (recommended) - [Install Bun](https://bun.sh/)
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
- **Node.js** `20+` (alternative to Bun)
- **PostgreSQL** `16+` (local or cloud)
- **Git** for version control

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Nifazur/portfolio-website.git
cd portfolio-website

# 2. Backend setup
cd portfolio-backend
bun install
cp .env.example .env
# Edit .env with your database credentials and secrets
bun run prisma:generate
bun run prisma:migrate
bun run prisma:seed
bun run dev
# Backend running at http://localhost:5000

# 3. Frontend setup (open new terminal)
cd ../portfolio-frontend
bun install
cp .env.example .env.local
# Edit .env.local with backend URL
bun run dev
# Frontend running at http://localhost:3000
```

### First Login

1. Visit: http://localhost:3000/login
2. Use credentials from `.env` file:
   - Email: `nifazurrahman2872@gmail.com`
   - Password: `**********`
3. Access dashboard: http://localhost:3000/dashboard

---

## 📁 Project Structure

```
portfolio-website/
│
├── portfolio-frontend/              # Next.js Frontend
│   ├── src/
│   │   ├── app/                     # App Router pages
│   │   │   ├── (auth)/              # Authentication routes
│   │   │   │   └── login/
│   │   │   ├── (dashboard)/         # Protected admin routes
│   │   │   │   ├── blogs/
│   │   │   │   │   ├── create/      # Create blog page
│   │   │   │   │   └── edit/[id]/   # Edit blog page
│   │   │   │   ├── projects/
│   │   │   │   │   ├── create/      # Create project page
│   │   │   │   │   └── edit/[id]/   # Edit project page
│   │   │   │   ├── messages/        # Contact messages
│   │   │   │   └── profile/         # User profile
│   │   │   └── (public)/            # Public routes
│   │   │       ├── blogs/
│   │   │       │   └── [slug]/      # Blog detail page
│   │   │       ├── projects/
│   │   │       │   └── [slug]/      # Project detail page
│   │   │       └── page.tsx         # Homepage
│   │   ├── components/              # React components
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── sections/            # Page sections
│   │   │   ├── layout/              # Layout components
│   │   │   ├── editor/              # TipTap editor
│   │   │   ├── form/                # Form components
│   │   │   └── shared/              # Shared components
│   │   ├── lib/                     # Utilities
│   │   │   ├── api.ts               # API client
│   │   │   ├── validation.ts        # Zod schemas
│   │   │   ├── constants.ts         # App constants
│   │   │   └── utils.ts             # Helper functions
│   │   ├── types/                   # TypeScript types
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── actions/                 # Server actions
│   │   └── middleware.ts            # Next.js middleware
│   ├── public/                      # Static assets
│   ├── .env.local                   # Environment variables
│   └── package.json
│
└── portfolio-backend/               # Express.js Backend
    ├── src/
    │   ├── config/                  # Configuration files
    │   │   ├── db.ts                # Prisma client
    │   │   └── index.ts             # App config
    │   ├── middleware/              # Express middleware
    │   │   ├── auth.middleware.ts   # JWT authentication
    │   │   ├── error.middleware.ts  # Error handling
    │   │   └── validation.middleware.ts
    │   ├── modules/                 # Feature modules
    │   │   ├── auth/                # Authentication
    │   │   │   ├── auth.controller.ts
    │   │   │   ├── auth.routes.ts
    │   │   │   └── auth.service.ts
    │   │   ├── blog/                # Blog management
    │   │   ├── project/             # Project management
    │   │   ├── contact/             # Contact messages
    │   │   ├── skill/               # Skills
    │   │   ├── experience/          # Work experience
    │   │   └── education/           # Education
    │   ├── utils/                   # Utilities
    │   │   ├── ApiError.ts          # Custom error class
    │   │   ├── ApiResponse.ts       # Response formatter
    │   │   ├── validation.ts        # Validators
    │   │   └── slugify.ts           # Slug generator
    │   ├── app.ts                   # Express app setup
    │   └── server.ts                # Server entry point
    ├── prisma/
    │   ├── schema.prisma            # Database schema
    │   ├── seed.ts                  # Database seeding
    │   └── migrations/              # Migration files
    ├── .env                         # Environment variables
    └── package.json
```

---

## 🔐 Environment Variables

### Backend (.env)

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database URL (PostgreSQL)
# Format: postgresql://username:password@host:port/database?sslmode=require
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio?sslmode=require

# JWT Secrets (Generate with: openssl rand -hex 32)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-here
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CLIENT_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://192.168.0.107:3000

# Owner Seed Data (Default Admin Account)
OWNER_NAME=MD. Nifazur Rahman
OWNER_EMAIL=nifazurrahman2872@gmail.com
OWNER_PASSWORD=**********
OWNER_PHONE=+880-1862040593
OWNER_BIO=Full-stack developer passionate about creating elegant solutions.
```

**🔒 Security Tips**:
```bash
# Generate secure JWT secrets
openssl rand -hex 32

# For production, use environment-specific values
# Never commit .env files to Git
```

### Frontend (.env.local)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Site URL (for sitemap generation)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Revalidation Token (for ISR manual revalidation)
REVALIDATE_SECRET=your-revalidate-secret-key
```

### Environment Variables Table

#### Backend Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for access tokens | 32-byte hex string |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | 32-byte hex string |
| `OWNER_EMAIL` | Admin login email | `admin@example.com` |
| `OWNER_PASSWORD` | Admin login password | `**********` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |

#### Frontend Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | Frontend site URL | `http://localhost:3000` |

---

## 📖 API Documentation

### Base URL
```
Local: http://localhost:5000/api/v1
Production: https://portfolio-backend-smoky-five.vercel.app/api/v1
```

### Authentication Endpoints

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "**********"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com",
      "role": "OWNER"
    }
  }
}
```

#### Get Profile (Protected)
```http
GET /api/v1/auth/profile
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "bio": "Full-stack developer",
    "role": "OWNER"
  }
}
```

#### Change Password (Protected)
```http
POST /api/v1/auth/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "oldPassword": "**********",
  "newPassword": "NewSecure@123"
}

Response: 200 OK
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Blog Endpoints

#### Get All Blogs (Public)
```http
GET /api/v1/blogs?page=1&limit=10&category=Web Development&isPublished=true

Response: 200 OK
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### Get Blog by Slug (Public)
```http
GET /api/v1/blogs/slug/my-first-blog

Response: 200 OK
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My First Blog",
    "slug": "my-first-blog",
    "content": "<p>Blog content here...</p>",
    "category": "Web Development",
    "tags": ["React", "Next.js"],
    "views": 150
  }
}
```

#### Create Blog (Protected)
```http
POST /api/v1/blogs
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "My New Blog Post",
  "content": "<p>Rich HTML content here...</p>",
  "category": "Web Development",
  "tags": ["React", "TypeScript"],
  "isPublished": true,
  "isFeatured": false
}

Response: 201 Created
{
  "success": true,
  "data": { ... },
  "message": "Blog created successfully"
}
```

### Project Endpoints

```
GET    /api/v1/projects              - List all projects
GET    /api/v1/projects/slug/{slug}  - Get project by slug
GET    /api/v1/projects/featured     - Get featured projects
POST   /api/v1/projects              - Create project (protected)
PATCH  /api/v1/projects/{id}         - Update project (protected)
DELETE /api/v1/projects/{id}         - Delete project (protected)
GET    /api/v1/projects/stats        - Get project statistics (protected)
```

### Contact Endpoints

```http
POST /api/v1/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I'd like to discuss a project."
}

Response: 201 Created
{
  "success": true,
  "message": "Message sent successfully"
}
```

### Skills, Education, Experience Endpoints

```
GET    /api/v1/skills              - Get all skills
GET    /api/v1/skills/by-category  - Get skills grouped by category
POST   /api/v1/skills              - Create skill (protected)
PATCH  /api/v1/skills/{id}         - Update skill (protected)
DELETE /api/v1/skills/{id}         - Delete skill (protected)

GET    /api/v1/educations          - Get all education
POST   /api/v1/educations          - Create education (protected)
PATCH  /api/v1/educations/{id}     - Update education (protected)
DELETE /api/v1/educations/{id}     - Delete education (protected)

GET    /api/v1/experiences         - Get all experiences
POST   /api/v1/experiences         - Create experience (protected)
PATCH  /api/v1/experiences/{id}    - Update experience (protected)
DELETE /api/v1/experiences/{id}    - Delete experience (protected)
```

### Error Responses

```json
// 400 Bad Request
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": "Title is required"
  }
}

// 401 Unauthorized
{
  "success": false,
  "message": "Authentication required"
}

// 403 Forbidden
{
  "success": false,
  "message": "Access denied. Owner privileges required."
}

// 404 Not Found
{
  "success": false,
  "message": "Resource not found"
}

// 500 Internal Server Error
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🚀 Deployment

### Backend Deployment

#### Option 1: Railway

1. Create account at [Railway.app](https://railway.app/)
2. Click **New Project** → **Deploy from GitHub**
3. Select `portfolio-backend` repository
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CLIENT_URL`
   - `ALLOWED_ORIGINS`
5. Add **PostgreSQL** service
6. Deploy automatically starts

#### Option 2: Render

1. Create account at [Render.com](https://render.com/)
2. Click **New** → **Web Service**
3. Connect GitHub repository
4. Configure:
   ```
   Build Command: bun install && bun run build
   Start Command: bun run start
   ```
5. Add environment variables
6. Create PostgreSQL database
7. Deploy

#### Option 3: Vercel

The backend includes a `vercel.json` configuration for deployment to Vercel:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Visit [Vercel.com](https://vercel.com/)
3. Click **Import Project**
4. Select `portfolio-frontend` repository
5. Configure environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```
6. Deploy

**Post-Deployment**:
- Update backend `ALLOWED_ORIGINS` with Vercel URL
- Test all API endpoints
- Verify authentication flow
- Check ISR revalidation

### Database Migration (Production)

```bash
# After deploying backend, run migrations
bun run prisma:migrate deploy

# Seed initial data
bun run prisma:seed
```

---

## ⚡ Performance

### Lighthouse Scores

| Metric | Score | Target |
|--------|-------|--------|
| Performance | 95+ | 90+ |
| Accessibility | 98+ | 90+ |
| Best Practices | 100 | 95+ |
| SEO | 100 | 95+ |

### Core Web Vitals

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### Optimization Strategies

✅ **ISR & SSG**: Static generation with 60s revalidation  
✅ **Image Optimization**: Next.js Image component with WebP  
✅ **Code Splitting**: Dynamic imports for heavy components (TipTap editor)  
✅ **Bundle Size**: Optimized with Next.js 15 turbopack  
✅ **Caching**: Server-side caching with ISR  
✅ **CDN**: Vercel Edge Network for global distribution  
✅ **Database**: Connection pooling with Prisma  
✅ **Compression**: Gzip/Brotli for text assets  

---

## 🐛 Troubleshooting

### Database Connection Failed

**Error**: `P1001: Can't reach database server`

**Solutions**:
```bash
# 1. Check DATABASE_URL format
# Correct format:
postgresql://username:password@host:5432/database?sslmode=require

# 2. Test connection
bun run prisma db pull

# 3. Check PostgreSQL is running (local)
pg_ctl status

# 4. For cloud databases (Neon/Supabase)
# - Verify SSL mode is set
# - Check firewall/whitelist settings
# - Ensure database is not paused
```

### CORS Errors

**Error**: `Access to fetch at 'http://localhost:5000' has been blocked by CORS policy`

**Solution**:
```bash
# Backend .env
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.vercel.app

# Restart backend after updating
```

### JWT Token Invalid

**Error**: `401 Unauthorized: Invalid token`

**Solutions**:
```bash
# 1. Clear browser cookies
# In browser console:
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

# 2. Re-login to dashboard

# 3. Check JWT_SECRET matches between login and verification

# 4. Token might be expired - check JWT_EXPIRES_IN value
```

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port
lsof -i :5000
# or
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>
# or
taskkill /PID <PID> /F  # Windows

# Change port in .env
PORT=5001
```

### Prisma Migration Issues

**Error**: `Migration failed`

**Solutions**:
```bash
# 1. Reset database (CAUTION: deletes all data)
bun run prisma migrate reset

# 2. Clear migrations and recreate
rm -rf prisma/migrations
bun run prisma migrate dev --name init

# 3. Generate Prisma Client
bun run prisma generate

# 4. Check schema syntax
bun run prisma format
```

### TipTap Editor Not Loading

**Solutions**:
```bash
# 1. Check dynamic import in component
# Should have ssr: false and immediatelyRender: false

# 2. Clear Next.js cache
rm -rf .next

# 3. Verify TipTap dependencies installed
bun install @tiptap/react @tiptap/starter-kit
```

### Skills Not Loading on Homepage

**Solutions**:
```bash
# 1. Verify backend API is running
curl http://localhost:5000/api/v1/skills/by-category

# 2. Check NEXT_PUBLIC_API_URL in .env.local

# 3. Run Prisma seed to populate skills
cd portfolio-backend
bun run prisma:seed

# 4. Clear Next.js cache and rebuild
cd portfolio-frontend
rm -rf .next
bun run dev
```

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Basic portfolio setup with Next.js 15
- [x] Express.js backend with TypeScript
- [x] PostgreSQL database with Prisma ORM
- [x] JWT authentication system with httpOnly cookies
- [x] Blog management with TipTap rich text editor
- [x] Project showcase with CRUD operations
- [x] Contact form with message management
- [x] Skills, education, experience sections
- [x] Admin dashboard with real-time statistics
- [x] Responsive design with Tailwind CSS v4
- [x] ISR & SSG for optimal performance (60s revalidation)
- [x] SEO optimization (sitemap, robots.txt, meta tags)
- [x] Server actions for form handling
- [x] Middleware-based route protection
- [x] Error boundaries and loading states

### 🚧 In Progress
- [ ] Analytics dashboard with charts
- [ ] Newsletter subscription system
- [ ] Search functionality across site
- [ ] Comment system for blog posts

### 📋 Planned Features

**Phase 1: Enhancement**
- [ ] Dark/Light theme toggle with persistence
- [ ] Multi-language support (i18n)
- [ ] Advanced search with filters
- [ ] Blog categories hierarchy
- [ ] Social media integration
- [ ] RSS feed for blogs

**Phase 2: Advanced Features**
- [ ] Real-time notifications (WebSocket)
- [ ] File upload for blog images (AWS S3/Cloudinary)
- [ ] Markdown support in editor
- [ ] Code syntax highlighting (Prism.js)
- [ ] Reading progress indicator
- [ ] Related posts recommendations

**Phase 3: Analytics & Insights**
- [ ] Google Analytics integration
- [ ] Custom analytics dashboard
- [ ] Page view tracking
- [ ] User behavior analytics
- [ ] A/B testing framework

**Phase 4: Community Features**
- [ ] Comment system with moderation
- [ ] User authentication for comments
- [ ] Social sharing buttons
- [ ] Newsletter with email campaigns
- [ ] Feedback system

**Phase 5: Performance & DevOps**
- [ ] Redis caching layer
- [ ] CDN integration for images
- [ ] Automated backups
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Kubernetes deployment

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

1. 🐛 **Report Bugs** - [Create an issue](https://github.com/Nifazur/portfolio-website/issues)
2. 💡 **Suggest Features** - [Open a discussion](https://github.com/Nifazur/portfolio-website/discussions)
3. 📝 **Improve Documentation** - Fix typos, add examples
4. 🎨 **Design Improvements** - Submit UI/UX enhancements
5. 🔧 **Code Contributions** - Submit pull requests

### Commit Message Convention

```bash
# Format: <type>(<scope>): <subject>

feat(blog): add rich text editor support
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
style(ui): improve button hover effects
refactor(api): simplify error handling
test(blog): add unit tests for blog service
chore(deps): update dependencies
```

### Pull Request Guidelines

**PR Title**: Use conventional commit format
```
feat(dashboard): add analytics charts
```

**PR Description Template**:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe testing steps

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing

## Screenshots (if applicable)
Add screenshots here
```

---

## 💬 Support

Need help? Here's how to get support:

### 📧 Email Support
**Email**: nifazurrahman2872@gmail.com  
**Response Time**: Usually within 24-48 hours

### 💬 GitHub Issues
**Report Bugs**: [Create an issue](https://github.com/Nifazur/portfolio-website/issues/new?template=bug_report.md)  
**Request Features**: [Create an issue](https://github.com/Nifazur/portfolio-website/issues/new?template=feature_request.md)

### 📚 Documentation
- **Setup Guide**: See [Quick Start](#-quick-start)
- **API Docs**: See [API Documentation](#-api-documentation)
- **Troubleshooting**: See [Troubleshooting](#-troubleshooting)

### 💡 Discussions
**Ask Questions**: [GitHub Discussions](https://github.com/Nifazur/portfolio-website/discussions)  
**Share Ideas**: [Feature Requests](https://github.com/Nifazur/portfolio-website/discussions/categories/ideas)

### 🐦 Social Media
- **GitHub**: [@Nifazur](https://github.com/Nifazur)
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)

### 📞 Contact Information
- **Phone**: +880-1862040593
- **Location**: Bangladesh
- **Timezone**: GMT+6 (BST)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 MD. Nifazur Rahman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

**MD. Nifazur Rahman**  
Full-Stack Developer | Open Source Enthusiast | Problem Solver

### 🌐 Connect With Me

- **Portfolio**: [https://nifazur.vercel.app](https://nifazur.vercel.app)
- **GitHub**: [@Nifazur](https://github.com/Nifazur)
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)
- **Email**: nifazurrahman2872@gmail.com
- **Phone**: +880-1862040593
- **Location**: Bangladesh 🇧🇩

### 💼 Skills

**Frontend**: React, Next.js, TypeScript, Tailwind CSS  
**Backend**: Node.js, Express.js, Prisma, PostgreSQL  
**Tools**: Git, Bun, Vercel, Railway  
**Currently Learning**: GraphQL, Microservices

---

## 🙏 Acknowledgments

This project wouldn't be possible without these amazing tools and resources:

### 🛠️ Technologies

- [**Next.js**](https://nextjs.org/) - The React Framework for Production
- [**Express.js**](https://expressjs.com/) - Fast, unopinionated web framework
- [**Prisma**](https://www.prisma.io/) - Next-generation ORM for Node.js
- [**PostgreSQL**](https://www.postgresql.org/) - The World's Most Advanced Open Source Database
- [**TypeScript**](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [**Tailwind CSS**](https://tailwindcss.com/) - Utility-first CSS framework

### 🎨 UI Libraries

- [**shadcn/ui**](https://ui.shadcn.com/) - Beautiful UI components built with Radix UI
- [**Radix UI**](https://www.radix-ui.com/) - Unstyled, accessible components
- [**Lucide Icons**](https://lucide.dev/) - Beautiful & consistent icons
- [**TipTap**](https://tiptap.dev/) - Headless rich text editor

### 📚 Resources & Learning

- [**Next.js Documentation**](https://nextjs.org/docs) - Comprehensive Next.js guide
- [**Prisma Documentation**](https://www.prisma.io/docs) - Database toolkit docs
- [**TypeScript Handbook**](https://www.typescriptlang.org/docs/) - TypeScript guide
- [**MDN Web Docs**](https://developer.mozilla.org/) - Web development resources

### 🚀 Hosting & Infrastructure

- [**Vercel**](https://vercel.com/) - Frontend hosting platform
- [**Railway**](https://railway.app/) - Backend deployment platform
- [**Neon**](https://neon.tech/) - Serverless PostgreSQL
- [**Bun**](https://bun.sh/) - Fast all-in-one JavaScript runtime

### 🎓 Inspiration & References

- [**Next.js Examples**](https://github.com/vercel/next.js/tree/canary/examples)
- [**Taxonomy**](https://github.com/shadcn/taxonomy) - shadcn's starter template
- [**Cal.com**](https://github.com/calcom/cal.com) - Open source scheduling
- [**Plane**](https://github.com/makeplane/plane) - Project management tool

### ❤️ Special Thanks

- **Family & Friends** - For continuous support and motivation
- **Open Source Community** - For amazing tools and libraries
- **GitHub** - For providing an excellent platform
- **Programming Hero** - For web development training
- **You** - For checking out this project! ⭐

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/Nifazur/portfolio-website?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/Nifazur/portfolio-website?style=social)
![GitHub forks](https://img.shields.io/github/forks/Nifazur/portfolio-website?style=social)
![GitHub issues](https://img.shields.io/github/issues/Nifazur/portfolio-website?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Nifazur/portfolio-website?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/Nifazur/portfolio-website?style=flat-square)

---

## 🔗 Related Projects

Check out these related projects:

- [**Next.js Portfolio Template**](https://github.com/vercel/next.js/tree/canary/examples/portfolio)
- [**shadcn/ui Examples**](https://github.com/shadcn/ui)
- [**Prisma Examples**](https://github.com/prisma/prisma-examples)

---

## 🎯 Use Cases

This portfolio template is perfect for:

- 👨‍💻 **Developers** - Showcase your coding projects
- 🎨 **Designers** - Display your creative work
- 📝 **Bloggers** - Share your thoughts and tutorials
- 🚀 **Freelancers** - Attract potential clients
- 🎓 **Students** - Build your professional presence
- 👔 **Professionals** - Establish your personal brand

---

## 🔐 Security

### Reporting Security Issues

If you discover a security vulnerability, please email:
**nifazurrahman2872@gmail.com**

**Please do NOT create public GitHub issues for security vulnerabilities.**

### Security Measures

- ✅ JWT-based authentication with httpOnly cookies
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Refresh token mechanism
- ✅ CORS protection with configurable origins
- ✅ Input validation with Zod schemas
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection with content sanitization
- ✅ HTTPS enforcement in production
- ✅ Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- ✅ Middleware-based route protection
- ✅ Environment variable encryption

---

## 🌟 Key Features Breakdown

### Frontend Architecture

- **App Router**: Next.js 15 with file-based routing
- **Server Components**: RSC for optimal performance
- **Server Actions**: Form handling without API routes
- **Middleware**: Route protection and redirects
- **ISR**: 60s revalidation for dynamic content
- **Static Generation**: Build-time generation for stable pages
- **Error Boundaries**: Graceful error handling
- **Loading States**: Skeleton loaders for better UX

### Backend Architecture

- **MVC Pattern**: Organized module structure
- **Service Layer**: Business logic separation
- **Middleware**: Authentication, validation, error handling
- **Prisma ORM**: Type-safe database queries
- **JWT Strategy**: Access + refresh tokens
- **Graceful Shutdown**: Proper cleanup on process termination
- **Connection Pooling**: Optimized database connections
- **Response Formatting**: Consistent API responses

### Database Schema

```prisma
// Core Models
- Owner (Admin/User)
- Blog (with author relation)
- Project (portfolio items)
- ContactMessage (form submissions)
- Skill (categorized skills)
- Experience (work history)
- Education (academic history)

// Enums
- Role: OWNER, ADMIN
- ProjectStatus: COMPLETED, IN_PROGRESS, PLANNED
- SkillCategory: FRONTEND, BACKEND, DATABASE, TOOLS, DESIGN, OTHER
```

---

## 📦 Dependencies Overview

### Frontend Dependencies
```json
{
  "next": "15.5.5",
  "react": "19.1.0",
  "typescript": "5.x",
  "tailwindcss": "4.x",
  "@radix-ui/*": "Latest",
  "@tiptap/*": "2.5.8",
  "react-hook-form": "7.65.0",
  "zod": "4.1.12",
  "js-cookie": "3.0.5",
  "lucide-react": "0.545.0"
}
```

### Backend Dependencies
```json
{
  "express": "5.1.0",
  "@prisma/client": "6.3.0",
  "typescript": "5.x",
  "jsonwebtoken": "9.0.2",
  "bcrypt": "5.1.1",
  "cors": "2.8.5",
  "compression": "1.8.1",
  "cookie-parser": "1.4.7"
}
```

---

## 🚀 Quick Commands Reference

### Backend Commands
```bash
# Development
bun run dev              # Start dev server with hot reload
bun run build            # Build TypeScript to JavaScript
bun run start            # Start production server

# Database
bun run prisma:generate  # Generate Prisma Client
bun run prisma:migrate   # Run database migrations
bun run prisma:seed      # Seed database with sample data
bun run prisma:studio    # Open Prisma Studio GUI

# Utilities
bun run lint             # Run ESLint
```

### Frontend Commands
```bash
# Development
bun run dev              # Start dev server with turbopack
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run ESLint
```

---



## 🚀 Ready to Build?

**[Get Started Now](#-quick-start)** • **[View Demo](https://nifazur.vercel.app)** • **[Read Docs](#-api-documentation)**

---

### Made with ❤️ by [Nifazur Rahman](https://github.com/Nifazur)

**Built with Next.js 15 • Express.js • Prisma • PostgreSQL • TypeScript**

⭐ **Star this repo** if you found it helpful!

---

**[⬆ Back to Top](#-portfolio-website---full-stack-application)**

