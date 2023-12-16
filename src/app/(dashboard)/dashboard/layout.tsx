
import  Sidebar  from '@/components/Sidebar'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'

interface layoutProps {
  children: ReactNode
}

const layout: FC<layoutProps> = async({children}) => {

  const session = await getServerSession(authOptions)

  if(!session) notFound()

  const unSeenRequestCount = (await fetchRedis('smembers',`user:${session.user.id}:recieved_friend_request`) as string[]).length

  const freindIds = (await fetchRedis('smembers',`user:${session.user.id}:friends`)) as string[]
  const friends = await Promise.all(freindIds.map(async (id)=>{
    const dbFriend = (await fetchRedis('get',`user:${id}`)) as string
    const friend = JSON.parse(dbFriend) as User
    return {
      name: friend.name,
      email: friend.email,
      id: friend.id,
      image: friend.image
    }
  }))
  return (
    <div className="h-screen flex w-full">
     <Sidebar session={session} unSeenRequestCount={unSeenRequestCount} friends={friends} />
      <div className="w-full px-8 pt-10">{children}</div>
    </div>
  );
}

export default layout