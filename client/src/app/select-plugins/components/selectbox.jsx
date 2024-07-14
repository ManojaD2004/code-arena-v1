"use client";
import React, { useEffect, useState } from "react";
// Assuming items is an array of objects with { name, category } keys
// const response = await fetch(
      //   `http://localhost:5000/api/analysis/${params}/results`,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      // const result = await response.json();
      // console.log(result);
import "./style.css";

export default function MultiFilters() {
  const [filteredItems, setFilteredItems] = useState([
    "PLease Select an option",
  ]);
  const [dark, setdark] = useState(false);
  const filters = [
    "pslist",
    "psscan",
    "pstree",
    "psxview",
    "handles",
    "dlllist",
  ];

  const handleFilterButtonClick = (selectedCategory) => {
    setFilteredItems(selectedCategory);
  };

  useEffect(() => {}, []);
  return (
    <div>
      <div className="buttons-container">
        {filters.map((category) => (
          <button
            onClick={() => handleFilterButtonClick(category)}
            className={`button ${setdark ? "" : "active"}`}
            key={`filters-${category}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="items-container">
        <div
          onClick={async (e) => {
            e.preventDefault();
            const res = await fetch(
              "http://localhost:5000/api/analyze?userid=manojadkc2004@gmail.com",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  fileId: 1,
                  plugin: filteredItems,
                  profileName: "Win2008R2SP0x64",
                  pid: 864,
                }),
              }
            );
            const res1 = await res.json();
            window.alert(res1.analysisId);
          }}
          key={`${filteredItems}`}
          className="item bg-black text-white cursor-pointer"
        >
          <p>{filteredItems} Submit</p>
        </div>
      </div>
    </div>
  );
}
