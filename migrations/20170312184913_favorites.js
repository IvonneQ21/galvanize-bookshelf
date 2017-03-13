
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', (table) => {
    table.increments('id').primary();
    table.integer('book_id').references('id').inTable('books').notNullable().onDelete('cascade');
    table.integer('user_id').references('id').inTable('users').notNullable().onDelete('cascade');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
  });
};
exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
