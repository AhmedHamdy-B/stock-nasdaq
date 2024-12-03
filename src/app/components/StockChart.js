// StockChart.js (updated)
"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const StockChart = ({ data, stockInfo }) => {
  // Add stockInfo prop
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || !data.dates || !data.values) return;

    const chartInstance = echarts.init(chartRef.current);

    const options = {
      title: {
        text: "Stock Price Chart",
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
          formatter: "$ {value}",
        },
      },
      series: [
        {
          data: data.values,
          type: "line",
          smooth: true,
          areaStyle: {},
        },
      ],
    };

    chartInstance.setOption(options);

    return () => {
      chartInstance.dispose();
    };
  }, [data]);

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
                marginLeft:'.3rem'
              }}
            >
              {stockInfo?.["Meta Data"]?.["2. Symbol"]}
            </strong>
          </p>
          <p>
            <strong>Last Refreshed :</strong>{" "}
            <strong
              style={{
                color: "#0070f3",
                marginLeft:'.3rem'
              }}
            >
              {stockInfo?.["Meta Data"]?.["3. Last Refreshed"]}
            </strong>
          </p>
          <p>
            <strong>Time Zone :</strong>{" "}
            <strong
              style={{
                color: "#0070f3",
                marginLeft:'.3rem'
              }}
            >
              {stockInfo?.["Meta Data"]?.["5. Time Zone"]}
            </strong>
          </p>
        </div>
      )}

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
