function ReservationForm({changeHandler,submitHandler,cancelHandler,form}) {
    return(
        <div>
            <h1>New Reservation</h1>
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label htmlFor="first_name">First Name:</label>
                    <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        required
                        placeholder="First Name"
                        onChange={changeHandler}
                        value={form.first_name}
                    />
                    <label htmlFor="last_name">Last Name:</label>
                    <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        required
                        placeholder="Last Name"
                        onChange={changeHandler}
                        value={form.last_name}
                    />
                    <label htmlFor="mobile_number">Phone Number:</label>
                    <input
                        id="mobile_number"
                        name="mobile_number"
                        type="tel"
                        required
                        placeholder="(---) --- ----"
                        onChange={changeHandler}
                        value={form.mobile_number}
                    />
                    <label htmlFor="reservation_date">Reservation Date:</label>
                    <input
                        id="reservation_date"
                        name="reservation_date"
                        type="date"
                        required
                        placeholder="Reservation Date"
                        onChange={changeHandler}
                        value={form.reservation_date}
                    />
                    <label htmlFor="reservation_time">Reservation Time:</label>
                    <input
                        id="reservation_time"
                        name="reservation_time"
                        type="time"
                        required
                        placeholder="Reservation Time"
                        onChange={changeHandler}
                        value={form.reservation_time}
                    />
                    <label htmlFor="people">Number of Guests:</label>
                    <input
                        id="people"
                        name="people"
                        type="integer"
                        required
                        placeholder="Number of Guests"
                        onChange={changeHandler}
                        value={form.people}
                    />
                </div>
                <div>
                <button type="submit" className="btn btn-secondary" onClick={submitHandler}>Submit</button>
                <button type="button" className="btn btn-secondary" onClick={cancelHandler}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default ReservationForm;