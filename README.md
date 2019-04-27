#  Apollo Express MongoDB boilerplate

A full-fledged Apollo Server with Apollo Client starter project with React and Express.

## Features

- Node.js with Express and Apollo Server
- MongoDB Database
- Authentication w/ JWT and local storage
- Authorization:
  - protected endpoint (e.g. verify valid session)
  - protected resolvers (e.g. e.g. session-based, role-based)
  - protected routes (e.g. session-based, role-based)
- performance optimizations (example of using Facebook's dataloader)
- E2E testing

## Getting started

```bash
$> git clone https://github.com/ledevlab/apollo-express-mongodb-boilerplate your_app_name
$> cd your_app_name && rm -rf .git
$> npm install
$> npm start
# visit `http://localhost:8000` for GraphQL playground
```

```bash
# run tests
$> npm run test:run-server
# open new term
$> npm run test:execute-test
```

# TODO

- [ ] add dockerfile
