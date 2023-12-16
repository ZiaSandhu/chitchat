"use client";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";

import User from "@/components/User";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pushers";
import { toPusherKey } from "@/lib/utils";

interface FriendRequestProps {
  incomingFriendRequest: IncomingFriendRequest[];
  sessionId: string
}

const FriendRequest: FC<FriendRequestProps> = ({ incomingFriendRequest, sessionId }) => {
  const router = useRouter();

  const [requests, setRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequest
  );

  useEffect(()=>{
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:recieved_friend_request`))


    const friendRequestHandler = (request: IncomingFriendRequest) => {
      setRequests(prev => [...prev,request])
    }

    pusherClient.bind('recieved_friend_request',friendRequestHandler)

    return ()=> {
    pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:recieved_friend_request`))
    pusherClient.unbind('recieved_friend_request',friendRequestHandler)

    }

  },[])

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/friend/accept", { id: senderId });
    setRequests((prev) => prev.filter((req) => req.senderId !== senderId));

    router.refresh();
  };
  const denyRequest = async (senderId: string) => {
    await axios.post("/api/friend/deny", { id: senderId });
    setRequests((prev) => prev.filter((req) => req.senderId !== senderId));

    router.refresh();
  };

  return (
    <div className="py-4">
      {requests.length === 0 ? (
        <p className="text-sm text-gray-400 ">No Request</p>
      ) : (
        <>
          <p className="text-sm text-gray-400">
            {requests.length} Requests
          </p>
          {requests.map((request, index) => (
            <div key={index} className="py-4 flex items-center gap-6">
              <User
                image={request.senderImage}
                name={request.senderName}
                email={request.senderEmail}
              />
              <span
                onClick={() => acceptFriend(request.senderId)}
                className="hover:bg-green-400 hover:text-white rounded-full p-2"
              >
                <Check className="h-6 w-6" />
              </span>
              <span
                onClick={() => denyRequest(request.senderId)}
                className="hover:bg-red-400 hover:text-white rounded-full p-2"
              >
                <X className="h-6 w-6" />
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FriendRequest;
