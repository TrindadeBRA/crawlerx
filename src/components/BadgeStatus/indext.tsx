import { PostStatus } from "@prisma/client";
import { twMerge } from "tailwind-merge";

interface BadgeStatusProps {
  status: PostStatus;
}



export function BadgeStatus({ status }: BadgeStatusProps) {

  const translateStatus = {
    [PostStatus.IMPORTED]: 'Importado',
    [PostStatus.PROCESSED]: 'Processado',
  }

  const statusColor = {
    [PostStatus.IMPORTED]: 'bg-yellow-100 text-yellow-800',
    [PostStatus.PROCESSED]: 'bg-green-100 text-green-800',
  }


  return (
    <div>
      <span className={twMerge(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium',
        statusColor[status]
      )}>

        {translateStatus[status]}
      </span>
    </div>
  )
}
