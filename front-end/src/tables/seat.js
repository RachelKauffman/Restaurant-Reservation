import React, {useEffect, useState} from "react";
import {useParams, useHistory } from "react-router-dom";
import {listTables, readReservation, seatReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Seat() {
    const initialForm = {table_id: ""};
    const abortController = new AbortController();
    const [reservation, setReservation] = useState({people: 0});
    const [error, setError] = useState(null);
    const [tables, setTables] = useState([]);
    const [form, setForm] = useState(initialForm);
    const {reservation_id} = useParams();
    const history = useHistory();

    //fetches reservation and table info from api
    useEffect(() => {
        const initial = {table_id: ""};
        setForm(initial);
        const abortController = new AbortController();
        async function fetchReservation() {
            try{
                const getData = await readReservation(reservation_id, abortController.signal);
                setReservation(getData)//stores new data from api
            } catch (error) {
                if (error.name !== "AbortError") setError(error);
            }
        }
        async function fetchTables() {
            try {
                const getData = await listTables(abortController.signal);
                setTables(getData);
            } catch (error) {
                if(error.name !== "AbortError") setError(error)
            }
        }
        fetchReservation();
        fetchTables();
        return () => {
            abortController.abort()
        }
    }, [reservation_id]);

    function changeHandler ({target}) {
        setForm({
            ...form,
            [target.name]: target.value
        });
    }

    async function submitHandler(event) {
        event.preventDefault();
        const table_id = Number(form.table_id)
        const reservation = parseInt(reservation_id);
        setError(null);
        setForm(initialForm);
        try {
            await seatReservation(reservation, table_id, abortController.signal);
            history.push("/dashboard")
        } catch (error) {
            if(error.name !== "AbortError") setError(error)
        }
        return () => abortController.abort();
    }

    const tableOptions = tables.map((table) => {
        const disabled = Number(table.capacity) < Number(reservation.people);
        return (
            <option key={table.table_id} value={table.table_id} disabled={disabled}>
                {table.table_name} - {table.capacity}
            </option>
        );
    });

    return (
        <main>
            <div className="container">
                <ErrorAlert error={error} />
                <div>
                    <form onSubmit={submitHandler}>
                        <label htmlFor="table_id">
                            <h4>Seat Table:</h4>
                            <select name="table_id" onChange={changeHandler}>
                                <option>Select Table</option>
                                {tableOptions}
                            </select>
                        </label>
                        <button className="btn btn-secondary" type="submit">
                            Submit
                        </button>
                        <button className="btn btn-secondary" onClick={() => history.goBack()}>
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Seat;