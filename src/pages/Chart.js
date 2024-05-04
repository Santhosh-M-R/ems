import React, { useState, useEffect, useRef } from "react";
import { ref, child, get } from "firebase/database";
import { Audio } from "react-loader-spinner";
import { database } from "../firebase-config";
// import { Bar } from "react-chartjs-2";
function Chart(props) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    const dbRef = ref(database);

    get(child(dbRef, `expensedata`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
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
  }, []);
  const groupedData = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const entry = data[key];
      const date = new Date(entry.date);
      const month = date.toLocaleString("default", { month: "long" });

      if (!groupedData[month]) {
        groupedData[month] = [];
      }

      groupedData[month].push(parseFloat(entry.amount)); // Convert amount to float
    }
  }
  const totalByMonth = {};

  for (const month in groupedData) {
    if (groupedData.hasOwnProperty(month)) {
      const total = groupedData[month].reduce((acc, curr) => acc + curr, 0);
      totalByMonth[month] = total;
    }
  }

  // return (
  //   <>
  //     <div style={{ marginTop: "150px" }}>
  //       <h1>Will be publishing charts data soon</h1>
  //     </div>
  //     <div
  //       style={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <Audio
  //         height="100"
  //         width="100"
  //         radius="9"
  //         color="green"
  //         ariaLabel="loading"
  //         wrapperStyle
  //         wrapperClass
  //       />
  //     </div>
  //   </>
  // );
  return (
    <div>
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Audio height="100" width="100" radius="9" color="green" />
        </div>
      )}
      <div>
        {Object.entries(totalByMonth).map(([month, value]) => (
          <React.Fragment key={month}>
            <p>
              {month}: {value}
            </p>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Chart;
