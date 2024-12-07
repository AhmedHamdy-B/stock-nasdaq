"use client"; // Add this line at the top
import { useState, useEffect } from 'react';
import StockSearchBar from './components/StockSearchBar';
import axios from 'axios';
import dynamic from 'next/dynamic';
import React from 'react';
import '../app/styles/globals.scss'; // Import global CSS
const StockChart = dynamic(() => import('./components/StockChart'), {
  ssr: false,
});

interface NasdaqDataItem {
  symbol: string;
  companyName: string;
}

interface TimeSeriesData {
  [date: string]: {
    '4. close': string;
  };
}

interface AlphaVantageResponse {
  'Meta Data': {
    '2. Symbol': string;
  };
  'Time Series (Daily)': TimeSeriesData | undefined; 
}

const StockPage = () => {
  const [chartData, setChartData] = useState<null | { dates: string[]; values: number[] }>(null);
  const [nasdaqData, setNasdaqData] = useState<NasdaqDataItem[]>([]);
  const [stockInfo, setStockInfo] = useState<AlphaVantageResponse | null>(null);


  useEffect(() => {
    const fetchNasdaqStocks = async () => {
      try {
        const response = await axios.get(
          "https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=C1wB6SQf1n0ZQlUC8Oh8dWuPOrRAxutt" 
        );
        const formattedData: NasdaqDataItem[] = response.data.map((item: any) => ({
          symbol: item.symbol,
          companyName: item.name,
        }));
        setNasdaqData(formattedData);
      } catch (error) {
        console.error("Error fetching Nasdaq data:", error);
        alert("Failed to fetch Nasdaq data.");
      }
    };

    fetchNasdaqStocks();
  }, []);

  const handleSearch = async (symbol: string) => {
    try {
      const response = await axios.get<AlphaVantageResponse>(`https://www.alphavantage.co/query`, {
        params: {
          function: "TIME_SERIES_DAILY",
          symbol,
          apikey: "YOUR_API_KEY", // Replace with your Alpha Vantage API key
        },
      });


      setStockInfo(response.data);
      const timeSeries = response.data['Time Series (Daily)'];


      if (timeSeries) {
        const dates = Object.keys(timeSeries).reverse();
        const values = dates.map((date) => parseFloat(timeSeries[date]['4. close']));
        setChartData({ dates, values });
      } else {
        setChartData(null);
        alert("No data found for the entered symbol.");
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      alert("Failed to fetch stock data. Please try again.");
      setChartData(null);
    }
  };

  return (
    <div className="container"> {/* Use container */}
    <h1 className="title">ThndrX Nasdaq Stock Market App</h1>{/* Use title */}
      <StockSearchBar onSearch={handleSearch} nasdaqData={nasdaqData} />
      <StockChart data={chartData} stockInfo={stockInfo} />
    </div>
  );
};


export default StockPage;

