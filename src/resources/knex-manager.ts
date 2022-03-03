import knex from 'knex'
// eslint-disable-next-line import/order
import * as conf from '@src/config/index'

interface Config {
  db: {
    backend: { host: string; user: string; password: string; database: string }
  }
}

/**
 * Variable dump is required for webpack to load it in during bundling, as Serverless can't instantiate non used imports
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires,no-unused-vars
const dump = require('mysql')

const config = <Config>conf.init()

export const connect = () => {
  const clients = ['mysql', 'pg']

  const clientOptions = {
    mysql: {
      host: config.db.backend.host,
      user: config.db.backend.user,
      password: config.db.backend.password,
      database: config.db.backend.database
    }
  }

  return knex({
    client: clients[0],
    connection: clientOptions.mysql
  })
}
