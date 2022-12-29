const knex = require("../db/connection");

//create
async function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((created) => created[0])
};

//list tables
async function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name", "asc")
};

//read
async function read({table_id}){
    return knex("tables")
        .select("*")
        .where({table_id})
        .first()
};

//update table
async function update(table) {
    return knex("table")
        .where({table_id: table.table_id})
        .update(table, "*")
        .then((updated) => updated[0])
};

modules.export = {
    create,
    list,
    read,
    update,
}