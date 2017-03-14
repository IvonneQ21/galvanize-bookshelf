'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_dev',
    migrations: {
      tableName: 'knex_migrations'

    }
  },

  test: {
    client:'pg',
    connection:'postgres://localhost/bookshelf_test',
  },
  production: {
      client: 'pg',
      connection:process.env.DATABASE_URL
  }
}
