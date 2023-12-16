"use client"
import { FC, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {format} from 'date-fns'
import { cn, toPusherKey } from '@/lib/utils'
import { Message } from '@/lib/validation/message'
import { pusherClient } from '@/lib/pushers'

interface MessagesProps {
  initialMessages: Message[]
  userId: string
  userImg: string | null | undefined
  chatPartner:User
  chatId: string
}

const formatTimestamp = (timestamp: number) => {
  return format(timestamp, 'HH:mm')
}

const Messages: FC<MessagesProps> = ({initialMessages, userId, userImg, chatPartner, chatId}) => {
    
  const [messages, setMessages] = useState<Message[]>(initialMessages)
    const scrollDownRef = useRef<HTMLDivElement | null>(null)

    useEffect(()=>{
      pusherClient.subscribe(toPusherKey(`chat:${chatId}:messages`))

      function handleMessageRecieve(message: Message){
        setMessages(prev => [message,...prev])
      }

      pusherClient.bind('reciveMessage',handleMessageRecieve)
      return () => {
        pusherClient.unsubscribe(toPusherKey(`chat:${chatId}:messages`));
        pusherClient.unbind("reciveMessage", handleMessageRecieve);
      };
    },[])

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />

      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === userId

        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId

        return (
          <div
            className='chat-message'
            key={index}>
            <div
              className={cn('flex items-end', {
                'justify-end': isCurrentUser,
              })}>
              <div
                className={cn(
                  'flex flex-col space-y-2 text-base max-w-xs mx-2',
                  {
                    'order-1 items-end': isCurrentUser,
                    'order-2 items-start': !isCurrentUser,
                  }
                )}>
                <span
                  className={cn('px-4 py-2 rounded-lg inline-block', {
                    'bg-indigo-600 text-white': isCurrentUser,
                    'bg-gray-200 text-gray-900': !isCurrentUser,
                    'rounded-br-none':
                      !hasNextMessageFromSameUser && isCurrentUser,
                    'rounded-bl-none':
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}>
                  {message.text}
                  <span className='ml-2 text-xs text-gray-400'>
                    {formatTimestamp(message.timeStamp)}
                  </span>
                </span>
              </div>

              <div
                className={cn('relative w-6 h-6', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}>
                <Image
                  fill
                  src={
                    isCurrentUser ? (userImg as string) : chatPartner.image
                  }
                  alt='Profile picture'
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default Messages