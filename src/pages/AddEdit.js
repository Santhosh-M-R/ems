import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./AddEdit.css";

import { toast } from "react-toastify";

import { ref, set, get, child } from "firebase/database";

import { database } from "../firebase-config";
import { Audio } from "react-loader-spinner";

function AddEdit(props) {
  const initialState = {
    id: "",
    name: "",
    amount: "",
    reason: "",
  };
  const [state, setState] = useState(initialState);
  const [data, setData] = useState({});
  const { name, amount, reason, date } = state;

  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const { id } = useParams();

  useEffect(() => {
    const dbRef = ref(database);

    get(child(dbRef, `expensedata`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("addEdit snapshot", snapshot.val());
          setData({ ...snapshot.val() });
        } else {
          console.log("No data available");
          setData({});
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    return () => {
      setData({});
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      setState({ ...data[id] });
    } else {
      setState({ ...initialState });
    }
    return () => {
      setState({ ...initialState });
    };
  }, [id, data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || !reason || !date) {
      toast.error("Please fill the required fields");
    } else {
      if (!id) {
        // const tid = Math.floor(Math.random() * 1000) + 1;
        // adding tid as epoch time for sorting data
        const tid = Math.floor(new Date().getTime() / 1000);
        set(ref(database, "expensedata/" + tid), {
          id: tid,
          name: name,
          amount: amount,
          date: date,
          reason: reason,
          epoch: tid,
        }).catch((err) => {
          toast.error(err);
        });
        toast.success("Expense added successfully!");
      } else {
        const tid = id;
        set(ref(database, "expensedata/" + tid), {
          ...state,
          epoch: Math.floor(new Date().getTime() / 1000)
        }).catch((err) => {
          toast.error(err);
        });
        toast.success("Expense Updated successfully!");
      }

      setTimeout(() => history.push("/ems/"), 500);
    }
  };

  const handleInputChange = (event) => {
    console.log("event", event);
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };
  console.log("state", state);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Audio
          height="100"
          width="100"
          radius="9"
          color="green"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
        />
      </div>
    );
  }

  return (
    <div style={{ marginTop: "100px" }}>
      <form
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        onSubmit={handleSubmit}
      >
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          placeholder="select the date"
          value={date || ""}
          onChange={handleInputChange}
        />
        <label htmlFor="name">Expense Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter the expense name"
          value={name || ""}
          onChange={handleInputChange}
        />
        <label htmlFor="amount">Enter the amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          placeholder="Enter the amount"
          value={amount || ""}
          onChange={handleInputChange}
        />
        <label htmlFor="reason">Reason</label>
        <input
          type="text"
          id="reason"
          name="reason"
          placeholder="Any reason"
          value={reason || ""}
          onChange={handleInputChange}
        />
        <input type="submit" value={id ? "Update" : "Save"} />
      </form>
    </div>
  );
}

export default AddEdit;
