import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import Component from './components/table'

import Header1 from '../../components/header'

const Page = ({params}) => {
  // console.log(params);
  return (
    <ChakraProvider>
        <Header1/>
        <div className='p-[40px] pt-[150px]'>
        <Component params={params.analysisid}/>
        </div>
    </ChakraProvider>
  )
}

export default Page