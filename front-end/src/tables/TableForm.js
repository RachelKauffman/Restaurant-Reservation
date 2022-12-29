import React, {useState} from "react"
import { createTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";


function TableForm () {
    
    const initialForm = {
        table_name: "",
        capacity: 0,
      };
    
      // useStates
      const [form, setForm] = useState({ ...initialForm });
      const [error, setError] = useState(false);
    
      // imports
      const abortController = new AbortController();
      const history = useHistory();
    
      // handle change
      function changeHandler({ target }) {
        setForm({
          ...form,
          [target.name]: target.value,
        });
      }
    
      // handle Submit
      async function submitHandler(event) {
        event.preventDefault();
        setError(false);
        const newTable = {
          table_name: form.table_name,
          capacity: Number(form.capacity),
        };
        setError(false);
        try {
          await createTable(newTable, abortController.signal);
          setForm(initialForm);
          history.push("/dashboard");
        } catch (error) {
          if (error.name !== "AbortError") setError(error);
        }
        return () => {
          abortController.abort();
        };
      }
      return (
        <main>
        
            <ErrorAlert className="alert alert-danger" error={error} />
            <div style={{ justifyContent: "center", textAlign: "center" }}>
              <h1>
                Create a New Table
              </h1>
              <form onSubmit={submitHandler}>
                <label htmlFor="table_name">
                  <h5>Table Name:</h5>
    
                  <input
                    id="table_name"
                    type="text"
                    name="table_name"
                    onChange={changeHandler}
                    value={form.table_name}
                    placeholder="Table Name"
                    min={2}
                    style={{ width: "50%", margin: "8px", textAlign: "center" }}
                  />
                </label>
                <label htmlFor="capacity">
                  <h5>Table Capacity:</h5>
                  <input
                    id="capacity"
                    type="number"
                    name="capacity"
                    onChange={changeHandler}
                    value={form.capacity}
                    style={{ width: "45%", margin: "8px", textAlign: "center" }}
                  />
                </label>
                <div>
                  <button
                    style={{ paddingLeft: "25px", paddingRight: "25px" }}
                    className="btn btn-secondary shadow"
                    type="submit"
                  >
                    Submit
                  </button>
                  &nbsp;
                  <button
                    style={{ paddingLeft: "25px", paddingRight: "25px" }}
                    className="btn btn-dark shadow "
                    type="button"
                    onClick={() => history.goBack()}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
        </main>
      );
    };
    
    export default TableForm;