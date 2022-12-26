const service = require("./reservations.service");
const asyncBoundaryError = require("../errors/asyncErrorBoundary");
//Middleware

const VALID_PROPERTIES = [
    "first_name",
    "last_name",
    "mobile_number",
    "people",
    "reservation_date",
    "reservation_time",
];


//has valid properties
function hasValidProperties(req,res,next) {
  const {data = {} } = req.body;
  if(!data) {
  return next({
    status:400,
    message:"All properties are required"
  })
}
VALID_PROPERTIES.forEach((property) => {
  if(!data[property]) {
    return next ({
      status:400,
      message:`Requires ${property}`
    })
  }
})
next(); 
}

//Checks that reservation is valid
function validReservation(req,res,next) {
  const {data} = req.body;
  const reservationDate = new Date(`${data.reservation_date} ${data.reservation_time}`);
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let day = days[reservationDate.getDay()];
  let time = data.reservation_time;
  const dateFormat = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
  //checks if date is in past
  if(reservationDate < new Date()) {
    return next({
      status:400,
      message:"Reservation date must be for a future date"
    })
  }
  //if it's made for date closed
  if(day === "Tuesday") {
    return next({
      status:400,
      message:"The restaurant is closed on Tuesdays"
    })
  }
  //reservation is made during operating hours
  if(time < "10:30" || time > "21:30") {
    return next({
      status:400,
      message:"Reservation must be made between the hours of 10:30AM and 9:30PM"
    })
  }
//date is valid format
if(!dateFormat.test(data.reservation_date)) {
  return next({
    status:400,
    message:"Reservation date formatted incorrectly"
  })
}
next();
};

//checks that time is valid format
function validTime(req,res,next) {
  const timeFormat = new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]")
  if(!timeFormat.test(reservation_time)) {
    return next({
      status:400,
      message:"Time is formatted incorrectly"
    })
  }
  next();
};

  //checks that people is integer/greater than 0
  function peopleIsInteger(req,res,next) {
    const {people} = req.body.data;
    const partySize = Number.isInteger(people)
    if(!partySize) {
      return next({
        status:400,
        message:`${people} needs to be a number`
      })
    }
    if(people < 1) {
      return next({
        status:400,
        message:`${people} must be a minimum of 1`
      })
    }
    next();
};

/*-------------------------------------------------------------------------------------------*/
//create a reservation
async function create(req,res) {
  const reservation = await service.create(req.body.data)
  res.status(201).json({data:reservation})
};

//List handler for reservation resources
async function list(req, res) {
 const {date} = req.query;
 let reservations = await service.list(date)
 res.json({data:reservations})
}

//reads a reservation
async function read(req,res) {
  const {reservation} = res.locals;
  res.json({data:reservation})
};


//update reservation
async function updateReservation(req,res) {
  const {reservation} = res.locals;
  const {data} = req.body;
  const updatedData = {
    ...reservation,
    ...data,
  }
  const updatedReservation = await service.update(updatedData);
  res.json({data:updatedReservation})
};



module.exports = {
  create: [
    hasValidProperties,
    validReservation,
    peopleIsInteger,
    validTime,
    asyncBoundaryError(create),
  ],
  list:[asyncBoundaryError(list)],
  read,
  updateReservation:[
    hasValidProperties,
    asyncBoundaryError(updateReservation),
  ]
}
