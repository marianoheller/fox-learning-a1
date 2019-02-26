import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import session from 'express-session'
import { createClient as createRedisClient } from 'redis'
import connectRedis from 'connect-redis'
import { env, redis, masterKey } from '../../config'

const initializeRedis = (session, { host, port, password }) => {
  const redisClient = createRedisClient({
    host,
    port,
    password
  })
  redisClient.on('connect', function () {
    console.log('redis connected');
    console.log(`connected ${redisClient.connected}`);
  }).on('error', function (error) {
    console.log("ERROR", error);
  });
  const RedisStore = connectRedis(session)
  return new RedisStore({ client: redisClient })
}

export default (apiRoot, routes) => {
  const app = express()
  app.use(session({
    resave: true,
    saveUninitialized: true,
    key: 'SID',
    secret: masterKey,
    store: initializeRedis(session, redis)
  }))

  /* istanbul ignore next */
  if (env === 'production' || env === 'development') {
    app.use(cors())
    app.use(compression())
    app.use(morgan('dev'))
  }

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(apiRoot, routes)
  app.use(queryErrorHandler())
  app.use(bodyErrorHandler())

  return app
}
