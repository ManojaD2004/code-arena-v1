import React from "react";
import { cn } from "../../utils/cn";
import Cardy from "./Cardy";

const Body = () => {
  return (
    <div className="h-[50rem] w-full  bg-white   bg-grid-black/[0.1] relative flex items-center justify-center pt-50px">
      <div >
        <Cardy/>
      </div>
    </div>
  );
};

export default Body;

