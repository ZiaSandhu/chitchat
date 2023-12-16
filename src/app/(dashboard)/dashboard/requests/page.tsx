import FriendRequest from '@/components/FriendRequest'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  
}

const page: FC<pageProps> = async({}) => {

  const session  = await getServerSession(authOptions)

  if(!session) {
    notFound()
  }


  const recievedRequestsIds = await fetchRedis('smembers',`user:${session.user.id}:recieved_friend_request`) as string[]

  const friendRequests = await Promise.all(recievedRequestsIds.map(async (senderId)=>{
    const sender = (await fetchRedis('get',`user:${senderId}`)) as string
    const senderUser = JSON.parse(sender) as User
    return {
      senderId:senderUser.id,
      senderEmail: senderUser.email,
      senderName: senderUser.name,
      senderImage: senderUser.image
    }
  }))

  return <div className='px-8 sm:px-4 md:px-6 '>
    <h1 className='text-lg font-semibold'>Friend Requests</h1>
    <FriendRequest incomingFriendRequest={friendRequests} sessionId = {session.user.id} />
  </div>
}

export default page