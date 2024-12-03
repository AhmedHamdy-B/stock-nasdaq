// StockSearchBar.js
"use client";

import React, { useState, useEffect } from "react";

const StockSearchBar = ({ onSearch, nasdaqData }) => {
  // Add nasdaqData prop
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const stocksPerPage = 20;

  useEffect(() => {
    if (nasdaqData) {
      const filtered = nasdaqData.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStocks(filtered);
      setCurrentPage(1); // Reset to first page when search term changes
    }
  }, [searchTerm, nasdaqData]);


  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = filteredStocks.slice(
    indexOfFirstStock,
    indexOfLastStock
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleButtonClick = (symbol) => {
    onSearch(symbol);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        {" "}
        {/* Container for input and button */}
        <input
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            flex: 1,
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* Filtered Stock Buttons and Pagination */}
      <div>
        {currentStocks.map((stock) => (
          <button
            key={stock.symbol}
            onClick={() => handleButtonClick(stock.symbol)}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              marginRight: ".7rem",
              marginBottom: ".7rem",
              backgroundColor: "#f0f0f0",
              color: "#333",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              whiteSpace: "nowrap", 
            }}
          >
            {" "}
            {stock.symbol}
          </button>
        ))}
      </div>
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        {Array.from({
          length: Math.ceil(filteredStocks.length / stocksPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            style={{
              margin: "0 5px",
              padding: "8px 12px",
              fontSize: "14px",
              backgroundColor: currentPage === index + 1 ? "#0070f3" : "#fff",
              color: currentPage === index + 1 ? "#fff" : "#0070f3",
              border: "1px solid #0070f3",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {" "}
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockSearchBar;
