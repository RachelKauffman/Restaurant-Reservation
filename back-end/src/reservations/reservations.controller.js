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

// Verifies date conditions
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
  if(reservationDate < new Date() && reservationDate === "Tuesday") {
    return next({
      status:400,
      message:"Reservations must be created for a future date and not on a Tuesday"
    })
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

//validates reservation status for editing
function isBooked(req,res,next) {
  const {data} = req.body;
  if (data.status === "seated" || data.status === "finished") {
    return next({
      status:400,
      message:"Reservation cannot be edited while seated or finished"
    })
  }
  next();
}

function isFinished(req,res,next) {
  const {reservation_id} = req.params;
  const status = res.locals.reservation.status;
  if (status === "finished") {
    return next ({
      status: 400,
      message: `Reservation ${reservation_id} is already finished and cannot be updated`
    })
  }
  next();
}

async function reservationExists(req,res,next) {
  const {reservation_id} = req.params;
  const reservation = await service.read(reservation_id);
  if(reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
  next({
    status: 404,
    message: `Reservation ${reservation_id} does not exist.`,
  })
}
}

function mobileIsNumber (req,res,next) {
  const {data = {} } = req.body;
  const check =  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
    data["mobile_number"]
  );
  if (!check) {
    return next({
      status:404,
      message: "Phone number but be valid"
    })
  }
  next();
}


//create a reservation
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

//List handler for reservations
async function list(req, res) {
  const { date, mobile_number } = req.query;
  let reservations;
  if(date) {
    reservations = await service.list(date)
  } else if (mobile_number) {
    reservations = await service.listByNumber(mobile_number);
   }
  res.json({data:reservations})
}

//reads a reservation
async function read(req, res) {
  res.json({ data: res.locals.reservation });
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

//update reservation status
async function updateStatus(req,res,next) {
  const updated ={
    ...res.locals.reservation,
    status:res.locals.status,
  };
  service
    .update(updated)
    .then((data) => res.json({data}))
    .catch(next)
}

function validStatus(req,res,next) {
  const {status} = req.body.data;
  const validStatuses = ["booked", "cancelled", "finished", "seated"]
  if(validStatuses.includes(status)) {
    res.locals.status = status;
    next();
  } else {
    next ({
      status:400,
      message:"Status unknown"
    })
  }
}

module.exports = {
  create: [
    hasValidProperties,
    isValidDay,
    isBooked,
    mobileIsNumber,
    asyncBoundaryError(create),
  ],
  list: [asyncBoundaryError(list)],
  read: [asyncBoundaryError(reservationExists), read],
  updateReservation: [
    asyncBoundaryError(reservationExists),
    hasValidProperties,
    mobileIsNumber,
    asyncBoundaryError(updateReservation),
  ],
  updateStatus: [
    asyncBoundaryError(reservationExists),
    validStatus,
    isFinished,
    asyncBoundaryError(updateStatus),
  ],
};