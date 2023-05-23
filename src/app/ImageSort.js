import React, { useState } from 'react';
import '../css/imageSort.css'

//This component is responsible for selection of images sorting by values of "id" or "latest(date)"
const ImageSort = ({ handleSortChange }) => {
  const [sortOption, setSortOption] = useState('');// assigning variable with usestate hook for sorting
  // function for selection handling
  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    handleSortChange(value); // prop to pass value to main Category.js component
  };

  return (
    <div className="image-sort">
      <label htmlFor="sort">Sort By:</label>
      <select id="sort" value={sortOption} onChange={handleOptionChange}> 
        <option value="">None</option> 
        <option value="id">ID</option>
        <option value="latest">Latest</option>
      </select>
    </div>
  );
  
};


export default ImageSort;
