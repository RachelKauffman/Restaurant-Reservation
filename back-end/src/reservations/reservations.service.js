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
      .where({ reservation_date })
      .whereNotIn("status", ["finished", "cancelled"])
      .orderBy("reservations.reservation_time");
  }
  

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
        .where({reservation_id: reservation.reservation_id})
        .update(reservation, "*")
        .then((update) => update[0])
};

//Update reservation status
async function updateStatus(reservation_id, status) {
    return knex("reservations")
        .where({reservation_id})
        .update({status}, "*")
        .then((update) => update[0])
}

module.exports = {
    create,
    list,
    read,
    update,
    updateStatus,
}