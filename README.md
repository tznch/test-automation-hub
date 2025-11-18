# Test Automation Hub - Training Platform

Master test automation through 63 hands-on challenges.

## 🎯 What You Get

- **63 Interactive Challenges** - Real mini-apps with working backends
- **3 Difficulty Levels** - Beginner (20) → Intermediate (23) → Senior (20)
- **No Login Required** - 100% free, start learning immediately
- **Production Ready** - Deploy with Docker or your favorite platform

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development servers
npm run dev
```

**Access:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## 📚 Challenges

### Beginner (20)

Login forms, product lists, shopping carts, user profiles, search bars, pagination, modals, tabs, accordions, tooltips, notifications, breadcrumbs, progress bars, badges, chips, loading states, empty states, error states, success messages, confirmation dialogs

### Intermediate (23)

Multi-step forms, file uploads, real-time chat (WebSocket), drag-and-drop, infinite scroll, autocomplete, date pickers, rich text editors, image galleries, data tables, sorting, filtering, export data, bulk actions, keyboard shortcuts, accessibility features, theme switching, responsive layouts, print views, offline mode, service workers, PWA features, dynamic routing

### Senior (20)

Admin dashboards, CRUD panels, e-commerce checkout, social feeds, analytics charts, kanban boards, video players, map integration, feature flags, multi-tab sync, webhooks, GraphQL queries, microservices, rate limiting, caching strategies, database migrations, authentication flows, role-based access, audit logs, performance monitoring

## 🧪 How to Practice

**1. Start the platform:**

```bash
npm run dev
```

**2. Create your test project:**

```bash
mkdir my-playwright-tests && cd my-playwright-tests
npm init playwright@latest
```

**3. Write tests against challenges:**

```typescript
import { test, expect } from '@playwright/test';

test('login form validation', async ({ page }) => {
  await page.goto('http://localhost:5173/challenge/beginner-01-login-form');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/.*success/);
});
```

## 🚢 Deployment

### Docker

```bash
docker build -t playwright-hub .
docker run -d -p 3000:3000 playwright-hub
```

### Cloud Platforms

- **Vercel** - Deploy frontend with one click
- **Railway** - Full-stack deployment
- **AWS/DigitalOcean** - Traditional hosting

## Features

- 🎯 **63 Hands-on Challenges** - Progress from beginner to senior level
- 🔄 **Real-time Backend** - Test against actual API endpoints
- 📱 **Mobile Testing** - Practice responsive and touch interactions
- 🔌 **API Testing** - Learn HTTP methods, CRUD, authentication, rate limiting
- 📊 **Progress Tracking** - Save your progress locally
- 🎨 **Modern UI** - Built with React, TypeScript, and TailwindCSS
- ✅ **Comprehensive Testing** - 112 passing unit tests (60 frontend + 52 backend)
- 📚 **API Documentation** - Complete Swagger-style endpoint reference

## 📝 Development Commands

```bash
npm run dev              # Start both servers
npm run build            # Build for production
npm run lint             # Lint code
npm run type-check       # TypeScript type checking
npm run format           # Format with Prettier
npm run test:unit        # Run all unit tests
npm test                 # Run E2E tests (Playwright)
```

## 🧪 Testing

The platform includes comprehensive unit tests to ensure stability:

### Running Tests Locally

```bash
# Run all unit tests (backend + frontend)
npm run test:unit

# Run backend unit tests only
cd packages/backend && npm run test:run
# Or with coverage:
cd packages/backend && npm run test:coverage

# Run frontend unit tests only
cd packages/frontend && npm test -- --run

# Run E2E tests (requires servers running)
npm test
```

### Test Organization

**Backend Tests** (`packages/backend/src/__tests__/`):

- `utils/` - Authentication utilities (6 tests)
- `models/` - Database models (11 tests)
- `routes/` - API endpoints (33 tests)
  - `auth.routes.test.ts` - Login, refresh, logout (9 tests)
  - `items.routes.test.ts` - CRUD operations (12 tests)
  - `users.routes.test.ts` - User management (12 tests)

**Frontend Tests** (`packages/frontend/src/__tests__/`):

- `components/` - UI component tests (28 tests)
- `pages/` - Page-level tests (20 tests)
- `context/` - State management tests (12 tests)

### CI/CD Pipeline

GitHub Actions runs tests automatically on every push:

1. **Lint** - Code quality checks
2. **Type Check** - TypeScript validation
3. **Unit Tests** - All 112 tests must pass
4. **Build** - Compile backend and frontend (only after unit tests pass)
5. **E2E Tests** - Playwright end-to-end tests (only after build succeeds)
6. **Deploy** - Production deployment (main branch only)

**Test Coverage:**

- **Frontend**: 60 tests covering components, pages, and context
- **Backend**: 52 tests covering API routes, models, and utilities
- **Total**: 112 unit tests + E2E test suite

## 🎓 What You'll Learn

✅ Locator strategies (role, label, text, test-id)  
✅ Form testing and validation  
✅ API integration testing  
✅ WebSocket and real-time features  
✅ File upload testing  
✅ Complex interactions (drag-drop, infinite scroll)  
✅ Full-stack CRUD operations  
✅ E-commerce flows  
✅ Multi-tab synchronization

## 📊 Project Stats

- 63 interactive challenges
- 40+ API endpoints
- 50+ React components
- 112 unit tests (60 frontend + 52 backend)
- 15,000+ lines of code

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Reporting Bugs

Found a bug? Please [open an issue](https://github.com/tznch/test-automation-hub/issues) with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots if applicable

### Suggesting Features

Have an idea for a new challenge or feature? [Create an issue](https://github.com/tznch/test-automation-hub/issues) with:

- Detailed description of the feature
- Use case or problem it solves
- Any relevant examples or mockups

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test:unit`
5. Run linter: `npm run lint`
6. Run type check: `npm run type-check`
7. Commit with clear messages: `git commit -m "Add amazing feature"`
8. Push to your fork: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Code Style

- **TypeScript**: Strict mode enabled, all types must be explicit
- **React**: Functional components with hooks
- **Testing**: Write unit tests for new features (Vitest for unit, Playwright for E2E)
- **Formatting**: Run `npm run format` before committing
- **Commits**: Use conventional commits format (feat:, fix:, docs:, etc.)

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/test-automation-hub.git
cd test-automation-hub

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start development servers
npm run dev

# Run tests
npm run test:unit
```

### Testing Requirements

- All new features must include unit tests
- Tests must pass before PR approval
- Aim for >80% code coverage on new code
- E2E tests for critical user flows

### Need Help?

- Check existing [issues](https://github.com/tznch/test-automation-hub/issues) and [pull requests](https://github.com/tznch/test-automation-hub/pulls)
- Ask questions in issue comments
- Be respectful and constructive

## 📄 License

MIT - Free for learning and commercial use

---

**Built for QA Engineers** 🎭 | **Status:** ✅ Production Ready | **Tests:** 112 Unit Tests Passing
