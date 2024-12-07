"use client";

import React, { useState, useEffect } from "react";

interface NasdaqDataItem {
  symbol: string;
  companyName: string;
}

interface StockSearchBarProps {
  onSearch: (symbol: string) => void;
  nasdaqData: NasdaqDataItem[];
}

const StockSearchBar: React.FC<StockSearchBarProps> = ({
  onSearch,
  nasdaqData,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStocks, setFilteredStocks] = useState<NasdaqDataItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const stocksPerPage = 20;

  useEffect(() => {
    const filtered = nasdaqData.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStocks(filtered);
    setCurrentPage(1); // Reset to first page when search term changes
  }, [searchTerm, nasdaqData]);

  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = filteredStocks.slice(
    indexOfFirstStock,
    indexOfLastStock
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleButtonClick = (symbol: string) => {
    onSearch(symbol);
  };

  return (
    <div className="search-bar">
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-bar"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <div>
        {currentStocks.map((stock) => (
          <button
            key={stock.symbol}
            onClick={() => handleButtonClick(stock.symbol)}
            className="stock-buttons"
          >
            {stock.symbol}
          </button>
        ))}
      </div>
      <div className="pagination-container">
        {Array.from({
          length: Math.ceil(filteredStocks.length / stocksPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            style={{
              backgroundColor: currentPage === index + 1 ? "#0070f3" : "#fff",
              color: currentPage === index + 1 ? "#fff" : "#0070f3",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockSearchBar;
