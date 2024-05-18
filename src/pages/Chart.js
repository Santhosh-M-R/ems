import React, { useState, useEffect } from "react";
import { ref, child, get } from "firebase/database";
import { Audio } from "react-loader-spinner";
import { database } from "../firebase-config";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import "./Chart.css";

function Chart(props) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "expensedata"));
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          console.log("No data available");
          setData({});
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log("selectedMonth", selectedMonth);
  const processData = () => {
    const filteredData = selectedMonth
      ? Object.values(data).filter((entry) => {
          const date = new Date(entry.date);
          return date.getMonth() + 1 === selectedMonth;
        })
      : Object.values(data);

    const categoryAmounts = {};
    for (const entry of filteredData) {
      const { category, amount } = entry;
      if (categoryAmounts[category]) {
        categoryAmounts[category] += parseFloat(amount);
      } else {
        categoryAmounts[category] = parseFloat(amount);
      }
    }

    // Convert data to array format expected by Recharts Pie component
    return Object.entries(categoryAmounts).map(([category, amount]) => ({
      category,
      amount,
    }));
  };

  const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#66FF99",
    "#FF9900",
    "#99FF99",
    "#9966FF",
    "#66FFFF",
  ];

  const totalValue = processData().reduce((acc, curr) => acc + curr.amount, 0);
  console.log("totalValue", totalValue);

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
          <Audio height={100} width={100} radius={9} color="green" />
        </div>
      )}

      {!loading && data && (
        <div>
          <h2>Total Expenses by Category</h2>
          <div className="select-month">
            <label htmlFor="monthSelect">Select Month: </label>
            <select
              id="monthSelect"
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              value={selectedMonth || ""}
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(2000, i).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>
          {processData().length > 0 ? (
            <>
              <p>
                {months[selectedMonth - 1]} Total: {totalValue} rs
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={processData()}
                    dataKey="amount"
                    nameKey="category"
                    outerRadius={120}
                    label
                  >
                    {processData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </>
          ) : (
            <p>No data</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Chart;
