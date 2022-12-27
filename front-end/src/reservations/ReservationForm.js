function ReservationForm({form, changeHandler, submitHandler, cancelHandler}) {
    return(
        <div>
            <h1>New Reservation</h1>
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label htmlFor="first_name">First Name:</label>
                    <input
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        type="text"
                        required="required"
                        placeholder="First Name"
                        onChange={changeHandler}
                        value={form.first_name}
                    />
                    <label htmlFor="last_name">Last Name:</label>
                    <input
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        type="text"
                        required="required"
                        placeholder="Last Name"
                        onChange={changeHandler}
                        value={form.last_name}
                    />
                    <label htmlFor="mobile_number">Phone Number:</label>
                    <input
                        className="form-control"
                        id="mobile_number"
                        name="mobile_number"
                        type="tel"
                        required="required"
                        placeholder="(---) --- ----"
                        onChange={changeHandler}
                        value={form.mobile_number}
                    />
                    <label htmlFor="reservation_date">Reservation Date:</label>
                    <input
                        className="form-control"
                        id="reservation_date"
                        name="reservation_date"
                        type="date"
                        onChange={changeHandler}
                        value={form.reservation_date}
                        required="required"
                    />
                    <label htmlFor="reservation_time">Reservation Time:</label>
                    <input
                        className="form-control"
                        id="reservation_time"
                        name="reservation_time"
                        type="time"
                        onChange={changeHandler}
                        value={form.reservation_time}
                        required="required"
                    />
                    <label htmlFor="people">Number of Guests:</label>
                    <input
                        className="form-control"
                        id="people"
                        name="people"
                        type="integer"
                        required="required"
                        placeholder="Number of Guests"
                        onChange={changeHandler}
                        value={form.people}
                    />
                </div>
                <div>
                <button className="btn btn-secondary" type="submit" >Submit</button>
                &nbsp;
                <button className="btn btn-secondary" type="button"  onClick={cancelHandler}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default ReservationForm;