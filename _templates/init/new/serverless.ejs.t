---
to: serverless.yml
---
service: hulk-api

plugins:
  - serverless-offline

provider:
  name: aws
  runtime: nodejs12.x
  stage: ${opt:stage, 'dev'}
  memorySize: 1024
  timeout: 10
  versionFunctions: false
  environment:
    NODE_ENV: ${env:NODE_ENV}
    SSL: ${env:SSL}
    MONGO_URI: ${env:MONGO_URI}
    MONGO_DB: ${env:MONGO_DB}
    DISABLE_AUTO_INDEX: ${env:DISABLE_AUTO_INDEX}

custom:
  prefix: "${self:service}-${self:provider.stage}"

functions:

  # Proxy

  proxy:
    name: "${self:custom.prefix}-Proxy"
    handler: app/sls/index.proxy
    timeout: 30
    memorySize: 1024
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
