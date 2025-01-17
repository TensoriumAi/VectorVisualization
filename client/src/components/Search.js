import React, { useState } from 'react';

const Search = ({ data, onSearchResult }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const result = data.find((point, index) => 
      point[0].toString().includes(searchTerm) || 
      point[1].toString().includes(searchTerm) ||
      index.toString() === searchTerm
    );
    onSearchResult(result);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by coordinate or index"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default Search;