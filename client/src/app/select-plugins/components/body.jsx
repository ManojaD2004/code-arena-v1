import React from 'react'
import MultiFilters from './selectbox'
import Hello from "./hello"

const SelectBody = () => {
  return (
   <div className="h-[50rem] w-full  bg-white   bg-grid-black/[0.1] relative flex items-center justify-center pt-50px">
    <div >
     
     <MultiFilters/>
    </div>
  </div>
  )
}

export default SelectBody