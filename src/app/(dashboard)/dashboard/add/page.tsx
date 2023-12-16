"use client"

import { FC } from 'react'
import AddFriend from '@/components/AddFriend'
interface pageProps {
  
}

const page: FC<pageProps> = ({}) => {
  return   <main className='pt-8'>
  <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
  <AddFriend />
</main>
}

export default page