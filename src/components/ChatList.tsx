"use client";
import { FC, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import path from "path";
import Link from "next/link";

import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import Badge from "./Badge";
import { pusherClient } from "@/lib/pushers";

interface ChatListProps {
  friends: User[];
  userId: string;
}

const ChatList: FC<ChatListProps> = ({ friends, userId }) => {
  const router = useRouter();
  const pathName = usePathname();
  const [unSeenMessages, setUnSeenMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (pathName?.includes("chat")) {
      setUnSeenMessages((prev) =>
        prev.filter((msg) => !pathName?.includes(msg.senderId))
      );
    }
  }, []);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${userId}:messages`));

    pusherClient.subscribe(toPusherKey(`user:${userId}:friends`))

    function handleNewMessage(message: Message) {
        const shouldNotify =
        pathName !==
        `/dashboard/chat/${chatHrefConstructor(userId, message.senderId)}`;
      if (shouldNotify) {
        setUnSeenMessages((prev) => [...prev, message]);
      }
    }

    function handleNewFriend (){
      router.refresh();
    }

    pusherClient.bind("newMessage", handleNewMessage);
    pusherClient.bind('newFriend',handleNewFriend)
    
    return () => {
    pusherClient.unsubscribe(toPusherKey(`user:${userId}:friends`))
    pusherClient.unsubscribe(toPusherKey(`user:${userId}:messages`));
      pusherClient.unbind("newMessage", handleNewMessage);
    pusherClient.unbind('newFriend',handleNewFriend)

    };
  }, [pathName, userId, router ]);

  return (
    <ul className="mt-4 mx-3 space-y-2 max-h-[25rem]">
      {friends.length > 0 ? (
        friends.map(({ image, name, id }, index) => {
          const unSeenMessagesCount = unSeenMessages.filter(
            (msg) => msg.senderId === id
          ).length;
          return (
            <li
              key={index}
              className="  text-gray-700 hover:bg-gray-100 px-3 truncate py-1 rounded-md"
              onClick={()=>{
                setUnSeenMessages(prev => 
                  prev.filter((msg) => msg.senderId !== id)
                )
              }}
            >
              <Link href={`/dashboard/chat/${chatHrefConstructor(id, userId)}`}>
                <div className="flex items-center gap-4  ">
                  <div className="relative h-6 w-6">
                    <Image
                      fill
                      referrerPolicy="no-referrer"
                      className="rounded-full"
                      src={image || ""}
                      alt="Profile"
                    />
                  </div>
                  <h2 className="text-lg">{name}</h2>
                  <Badge count={unSeenMessagesCount} />
                </div>
              </Link>
            </li>
          );
        })
      ) : (
        <p className="text-gray-500">NO Chat</p>
      )}
    </ul>
  );
};

export default ChatList;
