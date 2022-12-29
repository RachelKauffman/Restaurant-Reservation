import React, { useEffect, useState } from "react";
import {useHistory} from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import useQuery from "../utils/useQuery";
import {next,previous,today} from "../utils/date-time"
import ViewReservation from "../reservations/ViewReservation";
import Tables from "../tables/Tables"
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([])
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null)
  const history = useHistory();

  //will use date from url for each new date
  const dateQuery = useQuery().get("date");
  if (dateQuery) {
    date = dateQuery;
  }
   
//load reservations by date
useEffect(() => {
  const abortController = new AbortController();

  async function loadDashboard() {
    try {
      setReservationsError(null);
      const reservationDate = await listReservations({ date }, abortController.signal);
      setReservations(reservationDate);
    } catch (error) {
      setReservationsError([error.message]);
    }
  }
  loadDashboard();
  return () => abortController.abort();
}, [date]);

//load all tables
useEffect(() => {
  const abortController = new AbortController();

  async function loadTables() {
    try{
      setTablesError(null);
      const tableList = await listTables(abortController.signal);
      setTables(tableList);
    } catch (error) {
      setTablesError([error.message])
    }
  }
  loadTables()
  return () => abortController.abort()
}, [])

  const reservationList = reservations.map((reservation) => {
    if (reservation.status === "cancelled" || reservation.status === "finished")
      return null;
    return (
      <ViewReservation
        key={reservation.reservation_id}
        reservation={reservation}
      />
    );
  });

const tablesList = tables.map((table) => {
  return (
<Tables key={table.table_id} table={table} />
  )
})

  return (
    <main>
      <h1>Dashboard</h1>
      <div>
        <button className="btn btn-dark" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>
          Previous
        </button>
        &nbsp;
        <button className="btn btn-dark" onClick={() => history.push(`/dashboard?date=${today()}`)}>
          Today
        </button>
        &nbsp;
        <button className="btn btn-dark" onClick={() => history.push(`/dashboard?date=${next(date)}`)}>
          Next
        </button>
      </div>
      <h4 className="mb-0">Reservations for: {date}</h4>
        <ErrorAlert error={reservationsError} />
        <ErrorAlert error={tablesError} />
      <div>
        <div>{reservationList}</div>
      </div>
      <div>
        <h4 className="text-center">Tables</h4>
      </div>
      <div>{tablesList}</div>
    </main>
  )
};

export default Dashboard;
