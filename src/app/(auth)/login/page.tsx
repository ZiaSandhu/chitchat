"use client"

import { FC, useState } from "react";
import { signIn } from "next-auth/react";

import Image from "next/image";

import Button from '@/components/ui/button'
import toast from "react-hot-toast";
interface LoginPageProps {
    
}
 
const LoginPage: FC<LoginPageProps> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function loginFunction() {
        setIsLoading(true)
        try {
          // throw new Error("anything")
            await signIn('google')
        } catch (error) {
            toast.error("Something went wrong!")
        }finally{
            setIsLoading(false)
        }
    }

    return (
      <div className="flex justify-center min-h-screen py-20 px-4 bg-gray-100 sm:px-6 lg:px-8">
        <div className="w-full flex-inline flex-col items-center   max-w-mid space-y-8">
          <div className="flex flex-col items-center px-8">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="chitchat"
                width={100}
                height={100}
              />
            </div>
              <h2 className="text-4xl text-yellow-400">Chit Chat</h2>
            <h2 className="mt-6 text-2xl  text-center tracking-tight text-gray-900">
              Login to you account
            </h2>
          </div>
          <Button
            isLoading={isLoading}
            type="button"
            className="max-w-sm mx-auto w-full flex items-center justify-center gap-2"
            onClick={loginFunction}
          >
            {!isLoading && <svg
              width="20px"
              height="20px"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <path
                fill="#4285F4"
                d="M14.9 8.161c0-.476-.039-.954-.121-1.422h-6.64v2.695h3.802a3.24 3.24 0 01-1.407 2.127v1.75h2.269c1.332-1.22 2.097-3.02 2.097-5.15z"
              />
              <path
                fill="#34A853"
                d="M8.14 15c1.898 0 3.499-.62 4.665-1.69l-2.268-1.749c-.631.427-1.446.669-2.395.669-1.836 0-3.393-1.232-3.952-2.888H1.85v1.803A7.044 7.044 0 008.14 15z"
              />
              <path
                fill="#FBBC04"
                d="M4.187 9.342a4.17 4.17 0 010-2.68V4.859H1.849a6.97 6.97 0 000 6.286l2.338-1.803z"
              />
              <path
                fill="#EA4335"
                d="M8.14 3.77a3.837 3.837 0 012.7 1.05l2.01-1.999a6.786 6.786 0 00-4.71-1.82 7.042 7.042 0 00-6.29 3.858L4.186 6.66c.556-1.658 2.116-2.89 3.952-2.89z"
              />
            </svg>}
            Google
          </Button>
        </div>
      </div>
    );
}
 
export default LoginPage;