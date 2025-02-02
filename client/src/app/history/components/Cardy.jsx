"use client";
import React, { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

const Cardy = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function getData() {
      const res = await fetch(
        "http://localhost:5000/api/analyses?userid=manojadkc2004@gmail.com",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res1 = await res.json();
      console.log(res1);
      setData(res1.analyses);
    }
    getData();
  }, []);
  return (
    <div className="">
      {data.map((ele) => (
        <Card className="flex gap-[90px] mt-9">
          <div>
            <a target="_blank" href={`http://localhost:3000/analysis/${ele.id}`}>
              <CardTitle>{ele.id}</CardTitle>
            </a>
            <CardDescription>{ele.analysis_status}</CardDescription>
            <CardDescription>{ele.date_time}</CardDescription>
          </div>
        </Card>
      ))}
      {/* <Card className="flex gap-[90px]">
        <div>
          <CardTitle>tiger hollo</CardTitle>
          <CardDescription>hello kitty</CardDescription>
          <CardDescription>hello kitty</CardDescription>
        </div>
      </Card> */}
    </div>
  );
};

export default Cardy;

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "max-w-[1200px] w-full mx-auto p-8 rounded-xl border border-gray-600  bg-white shadow-[2px 4px 16px 0px rgba(248,248,248,0.06) inset] group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className }) => {
  return (
    <h3
      className={cn(
        "text-lg font-medium text-black dark:text-black py-2",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className }) => {
  return (
    <p
      className={cn(
        "text-sm font-normal text-black dark:text-black max-w-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
