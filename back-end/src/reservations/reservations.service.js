const knex = require("../db/connection");

//Create
async function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0])
};

//List by date in order of time
async function list(reservation_date) {
    return knex("reservations")
        .select("*")
        .where({reservation_date})
        .whereNot({status:"finished"})
        .whereNot({status: "cancelled"})
        .orderBy("reservation_time")
};

//Read
async function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({reservation_id})
        .first()
};

//Update
async function update(reservation) {
    return knex("reservations")
        .update(reservation, "*")
        .where({reservation_id: reservation.reservation_id})
        .then((update) => update[0])
};



module.exports = {
    create,
    list,
    read,
    update
}