"use client"

import { FC, useEffect, useState } from 'react'
import { Icon, Icons } from '@/components/Icon';
import Link from 'next/link';
import Image from 'next/image';
import SignoutButton from '@/components/SignoutButton';
import ChatList from './ChatList';
import Badge from './Badge';

import { pusherClient } from '@/lib/pushers';
import { toPusherKey } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  session: any,
  unSeenRequestCount: number,
  friends: User[]
}

interface SidebarOption  {
    name:string,
    href:string,
    Icon: Icon
}   

const sidebarOptions: SidebarOption[] = [
    {
        name: "Add Friend",
        href:"/dashboard/add",
        Icon:"UserPlus"
    },
    {
        name: "Friends Requests",
        href:"/dashboard/requests",
        Icon:"User"
    },
]

const Sidebar: FC<SidebarProps> = ({session, unSeenRequestCount, friends}) => {

  const [unSeenCount, setUnSeenCount] = useState<number>(unSeenRequestCount)
  const pathName = usePathname()
  useEffect(()=>{
    pusherClient.subscribe(toPusherKey(`user:${session.user.id}:recieved_friend_request`))

    const friendRequestHandler = () => {
      // let shouldNotify = pathName !==  '/dashboard/request'
      // if()
      setUnSeenCount(prev => prev + 1)
    }

    pusherClient.bind('recieved_friend_request',friendRequestHandler)

    return ()=> {
    pusherClient.unsubscribe(toPusherKey(`user:${session.user.id}:recieved_friend_request`))
    pusherClient.unbind('recieved_friend_request',friendRequestHandler)

    }

  },[])

  return (
    <div className="h-full w-full max-w-xs flex flex-col px-6 gap-y-5 overflow-y-auto border-r border-gray-200">
      <div className="h-20 flex items-center justify-start">
        <Link href="/dashboard" className="flex items-center justify-start">
          <Icons.Logo className="h-14 w-auto" />
        </Link>
        <Link href="/dashboard">
          <h1 className="text-3xl font-semibold text-green-400">ChitChat</h1>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-6">
          <li className="text-sm text-gray-500">
            Your Chats
            <ChatList friends={friends} userId={session.user.id}/>
          </li>
          <li className="text-sm text-gray-500">
            OverView
            <ul className="mt-4 mx-3 space-y-2">
              {sidebarOptions.map((option, index) => {
                const Icon = Icons[option.Icon];
                return (
                  <li className="" key={index}>
                    <Link
                      href={option.href}
                      className="text-gray-700 hover:text-green-400 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    >
                      <span className="text-gray-400 border-gray-200 p-1 group-hover:border-green-400 group-hover:text-green-400 flex shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-medium bg-white">
                        <Icon className="h-4 w-4" />
                      </span>

                      <span className="truncate">{option.name}</span>

                      {option.name === "Friends Requests" &&
                       <Badge count={unSeenCount} />
                       }
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          <li className="mt-auto -mx-6 flex items-center mb-5">
            <div className="flex flex-1 items-center py-2 px-6 gap-x-4">
              <div className="relative h-8 w-8">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  src={session.user.image || ""}
                  alt="Profile"
                />
              </div>
              <div className="flex items center flex-col">
                <h2>{session.user.name}</h2>
                <h3>{session.user.email}</h3>
              </div>
              <SignoutButton className="h-full aspect-square" />
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar