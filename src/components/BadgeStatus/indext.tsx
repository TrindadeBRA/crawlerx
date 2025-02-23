import { PostStatus } from "@prisma/client";
import { twMerge } from "tailwind-merge";
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

interface BadgeStatusProps {
    status: PostStatus;
    disableTooltip?: boolean;
}

export function BadgeStatus({ status, disableTooltip = false }: BadgeStatusProps) {

    const translateStatus = {
        [PostStatus.IMPORTED]: 'Importado',
        [PostStatus.PROCESSED_TEXT]: 'Texto processado',
        [PostStatus.PROCESSED_IMAGE]: 'Imagem processada',
        [PostStatus.FAILED]: 'Falhou',
        [PostStatus.POSTED]: 'Publicado',
    }

    const statusColor = {
        [PostStatus.IMPORTED]: 'bg-brand-600 text-white font-bold border border-brand-600',
        [PostStatus.PROCESSED_TEXT]: 'bg-brand-100 text-brand-600 font-bold border border-brand-600',
        [PostStatus.PROCESSED_IMAGE]: 'bg-brand-200 text-brand-600 font-bold border border-brand-600',
        [PostStatus.FAILED]: 'bg-red-600 text-white font-bold border border-red-600',
        [PostStatus.POSTED]: 'bg-green-600 text-white font-bold border border-green-600',
    }


    const statusTooltip = {
        [PostStatus.IMPORTED]: 'Artigo importado e aguardando processamento. Nenhuma ação foi realizada ainda.',
        [PostStatus.PROCESSED_TEXT]: 'Texto processado com IA e aguardando processamento da imagem.',
        [PostStatus.PROCESSED_IMAGE]: 'Imagem processada com IA e aguardando publicação.',
        [PostStatus.FAILED]: 'Ocorreu um erro ao processar o artigo.',
        [PostStatus.POSTED]: 'Artigo publicado com sucesso.',
    }

    return (
        <>
            <div>
                <span
                    className={twMerge(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium cursor-pointer',
                        statusColor[status]
                    )}
                    data-tooltip-id={disableTooltip ? undefined : 'my-tooltip'}
                    data-tooltip-content={statusTooltip[status]}
                >

                    {translateStatus[status]}

                </span>
                {!disableTooltip && <Tooltip id="my-tooltip" />}
            </div>
        </>
    )
}
