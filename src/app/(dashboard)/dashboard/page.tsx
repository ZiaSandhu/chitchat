import { getServerSession } from 'next-auth'
import { FC } from 'react'
import { authOptions } from '@/lib/auth'
interface pageProps {
  
}

const page: FC<pageProps> = async({}) => {

    const session =  await getServerSession(authOptions)

  return (
    <div className='p-10'>
      <h1>name: {session?.user?.name}</h1>
      <h1>image: {session?.user?.image}</h1>
      <h1>id: {session?.user?.id}</h1>
      <h1>email: {session?.user?.email}</h1>
    </div>
  );
}

export default page