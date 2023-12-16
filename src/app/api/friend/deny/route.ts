import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST (req:Request) {
    try {
        const body = await req.json()
        const {id: idToDeny} = z.object({id: z.string()}).parse(body)

        const session = await getServerSession(authOptions)

        if(!session){
            return new Response('Unauthorized',{status:409})
        }

        await db.srem(`user:${session.user.id}:recieved_friend_request`,idToDeny)

        return new Response('OK')
    } catch (error)  {
    console.log("🚀 ~ file: route.ts:49 ~ POST ~ error:", error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid Request Payload", { status: 422 });
    }

    return new Response("Invalid Request", { status: 400 });
  }
}