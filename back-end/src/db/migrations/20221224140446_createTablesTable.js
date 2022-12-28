exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("tables")
  if(!exists) {
    await knex.schema
    .createTable("tables", (table) => {
      table.increments("table_id").primary();
      table.string("table_name").notNullable();
      table.integer("capacity").notNullable();
      table.integer("reservation_id").defaultTo(null);
      table
        .foreign("reservation_id")
        .references("reservation_id")
        .inTable("reservations");
    });
  }
};
  
  exports.down = function (knex) {
    return knex.schema.dropTable("tables");
  };