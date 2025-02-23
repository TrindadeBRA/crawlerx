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
    }
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