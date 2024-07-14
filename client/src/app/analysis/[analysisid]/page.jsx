import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import Component from './components/table'

import Header1 from '../../components/header'

const Page = () => {
  return (
    <ChakraProvider>
        <Header1/>
        <div className='p-[40px] pt-[150px]'>
        <Component/>
        </div>
    </ChakraProvider>
  )
}

export default Page