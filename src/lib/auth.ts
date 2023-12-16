import {NextAuthOptions} from 'next-auth'
import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter'
import GoogleProvider from 'next-auth/providers/google'

import { db } from './db'
import { fetchRedis } from '@/helpers/redis'

function getCredentials() {
    const cliendId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if(!cliendId || cliendId.length === 0){
        throw new Error('Missing Google Client Id')
    }

    if(!clientSecret || clientSecret.length === 0){
        throw new Error('Missing Google Client Secret')
    }

    return {cliendId, clientSecret}

}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session : {
        strategy: "jwt"
    },
    pages: {
        signIn: '/login'
    },
    providers:[
        GoogleProvider({
            clientId: getCredentials().cliendId,
            clientSecret: getCredentials().clientSecret
        })
    ],
    callbacks:{
        async jwt({ token, user }) {
            const dbUserResult = await fetchRedis('get',`user:${token.id}`) as string || null
            if(!dbUserResult){
                return {
                    id: user!.id, // You need to ensure user is not null here
                  };
            }

            const dbUser = JSON.parse(dbUserResult) as User

            return {
                name: dbUser.name,
                id: dbUser.id,
                email: dbUser.email,
                picture: dbUser.image
            }
        },
    
        async session({ session, token }) {
            if (token) {
              session.user.id = token.id
              session.user.name = token.name
              session.user.email = token.email
              session.user.image = token.picture
            }
      
            return session
          },
          redirect() {
            return '/dashboard'
          },
    }
}