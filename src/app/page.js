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
  const [stockInfo, setStockInfo] = useState([]);
  
  const [filteredStocks, setFilteredStocks] = useState([]);


  useEffect(() => {
    const fetchNasdaqStocks = async () => {
      try {
        const response = await axios.get(
          "https://financialmodelingprep.com/api/v3/nasdaq_constituent",
          {
            params: { apikey: 'C1wB6SQf1n0ZQlUC8Oh8dWuPOrRAxutt' }, // Replace with your FMP API key - REQUIRED
          }
        );

        // Transform FMP's response data to match your format: [{ symbol: ..., companyName: ... }, ...]
        const formattedData = response.data.map((item) => ({
          symbol: item.symbol,
          companyName: item.name,
        }));


        setNasdaqData(formattedData);
        setFilteredStocks(formattedData);
      } catch (error) {
        console.error("Error fetching Nasdaq data:", error);
        alert("Failed to fetch Nasdaq data."); // Alert the user about the error
      }
    };

    fetchNasdaqStocks();
  }, []);



  const handleSearch = async (symbol) => {
    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: "TIME_SERIES_DAILY",
          symbol,
          apikey: "YOUR_API_KEY", // Replace with your Alpha Vantage API key
        },
      });
      setStockInfo(response.data);
      const timeSeries = response.data["Time Series (Daily)"];
      if (timeSeries) {
        const dates = Object.keys(timeSeries).reverse();
        const values = dates.map((date) =>
          parseFloat(timeSeries[date]["4. close"])
        );
        setChartData({ dates, values });
      } else {
        setChartData(null);
        alert("No data found for the entered symbol.");
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      alert("Failed to fetch stock data. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "4rem" , marginTop: "2rem" }}>ThndrX Nasdaq Stock Market App</h1>

      <StockSearchBar onSearch={handleSearch} nasdaqData={nasdaqData} /> {/* Pass nasdaqData as a prop */}
      <StockChart data={chartData} stockInfo={stockInfo}/>
    </div>
  );
}
