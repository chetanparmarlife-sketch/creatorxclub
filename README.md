# CreatorX Club

CreatorX is a three-sided influencer marketing marketplace with a Creator mobile app, Brand web portal, Admin dashboard, and a shared backend planned for later phases.

This scaffold contains the frontend monorepo only:

- `apps/creator`: Expo SDK 51 Creator mobile app with Expo Router
- `apps/brand`: Next.js 15 Brand portal with App Router, TypeScript, Tailwind CSS, and `src/`
- `apps/admin`: Next.js 15 Admin dashboard with App Router, TypeScript, Tailwind CSS, and `src/`
- `packages/types`: Shared TypeScript interfaces for the CreatorX domain model
- `packages/ui`: Shared shadcn-style UI primitives for Brand and Admin

## Prerequisites

- Node.js 20 or newer
- pnpm 10 or newer
- Expo CLI through `pnpm --filter creator dev`

## Install

```bash
pnpm install
```

## Run All Apps

```bash
pnpm dev
```

This runs `turbo dev` for all frontend apps.

## Local URLs

- Creator app: Expo dev server at `http://localhost:8081`
- Brand portal: `http://localhost:3000`
- Admin dashboard: `http://localhost:3001`

## Useful Commands

```bash
pnpm build
pnpm lint
pnpm test
```
