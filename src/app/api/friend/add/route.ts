import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pushers";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validation/addFriend"
import { getServerSession } from "next-auth";

import { z } from "zod";

export async function POST(req: Request){
  try {
    const body = await req.json();

    const { email } = addFriendValidator.parse(body.email);

    const idToAdd = await fetchRedis('get',`user:email:${email}`) as string

    if (!idToAdd) return new Response("User don't exist", { status: 400 });

    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized", { status: 401 });

    if (idToAdd === session.user?.id)
      return new Response("You can't add yourself", { status: 403 });

      // user already added

      const isAlreadyAdded = (await fetchRedis(
        "sismember",
        `user:${idToAdd}:recieved_friend_requests`,
        session.user.id
      )) as 0 | 1

      if (isAlreadyAdded) {
        return new Response("Request already sent", { status: 400 });
      }

      const isAlreadyFriend = (await fetchRedis(
        "sismember",
        `user:${session.user.id}:friends`,
        idToAdd
      )) as 0 | 1

      if (isAlreadyFriend) {
        return new Response("Already Friend", { status: 400 });
      }
      // valid request

      await pusherServer.trigger(
        toPusherKey(`user:${idToAdd}:recieved_friend_request`),
        "recieved_friend_request",
        {
          senderId: session.user.id,
          senderEmail: session.user.email,
          senderName: session.user.name,
          senderImage: session.user.image,
        }
      );
      await pusherServer.trigger(
        toPusherKey(`add:${idToAdd}:friend`),
        "recieved_friend_request",
        {
          senderId: session.user.id,
          senderEmail: session.user.email,
          senderName: session.user.name,
          senderImage: session.user.image,
        }
      );


      db.sadd(`user:${idToAdd}:recieved_friend_request`,session.user.id)

      return new Response('OK')

  } catch (error) {
      console.log("🚀 ~ file: route.ts:65 ~ POST ~ error:", error)
      if(error instanceof z.ZodError){
      return new Response("Invalid Request Payload", { status: 422 });
    }

    return new Response("Invalid Request", { status: 400 });

   
  }
}