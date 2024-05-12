import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import {  ref, child, get, remove } from "firebase/database";
import { database } from "../firebase-config";
import { toast } from "react-toastify";
import { Audio } from "react-loader-spinner";

function Home(props) {
  const [data, setData] = useState({});
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortedIntegers, setSortedIntegers] = useState([]);

  useEffect(() => {
    const dbRef = ref(database);

    get(child(dbRef, `expensedata`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const integers = Object.keys(snapshot.val()).map((str) =>
            parseInt(str, 10)
          );
          const sortedIntegers = integers.sort((a, b) => b - a);
          setSortedIntegers(sortedIntegers);
          setData(snapshot.val());
          console.log("value",snapshot.val())
          console.log("sorted one",sortedIntegers)
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
  }, [count]);

  const onDelete = (id) => {
    const dbRef = ref(database);
    if (
      window.confirm("Are you sure that you wanted to delete that expense?")
    ) {
      remove(child(dbRef, `/expensedata/${id}`));

      const filteredNumbers = sortedIntegers.filter((number) => number !== id);
      setSortedIntegers(filteredNumbers);

      toast.success("Expense data removed successfully");
      setCount(1);
    }
  };

  const formatDate = (dateString) => {
    const parts = dateString.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  return (
    <div style={{ marginTop: "100px" }}>
      {loading ? (
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
      ) : (
        <React.Fragment>
          {/* Normal view - Table */}
          <table className="styled-table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>No.</th>
                <th style={{ textAlign: "center" }}>Date</th>
                <th style={{ textAlign: "center" }}>Expense Name</th>
                <th style={{ textAlign: "center" }}>Expense Category</th>
                <th style={{ textAlign: "center" }}>Amount</th>
                <th style={{ textAlign: "center" }}>Reason</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedIntegers?.map((value, index) => {
                const sample_data = data[value];

                return (
                  <tr key={value}>
                    <th scope="row">{index + 1}</th>

                    <td>
                      {sample_data && sample_data.date
                        ? formatDate(sample_data.date)
                        : ""}
                    </td>

                    <td>{sample_data?.name}</td>
                    <td>{sample_data?.category}</td>
                    <td>{sample_data?.amount}</td>
                    <td>{sample_data?.reason || "none"} </td>
                    <td>
                      <Link to={`/ems/update/${value}`}>
                        <button className="btn btn-edit">Edit</button>
                      </Link>
                      <button
                        className="btn btn-delete"
                        onClick={() => {
                          onDelete(value);
                        }}
                      >
                        Delete
                      </button>
                      <Link to={`/ems/view/${value}`}>
                        <button className="btn btn-view">View</button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile view - List */}
          <div className="mobile-list">
            {sortedIntegers?.map((value, index) => {
              const sample_data = data[value];

              return (
                <div
                  key={value}
                  style={{
                    marginBottom: "20px",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "10px",
                  }}
                >
                  <p>
                    <strong>No.:</strong> {index + 1}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {sample_data && sample_data.date
                      ? formatDate(sample_data.date)
                      : ""}
                  </p>
                  <p>
                    <strong>Expense Name:</strong> {sample_data?.name}
                  </p>
                  <p>
                    <strong>Expense Category:</strong> {sample_data?.category}
                  </p>
                  <p>
                    <strong>Amount:</strong> {sample_data?.amount}
                  </p>
                  <p>
                    <strong>Reason:</strong> {sample_data?.reason || "none"}
                  </p>
                  <div style={{ textAlign: "center" }}>
                    <Link to={`/ems/update/${value}`}>
                      <button
                        style={{ marginRight: "10px" }}
                        className="btn btn-edit"
                      >
                        Edit
                      </button>
                    </Link>
                    <button
                      className="btn btn-delete"
                      onClick={() => onDelete(value)}
                    >
                      Delete
                    </button>
                    <Link to={`/ems/view/${value}`}>
                      <button
                        style={{ marginLeft: "10px" }}
                        className="btn btn-view"
                      >
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Home;
