import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from './useNotification'
// import { useImportModal } from './useImportModal'

interface ScrapingData {
    platform: string
    searchTerm: string
    quantity: number
}

export function useScraping() {
    const { showNotification } = useNotification()
    // const { handleClose } = useImportModal()
    const queryClient = useQueryClient()


    const { mutateAsync: scrapePosts, isPending } = useMutation({
        mutationFn: async (data: ScrapingData) => {
            const response = await fetch('/api/scraping/get-results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    domain: data.platform,
                    searchTerm: data.searchTerm,
                    limit: data.quantity
                }),
            })

            if (!response.ok) {
                throw new Error('Erro ao importar posts')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
            showNotification(
                'Importação de posts',
                'Posts importados com sucesso',
                'success'
            )
            // handleClose()
        },
        onError: (error: Error) => {
            showNotification(
                'Erro na importação',
                error.message || 'Ocorreu um erro ao importar os posts',
                'error'
            )
        },
    })

    return {
        scrapePosts,
        isPending
    }
} 