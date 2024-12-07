// page.js
"use client";

import { useState, useEffect } from "react";
import StockSearchBar from "./components/StockSearchBar";
import axios from "axios";
import dynamic from "next/dynamic";
const StockChart = dynamic(() => import("./components/StockChart"), {
  ssr: false,
});

export default function StockPage() {
  const [chartData, setChartData] = useState(null);
  const [nasdaqData, setNasdaqData] = useState([]);

  useEffect(() => {
    const fetchNasdaqStocks = async () => {
      try {
        const response = await axios.get(
          "https://api.polygon.io/v3/reference/tickers/types?market=stocks&exchange=NASDAQ&active=true&apiKey=xGelxFiUdtyp5btD_AxmljEY5eQobytq"
        );
        if (response.data.results) {
          response.data.results.forEach((element) => {
            console.log(element);
          });
          const formattedData = response.data.results.map((item) => ({
            symbol: item.code, // Correct field: ticker
            companyName: item.description,
          }));
          setNasdaqData(formattedData);
        } else {
          console.error("No Nasdaq results found:", response.data);
          alert("Failed to fetch Nasdaq data.");
        }
      } catch (error) {
        console.error("Error fetching Nasdaq data:", error);
        alert("Failed to fetch Nasdaq data.");
      }
    };

    fetchNasdaqStocks();
  }, []);

  const handleSearch = async (symbol) => {
    try {
      const aggregatesResponse = await axios.get(
        `https://api.polygon.io/v1/open-close/${symbol}/2024-07-26?apiKey=xGelxFiUdtyp5btD_AxmljEY5eQobytq`
      );

      // const lastTradeResponse = await axios.get(
      //   `https://api.polygon.io/v2/last/trade/${symbol}`,
      //   {
      //     params: {
      //       apiKey: "xGelxFiUdtyp5btD_AxmljEY5eQobytq",
      //     },
      //   }
      // );

      if (aggregatesResponse.data.resultsCount > 0) {
        const results = aggregatesResponse.data.results;
        const dates = results.map((result) =>
          new Date(result.t).toLocaleDateString()
        );
        const values = results.map((result) => result.c);

        // const lastTradePrice = lastTradeResponse.data.results.p;

        setChartData({ dates, values });
        // setStockInfo({
        //   symbol: symbol, // Include symbol directly
        //   lastTradePrice,
        // });
      } else {
        setChartData(null);

        alert("No data found for the entered symbol.");
      }
    } catch (error) {

      console.error("Error fetching stock data:", error);
      alert("Failed to fetch stock data. Please try again.");
      setChartData(null); // Clear chart data on error
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          marginTop: ".5rem",
        }}
      >
        ThndrX Nasdaq Stock Market App
      </h1>

      <StockSearchBar onSearch={handleSearch} nasdaqData={nasdaqData} />
      <StockChart data={chartData} />
    </div>
  );
}
