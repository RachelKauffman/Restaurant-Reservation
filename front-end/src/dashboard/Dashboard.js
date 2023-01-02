import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useQuery from "../utils/useQuery";
import { listReservations, listTables } from "../utils/api";
import { next, previous, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ViewReservation from "../reservations/ViewReservation";
import Tables from "../tables/Tables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tableError, setTableError] = useState(null);

  const history = useHistory();
 //will use date from url for each new date
 const dateQuery = useQuery().get("date");
 if (dateQuery) {
   date = dateQuery;
 }
  /**
   * calling on the api to get our reservations by
   * a specific date.
   * @returns listReservations & tables
   */
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

  //Load tables
  useEffect(() => {
    const abortController = new AbortController();

    async function loadTables() {
      try {
        setTableError([]);
        const tableList = await listTables(abortController.signal);
        setTables(tableList);
      } catch (error) {
        setTables([]);
        setTableError([error.message]);
      }
    }
    loadTables();
    return () => abortController.abort();
  }, []);


  /**
   * @reservationlist fetches customers with dates of today, tomorrow, or previous date.
   * @tablesList fetches ....
   */
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

  const tablesList = tables.map((table) => (
    <Tables key={table.table_id} table={table} />
  ));
  /**
   * @previous date - needs to call a function instead of an object when inside the return ui
   */

  return (
    <main>
      <h1 className="text-center" style={{ marginTop: "15px" }}>
        Dashboard
      </h1>
     
      <div className="d-md-flex mb-3">
        <button
          className="btn btn-dark"
          style={{ padding: "7px 15px", marginRight: "10px" }}
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          Previous
        </button>
        <button
          className="btn btn-info"
          style={{ padding: "7px 15px", marginRight: "10px" }}
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          className="btn btn-dark"
          style={{ padding: "7px 15px", marginRight: "10px" }}
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next
        </button>
      </div>
      <h3>Reservations for: {date}</h3>
      <div>
        <div>{reservationList}</div>
      </div>
      <div>
        <h3 className="mt-4 text-center">Tables</h3>
        <div>{tablesList}</div>
      </div>
    </main>
  );
}

export default Dashboard;