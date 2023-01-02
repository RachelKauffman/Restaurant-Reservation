import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function CreateReservation() {
  const initialForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "",
  };

  const [form, setForm] = useState({ ...initialForm });
  const [error, setError] = useState(false);
  const abortController = new AbortController();
  const history = useHistory();

  // format date
  const formatDate = (date) => {
    let formatedDate = date.split("");
    formatedDate.splice(10);
    formatedDate = formatedDate.join("");
    return formatedDate;
  };

  // format time
  const formatTime = (time) => {
    let formatedTime = time.split("");
    formatedTime.splice(5);
    formatedTime = formatedTime.join("");
    return formatedTime;
  };


  const changeHandler = ({ target }) => {
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
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError(false);
    let newRes = {
      first_name: form.first_name,
      last_name: form.last_name,
      mobile_number: form.mobile_number,
      reservation_date: form.reservation_date,
      reservation_time: form.reservation_time,
      people: Number(form.people),
      status: "booked",
    };
    try {
      await createReservation(newRes, abortController.signal);
      setForm(initialForm); //clears data
      history.push(`/dashboard?date=${newRes.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") setError(error);
    }
    return () => {
      abortController.abort();
    };
  };


  return (
    <div>
     <h1 className="center-text">New Reservation</h1>
      <ErrorAlert error={error} />
      <ReservationForm
        form={form}
        changeHandler={changeHandler}
        submitHandler={submitHandler}
      />
    </div>
  );
}

export default CreateReservation; 
