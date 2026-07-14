# HisaabBook API

Backend for [HisaabBook](https://github.com/aryan7061/HisaabBook) — a CRM for managing companies, contacts, deals, tasks, and quotes.

Built with NestJS 10, GraphQL (Apollo Server 4), TypeORM, and PostgreSQL (hosted on Neon), using `@ptc-org/nestjs-query` for auto-generated CRUD resolvers matching the frontend's expected query contract exactly (offset pagination, filtering, aggregates).

## Stack

- **Framework:** NestJS 10
- **API:** GraphQL via `@nestjs/graphql` + Apollo Server 4
- **ORM:** TypeORM 0.3.x
- **Database:** PostgreSQL (Neon, serverless)
- **Auth:** JWT (`@nestjs/jwt`) + bcrypt password hashing
- **CRUD generation:** `@ptc-org/nestjs-query`

## Setup

```bash
npm install
```

Create a `.env` file in the project root:
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=<a random secret string>

## Running the app

```bash
# development, with watch mode
npm run start:dev

# production
npm run start:prod
```

The GraphQL Playground is available at `http://localhost:3000/graphql` once running.

## License

MIT
