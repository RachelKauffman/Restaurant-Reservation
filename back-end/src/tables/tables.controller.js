const service = require("./tables.service");
const asyncBoundaryError = require("../errors/asyncErrorBoundary")
const reservationService = require ("../reservations/reservations.service");

//MIDDLEWARE

const VALID_PROPERTIES = [
    "table_name",
    "capacity",
];

function hasValidProperties(req,res,next) {
    const {data = {} } = req.body;
    if(!data) {
        return next({
            status:400,
            message: "Requires property"
        })
    }


VALID_PROPERTIES.forEach((property) => {
    if(!data[property]) {
        return next({
            status:400,
            message:`Requires ${property}`
        })
    }

    if(property === "table_name" && table_name.length < 2) {
        return next({
            status:400,
            message:"The table name must be at least 2 characters"
        })
    }

    if(property === "capacity" && capacity < 1) {
        return next({
            status:400,
            message: "The table must be able to seat at least 1 person"
        })
    }
})
    next()
};

//Check to see if table exists
async function tableExists(req,res,next) {
    const {table_id} = req.params;
    const table = await service.read(table_id)
    if(table) {
        res.locals.table = table;
        next()
    } else {
        return next ({
            status: 400,
            message: `Table ${table_id} does not exist.`
        })
    }
    next()
};


//checks if table is occupied
async function tableOccupied(req,res,next) {
    const {status} = res.locals.table
    if(status === "Occupied") {
        return next({
            status:400,
            message:"Table is occupied!"
        })
    }
    next()
};

//verifies reservation
async function reservationExists(req,res,next) {
    const {reservation_id} = req.body.data;
    const reservation = await service.read(reservation_id);
    if(reservation) {
      res.locals.reservation = reservation;
      return next();
    } else {
      return next({
      status:404,
      message: `Reservation ${reservation_id} does not exist.`,
    })
  }
  }

//verifies table capacity can handle party size
async function tableCapacity(req,res,next) {
    const {capacity} = res.locals.table;
    const {people} = res.locals.reservation;
    if(capacity < people) {
        return next({
            status:400,
            message:`Table cannot sit ${people} people `
        })
    }
next()
}

//create new table
async function create(req,res) {
    const table = await service.create(req.body.data)
    res.status(201).json({data:table})
}

//list tables
async function list(req,res) {
    const data = await service.list()
    res.json({data})
}

//read specific table
async function read(req,res) {
    const {table} = res.locals;
    res.json({data:table})
}

//seat a table
async function seat(req,res) {
    const {reservation_id} = res.locals.reservation;
    const {table} = res.locals;
    const updatedTable = {
        ...table,
        reservation_id: reservation_id
    }
    reservationService.updateStatus(reservation_id, "seated")
    service
        .update(updatedTable)
        .then((data) => res.json({data}))
        .catch(next)
};

module.exports = {
    create: [hasValidProperties,
            asyncBoundaryError(create),
        ],
    list: [asyncBoundaryError(list)],
    read: [tableExists,
           asyncBoundaryError(read)
        ],
    seat:[hasValidProperties,
          asyncBoundaryError(tableExists),
          asyncBoundaryError(reservationExists),
          tableCapacity,
          asyncBoundaryError(seat)
    ]

};