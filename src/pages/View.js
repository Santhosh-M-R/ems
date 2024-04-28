import React, { useState, useEffect } from "react";

import { getDatabase, ref, child, get } from "firebase/database";
import { database } from "../firebase-config";

import { useParams, Link } from "react-router-dom";

import "./View.css";
import { Audio } from "react-loader-spinner";

function View(props) {
  const [user, setUser] = useState({});
  const { id } = useParams();
  const [loading, setIsloading] = useState(true);

  useEffect(() => {
    const dbRef = ref(database);

    get(child(dbRef, `expensedata/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("viewdata snapshot", snapshot.val());
          setUser({ ...snapshot.val() });
        } else {
          console.log("No data available");
          setUser({});
        }
        setIsloading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsloading(false);
      });
    return () => {
      setUser({});
    };
  }, [id]);

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
    <div>
      <div style={{ marginTop: "150px" }}>
        <div className="card">
          <div className="card-header">
            <p>Expense Detail</p>
          </div>
          <div className="container">
            <strong>ID:</strong>
            <span>{id}</span>
            <br />
            <br />
            <strong>Expense Name:</strong>
            <span>{user.name}</span>
            <br />
            <br />
            <strong>Amount:</strong>
            <span>{user.amount}</span>
            <br />
            <br />
            <strong>Reason:</strong>
            <span>{user.reason}</span>
            <br />
            <br />
            <Link to="/">
              <button className="btn btn-edit">Go Back</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default View;
