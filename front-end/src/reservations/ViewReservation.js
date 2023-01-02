import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { updateStatus } from "../utils/api";

function ViewReservation({ reservation }) {
  const [error, setError] = useState(null);

  //handle cancel
  const handleCancel = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const message =
      "Do you want to cancel this reservation? This cannot be undone";
    if (window.confirm(message)) {
      try {
        await updateStatus(
          reservation.reservation_id,
          "cancelled",
          abortController.signal
        );
        window.location.reload(true);
      } catch (error) {
        if (error.name === "AbborError") setError(error);
      }
    }
  };

  return (
    <div>
      <table className="table table-hover">
        <thead className="thead-light">
          <tr>
            <th scope="col">Full Name</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Guests</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Status</th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              {reservation.first_name} {reservation.last_name}
            </th>
            <th>{reservation.mobile_number}</th>
            <th>{reservation.people}</th>
            <th>{reservation.reservation_date}</th>
            <th>{reservation.reservation_time}</th>
            <th
              scope="row"
              data-reservation-id-status={reservation.reservation_id}
            >
              {reservation.status}
            </th>
            <th>
              <ErrorAlert error={error} />
              {reservation.status === "Booked" ? (
                <button className="btn btn-outline-dark">
                  <a href={`/reservations/${reservation.reservation_id}/seat`}>
                    Seat
                  </a>
                </button>
              ) : null}
            </th>
            <th>
              <button className="btn btn-outline-dark">
                <a href={`/reservations/${reservation.reservation_id}/edit`}>
                  Edit
                </a>
              </button>
            </th>
            <th>
              <button
                className="btn btn-outline-dark"
                data-reservation-id-cancel={reservation.reservation_id}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ViewReservation;
