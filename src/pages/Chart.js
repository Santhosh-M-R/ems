import React from "react";
import { Audio } from "react-loader-spinner";
function Chart(props) {
  return (
    <>
      <div style={{ marginTop: "150px" }}>
        <h1>Will be publishing charts data soon</h1>
      </div>
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
    </>
  );
}

export default Chart;
