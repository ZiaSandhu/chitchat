import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

import { messageArrayValidator } from "@/lib/validation/message";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import User from "@/components/User";
import Messages from "@/components/Messages";
import ChatInput from "@/components/ChatInput";

interface PageProps {
  params: {
    chatId: string;
  };
}

async function getMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = results.map((message) => JSON.parse(message) as Message);

    const reverseDbMessage = dbMessages.reverse();

    const messages = messageArrayValidator.parse(reverseDbMessage);

    return messages;
  } catch (error) {
    notFound();
  }
}

const page: FC<PageProps> = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions);

  const { chatId } = params;

  if (!session) {
    notFound();
  }

  const { user } = session;

  const [userId1, userId2] = chatId.split("--");

  if (user.id !== userId1 && user.id !== userId2) notFound();

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;

  const dbChatPartner = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`
  )) as string;
  const chatPartner = JSON.parse(dbChatPartner) as User;
  
  const initialMessages = await getMessages(chatId)
  
  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <User image={chatPartner.image} name={chatPartner.name} email={chatPartner.email} />
      </div>

      <Messages
      chatId={chatId}
      chatPartner={chatPartner}
      userImg={session.user.image}
      userId={session.user.id}
      initialMessages={initialMessages}
    />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default page;
