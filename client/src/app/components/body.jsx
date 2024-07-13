import React from "react";

export default function Body() {
  return (
    <div className="h-[50rem] w-full  bg-white   bg-grid-black/[0.1] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center  bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text  py-8 text-[#8b3dff]">
        Volatility Framework
      </p>
    </div>
  );
}
