# Mock FB

## Getting Started

---

### Run Locally

To run this application, you need to have Node.js, and git(to clone the repo) installed. Then follow the instructions to get
it up and running

- set up environment

```bash
# clone the repo
git clone https://github.com/OvieMudi/tql.git
cd tql

# install dependencies
npm install

# create .env in root directory (see .env.example)
touch .env

# initialize orm
npm run migrate:generate

# run migrations
npm run migrate:dev

# start server
npm run dev
```

- access the server on the specified e.g `localhost:3000 or 127.0.0.1:3000`

## Production

This app is set up to use [heroku](https://heroku.com) for deployments. see the [Getting Started Guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs) for Node.js.

```bash
# update heroku production config
heroku config:set NPM_CONFIG_PRODUCTION=false

# add all environment variables
heroku config:set DATABASE_URL=false CLIENT_URL="https://frontend.url" ...
```

View the [demo](https://mock-fb-tql.herokuapp.com/v1).\
Explore the [API documentation](https://documenter.getpostman.com/view/4783528/TzRa74Ge).
