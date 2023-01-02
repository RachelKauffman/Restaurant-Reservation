import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

const EditReservation = ({ date, setDate }) => {

  const initialForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: "",
    reservation_date: "",
    reservation_time: "",
    status: "",
  };

  const [form, setForm] = useState({ ...initialForm });
  const [error, setError] = useState(false);

  const abortController = new AbortController();
  const history = useHistory();
  const { reservation_id } = useParams();
  const id = parseInt(reservation_id);


  useEffect(() => {
    const abortController = new AbortController();
    const initialReservation = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        people: "",
        reservation_date: "",
        reservation_time: "",
        status: "",
      };
    async function getReservation() {
      try {
        const resData = await readReservation(id, abortController.signal);
        initialReservation.reservation_id = parseInt(resData.reservation_id);
        initialReservation.first_name = resData.first_name;
        initialReservation.last_name = resData.last_name;
        initialReservation.mobile_number = resData.mobile_number;
        initialReservation.reservation_date = formatDate(resData.reservation_date);
        initialReservation.reservation_time = formatTime(resData.reservation_time);
        initialReservation.people = parseInt(resData.people);
        setForm({ ...initialReservation });
      } catch (error) {
        if (error.name !== "AbortError") setError(error);
      }
    }
    getReservation();

    return () => abortController.abort();
  }, [id]);

  function formatDate(date) {
    let formatedDate = date.split("");
    formatedDate.splice(10);
    formatedDate = formatedDate.join("");
    return formatedDate;
  }

  function formatTime(time) {
    let formatedTime = time.split("");
    formatedTime.splice(5);
    formatedTime = formatedTime.join("");
    return formatedTime;
  }

  function changeHandler({ target }) {
    const { name, value } = target;
    switch (name) {
      case "people":
        setForm({ ...form, [name]: parseInt(value) });
        break;
      case "reservation_date":
        setForm({ ...form, [name]: formatDate(value) });
        break;
      case "reservation_time":
        setForm({ ...form, [name]: formatTime(value) });
        break;
      default:
        setForm({ ...form, [name]: value });
        break;
    }
  }

  async function submitHandler(event) {
    event.preventDefault();
    setError(false);
    const updatedReser = {
      reservation_id: id,
      first_name: form.first_name,
      last_name: form.last_name,
      mobile_number: form.mobile_number,
      reservation_date: form.reservation_date,
      reservation_time: form.reservation_time,
      people: Number(form.people),
      status: "booked",
    };
    try {
      await updateReservation(updatedReser, abortController.signal);
      history.push(`/dashboard?date=${updatedReser.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") setError(error);
    }

    return () => {
      abortController.abort();
    };
  }

  return (
    <div>
        <h1 className="center-text">Edit Reservation</h1>
      <h1 style={{ color: "white", textAlign: "center" }}>
        Make a New Reservation
      </h1>
      <div
        className="d-md-flex mb-3"
        style={{ textAlign: "center", justifyContent: "center" }}
      >
        <ErrorAlert error={error} />
        <ReservationForm
          form={form}
          changeHandler={changeHandler}
          submitHandler={submitHandler}
        />
      </div>
    </div>
  );
};

export default EditReservation;