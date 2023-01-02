import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import CreateReservation from "../reservations/CreateReservation";
import Seat from "../tables/seat";
import EditReservation from "../reservations/EditReservation";
import TableForm from "../tables/TableForm";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import Search from "../search/search";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [date, setDate] = useState(today());
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations/new">
        <CreateReservation/>
      </Route>

      <Route path="/reservations/:reservation_id/edit">
        <EditReservation date={date} setDate={setDate} />
      </Route>

      <Route path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>

      <Route path="/tables/new">
        <TableForm />
      </Route>

      <Route exact={true} path="/search">
        <Search />
      </Route>

      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/dashboard">
        <Dashboard date={date} setDate={setDate} />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;