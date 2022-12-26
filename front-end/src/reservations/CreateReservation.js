import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function CreateReservation({date}) {
    const initialForm = {
        first_name: "",
        last_name:"",
        mobile_number:"",
        reservation_date:date,
        reservation_time:"",
        people:"",
        status:"",
    }
    
    const [form,setForm] = useState({...initialForm})
    const [error, setError] = useState()
    const abortController = new AbortController();
    const history = useHistory();

    const changeHandler = (event) => {
        event.preventDefault();
        setForm({...form, [event.target.name]: event.target.value})
    };

    
    const submitHandler = async (event) => {
        event.preventDefault();
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
            setForm(initialForm)//clears data
            history.push(`/dashboard?date=${newRes.reservation_date}`)
        } catch (error) {
            if(error.name !== "AbortError") setError(error)
        }
        return () => {
            abortController.abort()
        }
    };

   
    const cancelHandler = (event) =>{
    event.preventDefault()
    history.go(-1)
    }

return (
    <div>
        <h1>Make a New Reservation</h1>
        <div>
        <ErrorAlert error={error} />
        <ReservationForm
            form={form}
            changeHandler={changeHandler}
            submitHandler={submitHandler}
            cancelHandler={cancelHandler}
        />
        </div>
    </div>
)
};

export default CreateReservation;