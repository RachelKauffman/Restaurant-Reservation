const service = require("./reservations.service");
const asyncBoundaryError = require("../errors/asyncErrorBoundary");

//Middleware

const dateFormatted = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const timeFormatted = /[0-9]{2}:[0-9]{2}/;

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "people",
  "reservation_date",
  "reservation_time",
];

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: "Requires valid property",
    });
  }

  /**
   * Checking Properties :
   * 1st. if no property it needs to require one.
   * 2nd. requires the people to be a Number.
   * 3rd. requires the reservation date to be formatted correctly.
   * 4th. requires the time to be formatted correctly.
   */
  VALID_PROPERTIES.forEach((property) => {
    if (!data[property]) {
      return next({
        status: 400,
        message: `Requires ${property}`,
      });
    }

    if (property === "people" && !Number.isInteger(data.people)) {
      return next({
        status: 400,
        message: `Requires ${property} to be a number`,
      });
    }

    if (
      property === "reservation_date" &&
      !dateFormatted.test(data.reservation_date)
    ) {
      return next({
        status: 400,
        message: `Requires ${property} to be properly formatted as YYYY-MM-DD`,
      });
    }

    if (
      property === "reservation_time" &&
      !timeFormatted.test(data.reservation_time)
    ) {
      return next({
        status: 400,
        message: `requires ${property} to be properly formatted as HH:MM`,
      });
    }
  });
  next();
}

// Verifying conditions of days
function isValidDay(req, res, next) {
  const { data } = req.body;
  const reservationDate = new Date(
    `${data.reservation_date} ${data.reservation_time}`
  );
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[reservationDate.getDay()];
  let time = data.reservation_time;
  if (reservationDate < new Date() && day === "Tuesday") {
    return next({
      status: 400,
      message:
        "Reservations can only be created on a future date, excluding Tuesdays",
    });
  }
  if (reservationDate < new Date()) {
    return next({
      status: 400,
      message: "Reservations can only be created on a future date",
    });
  }
  if (day === "Tuesday") {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesdays",
    });
  }
  if (time <= "10:30" || time >= "21:30") {
    return next({
      status: 400,
      message: "Reservations can only be made from 10:30AM - 9:30PM.",
    });
  }
  next();
}

/*-------------------------------------------------------------------------------------------*/
//create a reservation
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

//List handler for reservation resources
async function list(req, res) {
  const { data } = res.locals;
  res.json({ data: data });
}

//reads a reservation
async function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

//update reservation
async function updateReservation(req, res) {
  const { reservation } = res.locals;
  const { data } = req.body;
  const updatedData = {
    ...reservation,
    ...data,
  };
  const updatedReservation = await service.update(updatedData);
  res.json({ data: updatedReservation });
}

module.exports = {
  create: [hasValidProperties, isValidDay, asyncErrorBoundary(create)],
  list: [asyncErrorBoundary(list)],
  read,
  update: [, hasValidProperties, asyncErrorBoundary(update)],
  updateStatus: [asyncErrorBoundary(updateStatus)],
};
