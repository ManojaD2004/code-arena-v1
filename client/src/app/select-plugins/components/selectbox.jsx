"use client";
import React, { useEffect, useState } from "react";
 // Assuming items is an array of objects with { name, category } keys
import "./style.css";

export default function MultiFilters() {
  const [filteredItems, setFilteredItems] = useState(["PLease Select an option"]);
  const [dark,setdark]=useState(false)
  const filters = ["pslist", "psscan", "pstree", "psxview","handles","dlllist","imageinfo","kdbgscan" ];

  const handleFilterButtonClick = (selectedCategory) => {
    setFilteredItems(selectedCategory)
   
  };

  useEffect(()=>{
    
  },[])
  return (
    <div>
      <div className="buttons-container">
        {filters.map((category) => (
          <button
            onClick={() => handleFilterButtonClick(category)}
            className={`button ${setdark?"":"active"}`}
            key={`filters-${category}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="items-container">
        
          <div key={`${filteredItems}`} className="item bg-black text-white">
            <p>{filteredItems}</p>
            
          </div>
        
      </div>
    </div>
  );
}
