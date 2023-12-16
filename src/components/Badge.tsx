
import { FC } from 'react'

interface BadgeProps {
  count: number
}

const Badge: FC<BadgeProps> = ({count = 0}) => {
  return (
    <>
      {count > 0 && (
        <span className="bg-green-400 text-white text-sm flex items-center justify-center h-5 w-5 rounded-full">
          {count}
        </span>
      )}
    </>
  );
}

export default Badge