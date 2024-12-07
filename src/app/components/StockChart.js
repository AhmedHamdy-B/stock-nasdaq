"use client";

import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

const StockChart = ({ data, stockInfo }) => {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    if (!data || !data.dates || !data.values) return;

    const chartInstance = echarts.init(chartRef.current);

    const options = {
      title: {
        title: {
          text: `${
            chartType === "line"
              ? `${stockInfo?.symbol} Line`
              : `${stockInfo?.symbol} Bar`
          } Chart`, // Use correct key: symbol
        },

        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data.dates,
        axisLabel: { rotate: 45 },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value) => `$ ${value}`, // Add the dollar sign here
        },
      },
      series: [
        {
          data: data.values,
          type: chartType,
          smooth: chartType === "line",
          areaStyle: chartType === "line" ? {} : null,
        },
      ],
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          // Use the formatter function
          return `Value: <strong>$${params[0].value}</strong> <br/> Date: <strong>${params[0].axisValue}</strong>`; // Format with dollar sign
        },
      },
    };

    chartInstance.setOption(options);

    return () => {
      chartInstance.dispose();
    };
  }, [data, stockInfo, chartType]);

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  return (
    <div>
      {stockInfo && ( // Conditionally render stock info
        <div
          style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>Symbol :</strong>{" "}
            <strong
              style={{
                color: "#0070f3",
                marginLeft: ".3rem",
              }}
            >
              {stockInfo?.symbol} {/* Access symbol directly */}
            </strong>
          </p>
          <p>
            <strong>Last Refreshed :</strong>{" "}
            <strong
              style={{
                color: "#0070f3",
                marginLeft: ".3rem",
              }}
            >
              {/* {stockInfo?.["Meta Data"]?.["3. Last Refreshed"]} */}
            </strong>
          </p>
          <p>
            <strong> Last Trade Price: </strong>{" "}
            <strong
              style={{
                color: "#0070f3",
                marginLeft: ".3rem",
              }}
            >
              {stockInfo?.lastTradePrice}
            </strong>
          </p>
        </div>
      )}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => handleChartTypeChange("line")}>Line</button>
        <button onClick={() => handleChartTypeChange("bar")}>Bar</button>
      </div>

      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: "400px",
          margin: "0 auto",
          border: "1px solid #ddd",
        }}
      >
        {!data && (
          <p style={{ textAlign: "center", paddingTop: "50px" }}>
            No data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default StockChart;
