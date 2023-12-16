const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
) {
    const commandUrl = `${upstashUrl}/${command}/${args.join('/')}`

    const response = await fetch(
        commandUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if(!response.ok){
        throw new Error(`Error executing redis command ${response.statusText}`)
      }

      const data = await response.json()
      return data.result
    }
