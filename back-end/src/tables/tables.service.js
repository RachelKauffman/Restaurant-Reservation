const knex = require("../db/connection");

// CREATE
async function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((created) => created[0]);
}

// LIST
async function list() {
  return knex("tables").select("*").orderBy("table_name", "asc");
}

// READ
async function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

// UPDATE
async function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updated) => updated[0]);
}

module.exports = {
  create,
  list,
  read,
  update,
};