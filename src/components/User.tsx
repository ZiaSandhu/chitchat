import { FC } from 'react'

import Image from 'next/image';
interface UserProps {
  image: string,
  name: string,
  email: string
}

const User: FC<UserProps> = ({image,name,email}) => {
  return (
    <div className='flex items-center gap-4'>
      <div className="relative h-8 w-8">
        <Image
          fill
          referrerPolicy="no-referrer"
          className="rounded-full"
          src={image || ""}
          alt="Profile"
        />
      </div>
      <div className="flex items center flex-col">
        <h2>{name}</h2>
        <h3>{email}</h3>
      </div>
    </div>
  );
}

export default User