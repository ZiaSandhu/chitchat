import { FC } from 'react'

interface pageProps {
  
}

const page: FC<pageProps> = async({}) => {


  return (
    <div className="m-auto min-h-full flex items-center justify-center">
      <div className='-mt-32'>
        <img className="mx-auto h-32 w-32" src="/chat.svg" alt="chat icon" />
        <p className="text-center text-2xl text-muted">Select Chat to view conversation</p>
      </div>
    </div>
  );
}

export default page