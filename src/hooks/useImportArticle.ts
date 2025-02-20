import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from './useNotification'

interface ImportArticleData {
  url: string;
  domain: string;
}

export function useImportArticle() {
  const { showNotification } = useNotification()
  const queryClient = useQueryClient()

  const { mutateAsync: importArticle, isPending } = useMutation({
    mutationFn: async (data: ImportArticleData) => {
      const response = await fetch('/api/scraping/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao importar artigo')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      showNotification(
        'Importação de artigo',
        'Artigo importado com sucesso',
        'success'
      )
    },
    onError: (error: Error) => {
      showNotification(
        'Erro na importação',
        error.message || 'Ocorreu um erro ao importar o artigo',
        'error'
      )
    },
  })

  return {
    importArticle,
    isPending
  }
} 