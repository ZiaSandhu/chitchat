import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pushers";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // verfify both users are not friend

    const isAlreadyFriend = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriend) {
      return new Response("Already Friend", { status: 400 });
    }

    const hasFriendREquest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:recieved_friend_request`,
      idToAdd
    );
   
    if(!hasFriendREquest){
        return new Response("No Request to Accept",{status: 400})
    }

    // const [userRaw, friendRaw] = (await Promise.all([
    //   fetchRedis('get', `user:${session.user.id}`),
    //   fetchRedis('get', `user:${idToAdd}`),
    // ])) as [string, string]

    // const user = JSON.parse(userRaw) as User
    // const friend = JSON.parse(friendRaw) as User

    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:friends`),
      'newFriend',
      {}
    )

    

    await db.sadd(`user:${session.user.id}:friends`,idToAdd)

    await db.sadd(`user:${idToAdd}:friends`,session.user.id)

    await db.srem(`user:${session.user.id}:recieved_friend_request`,idToAdd)

    return new Response("OK");
  } catch (error) {
    console.log("🚀 ~ file: route.ts:49 ~ POST ~ error:", error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid Request Payload", { status: 422 });
    }

    return new Response("Invalid Request", { status: 400 });
  }
}
