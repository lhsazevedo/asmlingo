# Asmlingo

A Duolingo-like microlearning prototype for learning SuperH assembly (or any assembly language).

![Banner](./banner.png)

## Overview

> [!NOTE]
> The project received some architectural improvements after the initial week of development.
> You can read more about the changes in the "2024-09-17: Updates and Architectural Changes", at the
> end of this README.

> [!IMPORTANT]
> This project is a learning exercise developed over the course of one week to explore and
> gain hands-on experience with TypeScript, Next.js 14, and Prisma ORM. It is not intended for
> production use. The primary goals were rapid learning, technology exploration, and demonstration
> of newly acquired skills.

Asmlingo is a educational app inspired by Duolingo's microlearning concept, designed to teach
assembly language using a gamified approach. This project was developed as a week-long deep dive
into a new tech stack for me: TypeScript, Next.js 14 and Prisma ORM.

## Features

- Interactive challenges for learning assembly.
- Extensible challenge system (only gap-fill implemented for now).
- Progress tracking.
- Guest mode with optional user promotion (Sign Up to save your progress).
- Responsive desing with CSS Modules for component styling and Tailwind CSS common utility classes.
- Animated challenge transition with Framer Motion.

## Tech Stack

- TypeScript
- Next.js 14
- React 18
- Prisma ORM with SQLite
- Iron Session for session management
- Zod for schema validation
- Vitest and React Testing Library for unit testing
- Playwright for end-to-end testing
- Storybook for component developement and documentation
- Tailwind CSS

## Setup

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Copy the `.env.example` file to `.env` and set the environment variables.
4. Migrate and seed the database:
   ```bash
   $ npx prisma generate
   $ npx prisma migrate dev
   $ npx tsx scripts/seed.ts
   ```
5. Run the development server with `npm run dev`.
6. Explore tooling:
   - Run Storybook with `npm run storybook`.
   - Run tests with `npm test`.
   - Run e2e tests with `npm run e2e`.
   - Run Prisma Studio with `npx prisma studio`.

## Project Structure

```
.
├── src
│   ├── app
│   │   ├── api ............... API route handlers
│   │   ├── (auth) ............  Authentication routes
│   │   │   ├── signin
│   │   │   └── signup
│   │   └── lesson
│   │       └── [id]  ......... Lesson route
│   ├── components ............ UI components and tests
│   ├── icons ................. SVG icons as components
│   └── server ................ Server application logic
│       ├── core .............. Core application domain logic
│       │   ├── cases ......... Use cases for core business logic
│       │   ├── contracts ..... Interfaces for external dependencies
│       │   ├── repositories .. Data access layer
│       │   └── services ...... Reusable domain logic
│       └── providers ......... Abstracted external services
├── prisma .................... Prisma schema and migrations
├── public .................... Public assets
├── scripts ................... Utility scripts
└── tests ..................... e2e tests
```

## Testing

This projects uses both unit and end-to-end tests. Unit tests are written with Vitest and React
Testing Library, while end-to-end tests are written with Playwright.

There is much more to be done in terms of testing, such as adding more unit tests for expected
behaviors and edge cases, and adding e2e tests for authentication.

## Challenges and Learnings

- **TypeScript**: Really powerful for avoiding run time errors and improving code readability, I'm
  looking forward to using it in more projects.
- **Next.js 14**: First time using Next.js. Easy to start with, but took some time to adapt to the
  opinionated structure and data fetching patterns. I should revisit this project in the future now
  that I have a better understanding of the framework.
- **Prisma ORM**: I have to be honest, having types for my queries and results on both the client
  and server side is something I'll really miss in other projects.

## Future improvements

- [ ] Implement heart system for challenges.
- [ ] Address TODOs in codebase.
- [x] Rethink the architecture to better separate concerns.
- [x] Add styles to the Sign Up page.
- [x] Add Sign In page.
- [ ] Backoffice panel for managing challenges and lessons.
- [ ] Internationalization
- [ ] Add missing cascade on delete referential actions.
- [ ] Measure test coverage and add more tests.

## Final thoughts

This project was a fun learning experience. I'm happy with the result, but I would like to revisit
now that I can focus more on the architecture instead of learning the tech stack.

# 2024-09-17: Backend Architectural Changes

The project's backend code was refactored to improve modularity, maintainability, and testability.
The new architecture is inspired by Clean Architecture principles, adapted pragmatically to fit the
project's specific context and time constraints.

#### Layered architecture

Implemented a layered architecture that separates concerns applying principles such as Dependency
Inversion and Use Cases, while trading of some abstractions (db and validation) for practicality.

#### Dependency Injection

Implemented an IoC and dependency injection container using
[Awilix](https://github.com/jeffijoe/awilix). See `src/server/container.ts`.

#### Use Cases and Domain Logic

Introduced Use Cases to encapsulate core business logic (e.g., GetRoadmap, FinishLesson).
Created Services and Repositories to handle reusable domain logic and data access, respectively.

#### API Structure and Error Handling

Reorganized API routes for consistency and improved error handling, and began implementing utility
functions for standardized API responses.

#### Type Safety

Enhanced TypeScript/ESLint configuration with stricter rules and added more type definitions for
better type safety.

#### Refactor Final Thoughts

While these changes significantly improve the project's architecture, there are still areas for
further development:

- **Infrastructure dependencies**: Some concrete infrastructure dependencies remain in services:
  schema validation (Zod) and database (Prisma). This was a pragmatic decision to avoid recreating a
  1:1 abstraction layer of the fluent APIs provided by these libraries. This may be revisited in
  future iterations as I learn more about architectural best practices.
- **Anemic Entities**: ~~Prisma excellent generated types are currently being used as anemic entities.
  I would like to talk with experienced engineers and explore the feasibility of implementing a more
  robust domain model layer for short-lived entities in web applications context.~~  
  Edit: Writing tests for use cases that interact with Prisma was a pain point. In retrospect, using
  my own domain entities would declouple the core domain logic from the ORM, making it easier to
  test. [MikroORM](https://mikro-orm.io), which unfortunately I discovered only after this refactor,
  looks really promising for this scenario.
- **Client-side validation**: Challenge answer validation is currently done client-side. This was a
  trade-off for better user experience as it allows for immediate feedback.
- **Error handling**: Error handing, particularly around Promise rejections, could be improved for
  more robust exception management. I would like to explore [using Either/Result
  monads](https://blog.devgenius.io/using-either-result-in-typescript-for-error-handling-66baceefd9a0).
- **Testing**: While the project became more testable, there wan't enough time to implement unit
  tests in this new architecture. This is a priority for future iterations. For now, you can see the
  tests for a couple of use cases in `src/server/core/cases` directories. Note that the existing e2e
  tests are still passing 😊.

### Future tasks:

These are the follow up tasks that I would follow for getting this project production ready:

- Done ~~Write unit tests for all use cases and services.~~
- Write integration tests for the API routes.
- Add a config service to manage environment variables and configuration.
- Further refining the separation of concerns where beneficial.
  - Consider tools like `eslint-plugin-boundaries` or `dependency-cruiser` for architectural
    testing.
- Implement a logging system for better debugging and monitoring.
- Improve error handling and validation throughout the application.
- Improve security measures for the API, addings mecanisms such as rate limiting.
- Improving response typing for better API contract definition.
- Refactor the frontend code using best practices and architectural patterns for React:
  https://vasanthk.gitbooks.io/react-bits
