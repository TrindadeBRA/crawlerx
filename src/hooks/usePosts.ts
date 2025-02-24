import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Post } from '@prisma/client'
import { useNotification } from './useNotification'
import { useState } from 'react'

export function usePosts() {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(30)
  const [processingQueue, setProcessingQueue] = useState<number[]>([])

  // Query para listar os posts
  const { data, isLoading } = useQuery({
    queryKey: ['posts', page, pageSize],
    queryFn: async () => {
      const response = await fetch(`/api/posts/list?page=${page}&pageSize=${pageSize}`)
      if (!response.ok) {
        throw new Error('Falha ao buscar posts')
      }
      return response.json()
    },
    refetchInterval: 1000,
    refetchOnWindowFocus: false
  })

  // Mutation para processar um post
  const { mutate: processPost, isPending: isProcessingText } = useMutation({
    mutationFn: async (post: Post) => {
      setProcessingQueue(prev => [...prev, post.id])
      if (!post.title || !post.content) {
        throw new Error('Título e conteúdo são obrigatórios');
      }

      const response = await fetch("/api/ia/process-text", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          id: post.id,
        }),
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Erro ao processar o post');
      }

      return data;
    },
    onSuccess: (_, post) => {
      setProcessingQueue(prev => prev.filter(id => id !== post.id))
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      showNotification('Sucesso', 'Post processado com sucesso!', 'success')
    },
    onError: (error: Error, post) => {
      setProcessingQueue(prev => prev.filter(id => id !== post.id))
      showNotification('Erro', error.message, 'error')
    }
  })

  // Mutation para processar uma imagem
  const { mutate: processImage, isPending: isProcessingImage } = useMutation({
    mutationFn: async (post: Post) => {
      setProcessingQueue(prev => [...prev, post.id])
      const response = await fetch("/api/ia/process-image", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleProcessed: post.processed_full_post,
          id: post.id,
        }),
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Erro ao processar a imagem');
      }

      return data;
    },
    onSuccess: (_, post) => {
      setProcessingQueue(prev => prev.filter(id => id !== post.id))
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      showNotification('Sucesso', 'Imagem processada com sucesso!', 'success')
    },
    onError: (error: Error, post) => {
      setProcessingQueue(prev => prev.filter(id => id !== post.id))
      showNotification('Erro', error.message, 'error')
    }
  })

  // Mutation para salvar um post
  const { mutate: savePost, isPending: isSaving } = useMutation({
    mutationFn: async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch('/api/posts/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        const errorMessage = data.error?.includes('URL já existe')
          ? `A URL "${postData.url}" já está cadastrada no sistema`
          : data.error || 'Erro ao importar artigo'
        
        throw new Error(errorMessage)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      showNotification(
        
        'Sucesso',
        'Post salvo com sucesso!',
        'success'
      )
    },
    onError: (error: Error) => {
      showNotification(
        'Erro na Importação',
        error.message.replace('Error:', '').trim(),
        'error'
      )
    }
  })

  // Mutation para remover um post
  const { mutate: removePost, isPending: isRemoving } = useMutation({
    mutationFn: async (postId: number) => {
      const response = await fetch('/api/posts/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId }),
      })

      if (!response.ok) { 
        throw new Error('Falha ao remover o post')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      showNotification(
        'Sucesso',
        'Post removido com sucesso!',
        'success'
      )
    },
    onError: (error: Error) => {
      showNotification(
        'Erro',
        error.message || 'Erro ao remover o post',
        'error'
      )
    }
  })

  // Mutation para publicar no WordPress
  const { mutate: publishPost, isPending: isPublishing } = useMutation({
    mutationFn: async (post: Post) => {
      // Validações iniciais
      if (!post.processed_title || !post.processed_content || !post.processed_seo_content) {
        throw new Error('Post não está completamente processado. Certifique-se que o texto foi processado.');
      }

      if (!post.processed_image_url) {
        throw new Error('Post não possui imagem processada. Certifique-se que a imagem foi processada.');
      }

      setProcessingQueue(prev => [...prev, post.id])

      try {
        const response = await fetch("/api/crawlerx-wp/routes/publish-post", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            post: {
              ...post,
              // Garantindo que os campos processados sejam enviados
              title: post.processed_title,
              content: post.processed_content,
              seoDescription: post.processed_seo_content,
              imageUrl: post.processed_image_url
            }
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao publicar o post');
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Falha na publicação do post');
        }

        return data;
      } catch (error) {
        console.error('Erro ao publicar:', error);
        throw error;
      }
    },
    onSuccess: (_, post) => {
      setProcessingQueue(prev => prev.filter(id => id !== post.id))
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      showNotification('Sucesso', 'Post publicado com sucesso!', 'success')
    },
    onError: (error: Error, post) => {
      setProcessingQueue(prev => prev.filter(id => id !== post.id))
      showNotification('Erro', error.message, 'error')
    }
  })

  return {
    posts: data?.data ?? [],
    isLoading,
    processPost,
    isProcessingText,
    processImage,
    isProcessingImage,
    removePost,
    isRemoving,
    savePost,
    isSaving,
    publishPost,
    isPublishing,
    pagination: {
      page,
      pageSize,
      setPage,
      setPageSize,
      total: data?.total ?? 0,
      pageCount: data?.pageCount ?? 0
    },
    processingQueue,
  }
} 