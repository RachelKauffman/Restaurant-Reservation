const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

/**
 * Dev Notes:
 * lists all tables in database.
 * using the table_id read.
 * using the table_id and the reservation we can clear a seat
 * or update a status
 */

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router.route("/:table_id").get(controller.read).all(methodNotAllowed);

router
  .route("/:table_id/seat")
  .put(controller.update)
  .delete(controller.clearTable)
  .all(methodNotAllowed);

module.exports = router;