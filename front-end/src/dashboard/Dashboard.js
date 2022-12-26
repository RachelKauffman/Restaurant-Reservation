import React, { useEffect, useState } from "react";
import {useHistory} from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import {next,previous,today} from "../utils/date-time"
import ViewReservation from "../reservations/ViewReservation";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
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
      setReservationsError([]);
      const reservationDate = await listReservations({ date }, abortController.signal);
      setReservations(reservationDate);
    } catch (error) {
      setReservations([]);
      setReservationsError([error.message]);
    }
  }
  loadDashboard();
  return () => abortController.abort();
}, [date]);

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
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      
      <div>{reservationList}</div>
    </main>
  )
};

export default Dashboard;
