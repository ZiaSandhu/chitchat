import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { Message } from "@/lib/validation/message"
import { getServerSession } from "next-auth"
import {nanoid} from 'nanoid'
import { pusherServer } from "@/lib/pushers"
import { toPusherKey } from "@/lib/utils"
export async function POST (req:Request) {
    try {
        const {text,chatId} = await req.json()

        const session = await getServerSession(authOptions)

        if(!session) return new Response("Unauthorized",{status:401})

        const [userId1,userId2] = chatId.split('--')

        if(![userId1,userId2].includes(session.user.id))  return new Response("Unauthorized",{status:401})

        const friendId = session.user.id === userId1 ? userId2 : userId1

        const isFriend = await fetchRedis(
            "sismember",
            `user:${session.user.id}:friends`,
            friendId
          );

          if(!isFriend) return new Response("Unauthorized",{status: 401})

          const timeStamp = Date.now()

          const message : Message = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timeStamp

          }

          await pusherServer.trigger(
           toPusherKey( `chat:${chatId}:messages`),
            "reciveMessage",
            message
          )

          await pusherServer.trigger(
            toPusherKey( `user:${friendId}:messages`),
             "newMessage",
             message
           ) 

          await db.zadd(`chat:${chatId}:messages`,{
            score: timeStamp,
            member: JSON.stringify(message)
          });


          return new Response("OK")
    } catch (error) {
      if (error instanceof Error) {
        return new Response(error.message, { status: 500 })
      }
  
      return new Response('Internal Server Error', { status: 500 })
    }
}