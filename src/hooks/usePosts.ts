import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Post } from '@prisma/client'
import { useNotification } from './useNotification'
import { useState } from 'react'

export function usePosts() {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(30)

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
  const { mutate: processPost } = useMutation({
    mutationFn: async (post: Post) => {
      if (!post.title || !post.content) {
        throw new Error('Título e conteúdo são obrigatórios');
      }

      const payload = {
        title: post.title,
        content: post.content,
      }

      const response = await fetch("/api/ia/process-text", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      

      // Atualizar status do post
      // const statusResponse = await fetch("/api/posts/status", {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ id: post.id, status: 'PROCESSED' }),
      // })

      // if (!statusResponse.ok) {
      //   throw new Error('Falha ao atualizar o status do post')
      // }

        return response.json()
      },
    onSuccess: () => {
      // Invalidar o cache e mostrar notificação de sucesso
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      showNotification(
        'Sucesso',
        'Post processado com sucesso!',
        'success'
      )
    },
    onError: (error: Error) => {
      showNotification(
        'Erro',
        error.message || 'Erro ao processar o post',
        'error'
      )
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

      if (!response.ok) {
        throw new Error('Falha ao salvar o post')
      }

      return response.json()
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
        'Erro',
        error.message || 'Erro ao salvar o post',
        'error'
      )
    }
  })

  return {
    posts: data?.data ?? [],
    isLoading,
    processPost,
    savePost,
    isSaving,
    pagination: {
      page,
      pageSize,
      setPage,
      setPageSize,
      total: data?.total ?? 0,
      pageCount: data?.pageCount ?? 0
    }
  }
} 