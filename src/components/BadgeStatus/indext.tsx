import { PostStatus } from "@prisma/client";
import { twMerge } from "tailwind-merge";
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

interface BadgeStatusProps {
    status: PostStatus;
}

export function BadgeStatus({ status }: BadgeStatusProps) {

    const translateStatus = {
        [PostStatus.IMPORTED]: 'Importado',
        [PostStatus.PROCESSED]: 'Processado',
    }

    const statusColor = {
        [PostStatus.IMPORTED]: 'bg-brand-600 text-white font-bold border border-brand-600',
        [PostStatus.PROCESSED]: 'bg-brand-100 text-brand-600 font-bold border border-brand-600',
    }

    const statusTooltip = {
        [PostStatus.IMPORTED]: 'Artigo importado e aguardando processamento. Nenhuma ação foi realizada ainda.',
        [PostStatus.PROCESSED]: 'Artigo processado com sucesso e enviado para o webhook.',
    }

    return (
        <>
            <div>
                <span className={twMerge(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium cursor-pointer',
                    statusColor[status]
                )}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={statusTooltip[status]}>

                    {translateStatus[status]}
                </span>
                <Tooltip id="my-tooltip" />
            </div>
        </>
    )
}
