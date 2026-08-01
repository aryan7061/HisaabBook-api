# HisaabBook API

Backend for [HisaabBook](https://github.com/aryan7061/HisaabBook) — a CRM for managing companies, contacts, deals, and tasks.

Live API: https://hisaabbook-api.onrender.com
Website Link:- https://hisaab-book-three.vercel.app

I built this backend with NestJS, GraphQL, and PostgreSQL. It uses `@ptc-org/nestjs-query` to auto-generate CRUD resolvers, so the API supports pagination, filtering, and aggregates without writing repetitive boilerplate for every resource.

## Stack
- Framework: NestJS 10
- API: GraphQL via `@nestjs/graphql` + Apollo Server 4
- ORM: TypeORM 0.3.x, with migrations (`synchronize` disabled in production)
- Database: PostgreSQL (Neon, serverless), connected via Neon's pooled endpoint
- Auth: JWT (`@nestjs/jwt` + `passport-jwt`), password hashing with `bcrypt`
- CRUD generation: `@ptc-org/nestjs-query`
- N+1 protection: `dataloader` for relation batching

## Data model
Seven entities: `User`, `Company`, `Contact`, `Deal`, `DealStage`, `Task`, `TaskStage`.
- Users have a role (`ADMIN`, `SALES_MANAGER`, `SALES_PERSON`, `SALES_INTERN`) that drives authorization.
- Companies, Contacts, and Deals each track a `salesOwner` and `createdBy`.
- Deals link to a company, an owner, an optional contact, and an optional stage.
- Tasks support a checklist (JSON), multiple assigned users, and multiple linked contacts.
- Deal stages and task stages exist as their own entities with full CRUD in the API, but the frontend does not currently expose a UI to manage them — they're used as fixed reference data.

## Authorization
Every resource (Companies, Contacts, Deals, Tasks) enforces ownership at the API level, not just in the UI:

- `ADMIN` and `SALES_MANAGER` can see and modify all records.
- Every other role is restricted to records they created or own (`createdById` / `salesOwnerId` / `dealOwnerId`, depending on the resource).

This is enforced server-side via `@ptc-org/nestjs-query`'s authorizer hooks, so a request can't bypass scoping by editing the GraphQL query on the client.

## Auth
- Email/password login and registration, JWT-based sessions.
- A `demoLogin` mutation logs in a fixed demo account (no password) so visitors can try the app without registering. The demo account only sees its own seeded data.
- Password reset ("forgot password") is not implemented yet — the frontend form exists but doesn't call any backend logic.

## Environment variables
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=<a random secret string>
FRONTEND_URL=https://hisaab-book-three.vercel.app
NODE_ENV=production

- `FRONTEND_URL` controls CORS (comma-separated if you need more than one origin). If unset, CORS allows all origins — fine for local dev, not for production.
- `NODE_ENV=production` disables the GraphQL Playground and introspection.

## Setup
```bash
npm install
```

Create a `.env` file as shown above, then:
```bash
# development, with watch mode
npm run start:dev

# production
npm run start:prod
In development (`NODE_ENV` not set to `production`), the GraphQL Playground is available at `http://localhost:3000/graphql`.

## Migrations
Schema is managed with TypeORM migrations (`synchronize` is off).
```bash
npm run migration:generate -- src/migrations/<name>
npm run migration:run
npm run migration:revert
```

## Deployment
Deployed on Render as a Node web service.
- Build: `npm install --include=dev && npm run build`
- Run: `npm run start:prod`

## License

No license — all rights reserved.
