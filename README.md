# TaskBoard

A minimal full-stack task management application.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | SQLite (via Prisma) |
| ORM | Prisma |
| Auth | NextAuth.js v4 (JWT + Credentials) |
| Styling | Tailwind CSS |
| Password Hashing | bcryptjs |

---

## Authentication Flow

1. **Signup** — User submits name, email, and password to `POST /api/auth/signup`. Password is hashed with `bcryptjs` (salt rounds: 12) and the user record is stored in SQLite.
2. **Login** — User submits credentials to NextAuth's Credentials Provider. The handler fetches the user by email, compares the submitted password against the stored hash using `bcrypt.compare`, and rejects on mismatch.
3. **Session** — On successful login, NextAuth issues a signed JWT (stored in an HTTP-only cookie). The JWT contains the user's `id`, `name`, and `email`.
4. **Protected routes** — API routes call `getServerSession(authOptions)` to verify the JWT on every request. The dashboard page uses `useSession()` client-side and redirects to `/login` if unauthenticated.
5. **Logout** — `signOut()` from NextAuth clears the session cookie.

---

## Database Schema

```
User
  id        String   (cuid, PK)
  email     String   (unique)
  name      String
  password  String   (bcrypt hash)
  createdAt DateTime

Task
  id        String   (cuid, PK)
  title     String
  status    String   ("TODO" | "IN_PROGRESS" | "DONE")
  createdAt DateTime
  updatedAt DateTime
  userId    String   (FK → User.id)
```

**Relationship:** One User → Many Tasks. Every task is scoped to its creator — users can only read and update their own tasks (enforced in API routes).

---

## Project Structure

```
taskboard/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # NextAuth handler
│   │   │   └── signup/route.ts          # POST /api/auth/signup
│   │   └── tasks/
│   │       ├── route.ts                 # GET, POST /api/tasks
│   │       └── [id]/route.ts            # PATCH /api/tasks/:id
│   ├── dashboard/page.tsx               # Main task board (protected)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── layout.tsx
│   ├── page.tsx                         # Root redirect
│   └── globals.css
├── components/
│   ├── Providers.tsx                    # SessionProvider wrapper
│   ├── TaskCard.tsx                     # Individual task with status dropdown
│   └── CreateTaskModal.tsx              # Modal for new task creation
├── lib/
│   ├── auth.ts                          # NextAuth config
│   └── prisma.ts                        # Prisma client singleton
├── types/
│   ├── index.ts                         # Task, TaskStatus types
│   └── next-auth.d.ts                   # Session type augmentation
├── prisma/
│   └── schema.prisma
├── .env.example
└── README.md
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- npm

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd taskboard

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and set a strong NEXTAUTH_SECRET

# 4. Set up the database
npx prisma db push

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

### Useful commands

```bash
npm run db:push     # Sync Prisma schema to SQLite (creates dev.db)
npm run db:studio   # Open Prisma Studio to inspect the database
npm run build       # Production build
npm start           # Start production server
```

---

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Register a new user |
| POST | `/api/auth/signin` | No | NextAuth login |
| GET | `/api/tasks` | Yes | Get all tasks for logged-in user |
| POST | `/api/tasks` | Yes | Create a new task |
| PATCH | `/api/tasks/:id` | Yes | Update task status |

---

## Design Decisions

- **SQLite over PostgreSQL** — Zero configuration for local development; swap the `DATABASE_URL` and provider in `schema.prisma` to use PostgreSQL in production.
- **JWT sessions** — Stateless, no session table needed; the user `id` is embedded in the token and verified on each request.
- **Kanban layout** — Three columns (To Do / In Progress / Done) on the dashboard give a clear visual overview. Status is updated inline via a dropdown per card.
- **No delete by design** — Per the assignment spec, delete functionality is intentionally omitted.
