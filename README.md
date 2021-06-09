# HulkSmash! Express Server

Pre-built Express server that allows you to get up and running quickly.

Under the hood this utilizes Express and Mongo to get you up and running quickly with very little setup.  Additionally I am fond of Papertrail so I use that for logging.

## Environment Variables

The config is currently pre-setup for you so all you need to do is provide the correct environment variables.

```
PORT=3000
MONGO_URI=mongodb://localhost
MONGO_DB=freebyrd-api-local
PAPERTRAIL_HOSTNAME=sample-api
PAPERTRAIL_URI=*****.papertrailapp.com
PAPERTRAIL_PORT=*****
```

## Installation and Usage

Install by enter one of the commands below.

```
npm install @sublet/hulk-express-server

-or-

yarn add @sublet/hulk-express-server
```

Once installed, create an `app.js` file at the root level 

```
const path = require('path')

const config = {
  port: process.env.EXPRESS_PORT || '3000',
  bind: '127.0.0.1',
  appFolder: path.join(__dirname, 'app'),
  wrapAsync: (fn, validate = false) => {
    return function(req, res, next) {

      if (validate) fn(req, res, next).catch(next)

      // Make sure to `.catch()` any errors and pass them along to the `next()`
      // middleware in the chain, in this case the error handler.
      if (!validate) fn(req, res, next).catch(next)
    }
  }
}

const server = require('@sublet/hulk-express-server')(config)

server.setupAndCreate()

module.exports = server
```

This can then be pulled into your app and the subfunctions can be accessed.

#### Example of starting the server.

```
#!/usr/bin/env node

/**
 * Environment variable validation
 */
require('dotenv').config()

const server = require('../app');

server.start()
```

### App Folder

I tend to keep all of my application logic in a folder called `app`. This contains all of the Routes, Controllers, and services you need to make your app work.

... More to follow.

## Quick Project Setup: CLI

Install the library globaly so you can access the CLI.

```
npm i -g @sublet/hulk-express-server
```

```
hulk init
```

Create an API

```
hulk template:api --title users
```

Create a Service

```
hulk template:service --title users
```

Copy Default Environment Variables

```
cp sample.env .env
```

Scripts section to make Makefile commands work

```
"scripts": {
  "start": "sls offline start --skipCacheInvalidation --dontPrintOutput --noPrependStageInUrl --lambdaPort 3005 --httpPort 3040",
  "test": "NODE_ENV=test nyc --reporter=html --reporter=text make test-all",
  "lint": "eslint ./"
},
"engines": {
  "node": ">=14.15.1"
},
```

### Install Dependencies

```
npm i @sublet/hulk-express-server @sublet/hulk-dl-mongo app-module-path aws-config aws-sdk axios bluebird boom ejs md5 moment numeral request serverless-http uuidv4
```

### Install Dev Dependencies
```
npm i eslint mocha nyc pre-commit require-directory serverless serverless-offline should supertest --save-dev
```